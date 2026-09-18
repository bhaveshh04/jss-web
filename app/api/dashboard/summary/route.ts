import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { todayDateOnly, formatDateOnly } from "@/lib/date";

export const runtime = "nodejs";

function lastNDays(n: number): Date[] {
  const today = todayDateOnly();
  return Array.from({ length: n }, (_, i) => new Date(today.getTime() - (n - 1 - i) * 86_400_000));
}

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return unauthorized();

  const today = todayDateOnly();
  const days = lastNDays(7);
  const rangeStart = days[0];

  if (me.role === "OWNER") {
    const [teamSize, presentToday, openTasks, pendingLeaves, weekAttendance, taskGroups, recentActivity] =
      await Promise.all([
        prisma.user.count({ where: { role: "EMPLOYEE", active: true } }),
        prisma.attendance.count({ where: { date: today, inTime: { not: null } } }),
        prisma.task.count({ where: { status: { not: "COMPLETED" } } }),
        prisma.leaveRequest.count({ where: { status: "PENDING" } }),
        prisma.attendance.findMany({
          where: { date: { gte: rangeStart, lte: today }, inTime: { not: null } },
          select: { date: true },
        }),
        prisma.task.groupBy({ by: ["status"], _count: { status: true } }),
        prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      ]);

    const attendanceByDay = days.map((d) => {
      const key = formatDateOnly(d);
      const count = weekAttendance.filter((a: { date: Date }) => formatDateOnly(a.date) === key).length;
      return { date: key, present: count };
    });

    const taskStatus = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 } as Record<string, number>;
    for (const g of taskGroups) taskStatus[g.status] = g._count.status;

    return NextResponse.json({
      role: "OWNER",
      stats: { teamSize, presentToday, openTasks, pendingLeaves },
      weeklyAttendance: attendanceByDay,
      taskStatus,
      recentActivity,
    });
  }

  // EMPLOYEE
  const [myOpenTasks, myPendingLeaves, todaysAttendance, myWeekAttendance, myTaskGroups] = await Promise.all([
    prisma.task.count({ where: { assignedToId: me.id, status: { not: "COMPLETED" } } }),
    prisma.leaveRequest.count({ where: { userId: me.id, status: "PENDING" } }),
    prisma.attendance.findUnique({ where: { userId_date: { userId: me.id, date: today } } }),
    prisma.attendance.findMany({
      where: { userId: me.id, date: { gte: rangeStart, lte: today } },
      select: { date: true, inTime: true },
    }),
    prisma.task.groupBy({ by: ["status"], where: { assignedToId: me.id }, _count: { status: true } }),
  ]);

  const attendanceByDay = days.map((d) => {
    const key = formatDateOnly(d);
    const record = myWeekAttendance.find((a: { date: Date; inTime: Date | null }) => formatDateOnly(a.date) === key);
    return { date: key, present: record?.inTime ? 1 : 0 };
  });

  const taskStatus = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 } as Record<string, number>;
  for (const g of myTaskGroups) taskStatus[g.status] = g._count.status;

  return NextResponse.json({
    role: "EMPLOYEE",
    stats: {
      openTasks: myOpenTasks,
      pendingLeaves: myPendingLeaves,
      clockedIn: Boolean(todaysAttendance?.inTime),
      clockedOut: Boolean(todaysAttendance?.outTime),
    },
    weeklyAttendance: attendanceByDay,
    taskStatus,
  });
}
