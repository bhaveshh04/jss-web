import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, toSafeUser, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  const { id } = await params;

  if (me.role !== "OWNER" && me.id !== id) return forbidden();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ user: toSafeUser(user) });
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();
  const { id } = await params;

  if (id === me.id) {
    return NextResponse.json({ error: "Owner account can't be edited from this screen." }, { status: 400 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const user = await prisma.user.update({ where: { id }, data: parsed.data });

  if (typeof parsed.data.active === "boolean") {
    await prisma.activityLog.create({
      data: {
        type: parsed.data.active ? "USER_ACTIVATED" : "USER_DEACTIVATED",
        message: `${me.name} ${parsed.data.active ? "reactivated" : "deactivated"} ${user.name}.`,
      },
    });
  }

  return NextResponse.json({ user: toSafeUser(user) });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();
  const { id } = await params;

  if (id === me.id) {
    return NextResponse.json({ error: "You can't delete the owner account." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.user.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { type: "USER_DELETED", message: `${me.name} deleted employee ${target.name}.` },
  });

  return NextResponse.json({ ok: true });
}
