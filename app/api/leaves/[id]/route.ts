import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();
  const { id } = await params;

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const leave = await prisma.leaveRequest.findUnique({ where: { id }, include: { user: true } });
  if (!leave) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: { status: parsed.data.status, reviewedById: me.id },
  });

  await prisma.activityLog.create({
    data: {
      type: parsed.data.status === "APPROVED" ? "LEAVE_APPROVED" : "LEAVE_REJECTED",
      message: `${me.name} ${parsed.data.status === "APPROVED" ? "approved" : "rejected"} leave for ${leave.user.name}.`,
    },
  });

  return NextResponse.json({ leaveRequest: updated });
}
