import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { parseDateOnly, todayDateOnly, formatDateOnly } from "@/lib/date";

export const runtime = "nodejs";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatTime(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(11, 16); // HH:MM UTC
}

export async function GET(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const { searchParams } = req.nextUrl;
  const to = parseDateOnly(searchParams.get("to")) ?? todayDateOnly();
  const from = parseDateOnly(searchParams.get("from")) ?? to;
  const userId = searchParams.get("userId") || undefined;

  const records = await prisma.attendance.findMany({
    where: {
      userId,
      date: { gte: from, lte: to },
    },
    include: { user: true },
    orderBy: [{ date: "asc" }, { user: { name: "asc" } }],
  });

  const header = ["Date", "Employee", "Email", "Department", "Clock In (UTC)", "Clock Out (UTC)", "Hours Worked"];
  type Row = (typeof records)[number];
  const rows = records.map((r: Row) => {
    const hours =
      r.inTime && r.outTime
        ? ((r.outTime.getTime() - r.inTime.getTime()) / 3_600_000).toFixed(2)
        : "";
    return [
      formatDateOnly(r.date),
      r.user.name,
      r.user.email,
      r.user.department ?? "",
      formatTime(r.inTime),
      formatTime(r.outTime),
      hours,
    ];
  });

  const csv = [header, ...rows]
    .map((row: (string | number)[]) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");

  const filename = `attendance_${formatDateOnly(from)}_to_${formatDateOnly(to)}.csv`;

  await prisma.activityLog.create({
    data: { type: "ATTENDANCE_EXPORTED", message: `${me.name} exported attendance (${filename}).` },
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
