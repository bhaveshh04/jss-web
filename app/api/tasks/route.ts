import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();

  const { searchParams } = req.nextUrl;
  const assignedTo = searchParams.get("assignedTo");
  const status = searchParams.get("status");

  // Employees can only ever see their own tasks, regardless of query params.
  const where =
    me.role === "OWNER"
      ? {
          ...(assignedTo ? { assignedToId: assignedTo } : {}),
          ...(status ? { status: status as "PENDING" | "IN_PROGRESS" | "COMPLETED" } : {}),
        }
      : {
          assignedToId: me.id,
          ...(status ? { status: status as "PENDING" | "IN_PROGRESS" | "COMPLETED" } : {}),
        };

  const tasks = await prisma.task.findMany({
    where,
    include: { assignedTo: { select: { id: true, name: true } } },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });

  return NextResponse.json({ tasks });
}

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().optional(), // ISO date string
  assignedToId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const assignee = await prisma.user.findUnique({ where: { id: parsed.data.assignedToId } });
  if (!assignee || !assignee.active) {
    return NextResponse.json({ error: "Assignee not found or inactive." }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      assignedToId: parsed.data.assignedToId,
      createdById: me.id,
    },
  });

  await prisma.activityLog.create({
    data: { type: "TASK_ASSIGNED", message: `${me.name} assigned "${task.title}" to ${assignee.name}.` },
  });

  return NextResponse.json({ task });
}
