import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { parseDateOnly, todayDateOnly } from "@/lib/date";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();

  const { searchParams } = req.nextUrl;
  const requestedUserId = searchParams.get("userId") ?? me.id;

  if (me.role !== "OWNER" && requestedUserId !== me.id) return forbidden();

  const to = parseDateOnly(searchParams.get("to")) ?? todayDateOnly();
  const from =
    parseDateOnly(searchParams.get("from")) ??
    new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000); // default: trailing 30 days

  const records = await prisma.attendance.findMany({
    where: {
      userId: requestedUserId,
      date: { gte: from, lte: to },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ records });
}
