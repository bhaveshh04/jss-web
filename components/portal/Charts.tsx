"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

type AttendanceDay = { date: string; present: number };
type TaskStatus = Record<string, number>;

function formatDay(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function WeeklyAttendanceChart({ data, maxPresent }: { data: AttendanceDay[]; maxPresent: number }) {
  const chartData = data.map((d) => ({ day: formatDay(d.date), Present: d.present }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e2e5ee" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#5c6478" }} axisLine={false} tickLine={false} />
        <YAxis
          allowDecimals={false}
          domain={[0, Math.max(maxPresent, 1)]}
          tick={{ fontSize: 12, fill: "#5c6478" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip cursor={{ fill: "rgba(213,162,55,0.08)" }} contentStyle={{ borderRadius: 12, borderColor: "#e2e5ee" }} />
        <Bar dataKey="Present" fill="#d5a237" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#94a3b8",
  IN_PROGRESS: "#d5a237",
  COMPLETED: "#101a33",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

export function TaskStatusChart({ data }: { data: TaskStatus }) {
  const chartData = Object.entries(data)
    .map(([key, value]) => ({ name: STATUS_LABELS[key] ?? key, key, value }))
    .filter((d) => d.value > 0);

  if (chartData.length === 0) {
    return <p className="flex h-60 items-center justify-center text-sm text-slate">No tasks yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {chartData.map((entry) => (
            <Cell key={entry.key} fill={STATUS_COLORS[entry.key] ?? "#5c6478"} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e5ee" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
