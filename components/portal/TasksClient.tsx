"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { usePortalUser } from "./PortalProviders";
import { Card, Button, Badge, Modal, TextField, TextArea, Select, EmptyState } from "./ui";
import type { SafeUser } from "@/lib/types";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string | null;
  assignedTo: { id: string; name: string };
};

const priorityTone: Record<string, "neutral" | "warning" | "danger" | "info"> = {
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "danger",
};

export default function TasksClient() {
  const user = usePortalUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<SafeUser[]>([]);
  const [filterEmployee, setFilterEmployee] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  async function load() {
    setLoading(true);
    const query = user.role === "OWNER" && filterEmployee ? `?assignedTo=${filterEmployee}` : "";
    const res = await fetch(`/api/tasks${query}`);
    if (res.ok) setTasks((await res.json()).tasks);
    setLoading(false);
  }

  useEffect(() => {
    load();
    if (user.role === "OWNER") {
      fetch("/api/users").then(async (r) => {
        if (r.ok) setEmployees((await r.json()).users.filter((u: SafeUser) => u.active));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterEmployee]);

  async function updateStatus(task: Task, status: Task["status"]) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function deleteTask(task: Task) {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">{user.role === "OWNER" ? "Tasks" : "My tasks"}</h1>
          <p className="mt-1 text-sm text-slate">
            {user.role === "OWNER" ? "Assign and track work across the team." : "Update the status as you make progress."}
          </p>
        </div>
        {user.role === "OWNER" && (
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-gold-dim"
            >
              <option value="">All employees</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" /> New task
            </Button>
          </div>
        )}
      </div>

      <Card className="p-0">
        {loading ? (
          <div className="p-6 text-sm text-slate">Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="p-6">
            <EmptyState message="No tasks here yet." />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {tasks.map((t) => (
              <li key={t.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-navy">{t.title}</p>
                    <Badge tone={priorityTone[t.priority]}>{t.priority}</Badge>
                  </div>
                  {t.description && <p className="mt-1 text-sm text-slate">{t.description}</p>}
                  <p className="mt-1 text-xs text-slate">
                    {user.role === "OWNER" && `Assigned to ${t.assignedTo.name} · `}
                    {t.dueDate ? `Due ${new Date(t.dueDate).toLocaleDateString()}` : "No due date"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={t.status}
                    onChange={(e) => updateStatus(t, e.target.value as Task["status"])}
                    className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-navy outline-none focus:border-gold-dim"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  {user.role === "OWNER" && (
                    <button
                      onClick={() => deleteTask(t)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {user.role === "OWNER" && (
        <NewTaskModal open={showAdd} onClose={() => setShowAdd(false)} employees={employees} onCreated={() => { setShowAdd(false); load(); }} />
      )}
    </div>
  );
}

function NewTaskModal({
  open,
  onClose,
  employees,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  employees: SafeUser[];
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, dueDate: dueDate || undefined, assignedToId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't create task.");
      setTitle("");
      setDescription("");
      setDueDate("");
      setAssignedToId("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextArea label="Description (optional)" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </Select>
          <TextField label="Due date (optional)" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <Select label="Assign to" value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} required>
          <option value="" disabled>
            Select an employee
          </option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </Select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full justify-center">
          {submitting ? "Creating…" : "Create task"}
        </Button>
      </form>
    </Modal>
  );
}
