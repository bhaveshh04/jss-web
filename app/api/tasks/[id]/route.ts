import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().nullable().optional(),
  assignedToId: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  const { id } = await params;

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  // Employees may only flip the status of their own task — nothing else.
  if (me.role !== "OWNER") {
    if (task.assignedToId !== me.id) return forbidden();
    const onlyStatus = Object.keys(parsed.data).every((k) => k === "status");
    if (!onlyStatus || !parsed.data.status) return forbidden();

    const updated = await prisma.task.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ task: updated });
  }

  const data = { ...parsed.data } as Record<string, unknown>;
  if (parsed.data.dueDate !== undefined) {
    data.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;
  }

  const updated = await prisma.task.update({ where: { id }, data });
  return NextResponse.json({ task: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();
  const { id } = await params;

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.task.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { type: "TASK_DELETED", message: `${me.name} deleted task "${task.title}".` },
  });

  return NextResponse.json({ ok: true });
}
