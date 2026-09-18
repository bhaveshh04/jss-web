"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, Badge, EmptyState, TextField, Button } from "./ui";
import type { SafeUser } from "@/lib/types";

type Attendance = { id: string; date: string; inTime: string | null; outTime: string | null };
type Task = { id: string; title: string; status: string; priority: string; dueDate: string | null };
type Leave = { id: string; fromDate: string; toDate: string; reason: string; status: string };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoISO(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
}

export default function EmployeeDetailClient({ userId }: { userId: string }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [from, setFrom] = useState(daysAgoISO(29));
  const [to, setTo] = useState(todayISO());
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [userRes, attRes, taskRes, leaveRes] = await Promise.all([
      fetch(`/api/users/${userId}`),
      fetch(`/api/attendance?userId=${userId}&from=${from}&to=${to}`),
      fetch(`/api/tasks?assignedTo=${userId}`),
      fetch(`/api/leaves?userId=${userId}`),
    ]);
    if (userRes.ok) setUser((await userRes.json()).user);
    if (attRes.ok) setAttendance((await attRes.json()).records);
    if (taskRes.ok) setTasks((await taskRes.json()).tasks);
    if (leaveRes.ok) setLeaves((await leaveRes.json()).leaveRequests);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading && !user) return <p className="text-sm text-slate">Loading…</p>;
  if (!user) return <EmptyState message="Employee not found." />;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/portal/employees" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> Back to employees
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold text-navy">{user.name}</h1>
          <Badge tone={user.active ? "success" : "neutral"}>{user.active ? "Active" : "Deactivated"}</Badge>
        </div>
        <p className="mt-1 text-sm text-slate">
          {user.email} {user.department && `· ${user.department}`}
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold text-navy">Attendance history</h2>
          <div className="flex flex-wrap items-end gap-3">
            <TextField label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <TextField label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <Button variant="secondary" onClick={load}>
              Apply
            </Button>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          {attendance.length === 0 ? (
            <EmptyState message="No attendance records in this range." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-slate">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Clock in</th>
                  <th className="py-2 pr-4 font-medium">Clock out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {attendance.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2.5 pr-4 text-navy">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="py-2.5 pr-4 text-slate">{a.inTime ? new Date(a.inTime).toLocaleTimeString() : "—"}</td>
                    <td className="py-2.5 pr-4 text-slate">{a.outTime ? new Date(a.outTime).toLocaleTimeString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-heading text-lg font-semibold text-navy">Tasks</h2>
          <div className="mt-4">
            {tasks.length === 0 ? (
              <EmptyState message="No tasks assigned." />
            ) : (
              <ul className="space-y-3">
                {tasks.map((t) => (
                  <li key={t.id} className="rounded-xl border border-line p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-navy">{t.title}</p>
                      <Badge tone={t.status === "COMPLETED" ? "success" : t.status === "IN_PROGRESS" ? "warning" : "neutral"}>
                        {t.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {t.dueDate && <p className="mt-1 text-xs text-slate">Due {new Date(t.dueDate).toLocaleDateString()}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-heading text-lg font-semibold text-navy">Leave history</h2>
          <div className="mt-4">
            {leaves.length === 0 ? (
              <EmptyState message="No leave requests." />
            ) : (
              <ul className="space-y-3">
                {leaves.map((l) => (
                  <li key={l.id} className="rounded-xl border border-line p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-navy">
                        {new Date(l.fromDate).toLocaleDateString()} – {new Date(l.toDate).toLocaleDateString()}
                      </p>
                      <Badge tone={l.status === "APPROVED" ? "success" : l.status === "REJECTED" ? "danger" : "warning"}>
                        {l.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate">{l.reason}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
