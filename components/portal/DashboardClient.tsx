"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ListChecks, CalendarDays, UserCheck, Clock3 } from "lucide-react";
import { usePortalUser } from "./PortalProviders";
import { StatCard, Card, EmptyState } from "./ui";
import { WeeklyAttendanceChart, TaskStatusChart } from "./Charts";
import ClockInOutWidget from "./ClockInOutWidget";

type OwnerSummary = {
  role: "OWNER";
  stats: { teamSize: number; presentToday: number; openTasks: number; pendingLeaves: number };
  weeklyAttendance: { date: string; present: number }[];
  taskStatus: Record<string, number>;
  recentActivity: { id: string; type: string; message: string; createdAt: string }[];
};

type EmployeeSummary = {
  role: "EMPLOYEE";
  stats: { openTasks: number; pendingLeaves: number; clockedIn: boolean; clockedOut: boolean };
  weeklyAttendance: { date: string; present: number }[];
  taskStatus: Record<string, number>;
};

type Summary = OwnerSummary | EmployeeSummary;

export default function DashboardClient() {
  const user = usePortalUser();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/dashboard/summary");
    if (res.ok) setSummary(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading || !summary) {
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Card key={i} className="h-28 animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-slate">
          {user.role === "OWNER" ? "Company-wide overview." : "Your attendance, tasks and leave at a glance."}
        </p>
      </div>

      {summary.role === "OWNER" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Present today" value={summary.stats.presentToday} hint={`of ${summary.stats.teamSize} active employees`} />
          <StatCard label="Open tasks" value={summary.stats.openTasks} />
          <StatCard label="Pending leaves" value={summary.stats.pendingLeaves} />
          <StatCard label="Team size" value={summary.stats.teamSize} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Today"
            value={summary.stats.clockedOut ? "Done" : summary.stats.clockedIn ? "Clocked in" : "Not clocked in"}
          />
          <StatCard label="Open tasks" value={summary.stats.openTasks} />
          <StatCard label="Pending leaves" value={summary.stats.pendingLeaves} />
        </div>
      )}

      {user.role === "EMPLOYEE" && (
        <ClockInOutWidget
          clockedIn={(summary as EmployeeSummary).stats.clockedIn}
          clockedOut={(summary as EmployeeSummary).stats.clockedOut}
          onChange={load}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-heading text-lg font-semibold text-navy">
            {user.role === "OWNER" ? "Attendance this week" : "Your attendance this week"}
          </h2>
          <div className="mt-4">
            <WeeklyAttendanceChart
              data={summary.weeklyAttendance}
              maxPresent={user.role === "OWNER" ? (summary as OwnerSummary).stats.teamSize : 1}
            />
          </div>
        </Card>
        <Card>
          <h2 className="font-heading text-lg font-semibold text-navy">
            {user.role === "OWNER" ? "Tasks by status" : "Your tasks by status"}
          </h2>
          <div className="mt-4">
            <TaskStatusChart data={summary.taskStatus} />
          </div>
        </Card>
      </div>

      {summary.role === "OWNER" && (
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-navy">Recent activity</h2>
            <Link href="/portal/employees" className="text-xs font-semibold text-gold-dim hover:text-navy">
              Manage team →
            </Link>
          </div>
          <div className="mt-4">
            {summary.recentActivity.length === 0 ? (
              <EmptyState message="No activity yet." />
            ) : (
              <ul className="divide-y divide-line">
                {summary.recentActivity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 py-3">
                    <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy/5 text-navy">
                      {iconFor(a.type)}
                    </span>
                    <div>
                      <p className="text-sm text-navy">{a.message}</p>
                      <p className="text-xs text-slate">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function iconFor(type: string) {
  if (type.startsWith("CLOCK")) return <Clock3 className="h-3.5 w-3.5" />;
  if (type.startsWith("TASK")) return <ListChecks className="h-3.5 w-3.5" />;
  if (type.startsWith("LEAVE")) return <CalendarDays className="h-3.5 w-3.5" />;
  if (type.startsWith("USER")) return <Users className="h-3.5 w-3.5" />;
  return <UserCheck className="h-3.5 w-3.5" />;
}
