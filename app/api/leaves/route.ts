import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();

  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId");
  const status = searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED" | null;

  const where =
    me.role === "OWNER"
      ? { ...(userId ? { userId } : {}), ...(status ? { status } : {}) }
      : { userId: me.id, ...(status ? { status } : {}) };

  const leaveRequests = await prisma.leaveRequest.findMany({
    where,
    include: { user: { select: { id: true, name: true, department: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leaveRequests });
}

const createSchema = z
  .object({
    fromDate: z.string(),
    toDate: z.string(),
    reason: z.string().min(3, "Please add a short reason."),
  })
  .refine((d) => new Date(d.fromDate) <= new Date(d.toDate), {
    message: "From date must be before or equal to the to date.",
    path: ["toDate"],
  });

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role === "OWNER") return forbidden(); // owner approves leave, doesn't file it here

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const leave = await prisma.leaveRequest.create({
    data: {
      userId: me.id,
      fromDate: new Date(parsed.data.fromDate),
      toDate: new Date(parsed.data.toDate),
      reason: parsed.data.reason,
    },
  });

  await prisma.activityLog.create({
    data: { type: "LEAVE_REQUESTED", message: `${me.name} requested leave.` },
  });

  return NextResponse.json({ leaveRequest: leave });
}
