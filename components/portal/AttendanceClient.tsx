"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { usePortalUser } from "./PortalProviders";
import { Card, Button, TextField, EmptyState } from "./ui";
import ClockInOutWidget from "./ClockInOutWidget";
import type { SafeUser } from "@/lib/types";

type Attendance = { id: string; date: string; inTime: string | null; outTime: string | null };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoISO(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
}

export default function AttendanceClient() {
  const user = usePortalUser();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [from, setFrom] = useState(daysAgoISO(13));
  const [to, setTo] = useState(todayISO());
  const [loading, setLoading] = useState(true);
  const [todayStatus, setTodayStatus] = useState<{ clockedIn: boolean; clockedOut: boolean }>({
    clockedIn: false,
    clockedOut: false,
  });

  // Owner-only: browse any employee's attendance + export
  const [employees, setEmployees] = useState<SafeUser[]>([]);
  const [filterEmployee, setFilterEmployee] = useState("");

  async function load() {
    setLoading(true);
    const query =
      user.role === "OWNER" && filterEmployee
        ? `?userId=${filterEmployee}&from=${from}&to=${to}`
        : `?from=${from}&to=${to}`;
    const res = await fetch(`/api/attendance${query}`);
    if (res.ok) {
      const data = await res.json();
      setRecords(data.records);
      if (user.role === "EMPLOYEE") {
        const today = data.records.find((r: Attendance) => r.date.slice(0, 10) === todayISO());
        setTodayStatus({ clockedIn: Boolean(today?.inTime), clockedOut: Boolean(today?.outTime) });
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    if (user.role === "OWNER") {
      fetch("/api/users").then(async (r) => {
        if (r.ok) setEmployees((await r.json()).users);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterEmployee]);

  function exportCsv() {
    const params = new URLSearchParams({ from, to });
    if (filterEmployee) params.set("userId", filterEmployee);
    window.location.href = `/api/attendance/export?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-navy">Attendance</h1>
        <p className="mt-1 text-sm text-slate">
          {user.role === "OWNER" ? "Browse and export attendance for payroll." : "Clock in/out and review your history."}
        </p>
      </div>

      {user.role === "EMPLOYEE" && (
        <ClockInOutWidget clockedIn={todayStatus.clockedIn} clockedOut={todayStatus.clockedOut} onChange={load} />
      )}

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3">
            {user.role === "OWNER" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Employee</label>
                <select
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-navy outline-none focus:border-gold-dim"
                >
                  <option value="">All employees</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <TextField label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <TextField label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <Button variant="secondary" onClick={load}>
              Apply
            </Button>
          </div>
          {user.role === "OWNER" && (
            <Button onClick={exportCsv}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          )}
        </div>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-sm text-slate">Loading…</p>
          ) : records.length === 0 ? (
            <EmptyState message="No attendance records in this range." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-slate">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Clock in</th>
                  <th className="py-2 pr-4 font-medium">Clock out</th>
                  <th className="py-2 pr-4 font-medium">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {records.map((r) => {
                  const hours =
                    r.inTime && r.outTime
                      ? ((new Date(r.outTime).getTime() - new Date(r.inTime).getTime()) / 3_600_000).toFixed(1)
                      : "—";
                  return (
                    <tr key={r.id}>
                      <td className="py-2.5 pr-4 text-navy">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="py-2.5 pr-4 text-slate">{r.inTime ? new Date(r.inTime).toLocaleTimeString() : "—"}</td>
                      <td className="py-2.5 pr-4 text-slate">{r.outTime ? new Date(r.outTime).toLocaleTimeString() : "—"}</td>
                      <td className="py-2.5 pr-4 text-slate">{hours}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
