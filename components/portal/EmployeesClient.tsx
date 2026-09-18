"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, KeyRound, UserX, UserCheck2, Trash2, ArrowUpRight } from "lucide-react";
import { Card, Button, Badge, Modal, TextField, EmptyState } from "./ui";
import type { SafeUser } from "@/lib/types";

export default function EmployeesClient() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [tempPasswordInfo, setTempPasswordInfo] = useState<{ name: string; password: string } | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(user: SafeUser) {
    await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    load();
  }

  async function resetPassword(user: SafeUser) {
    if (!confirm(`Reset the password for ${user.name}? They'll need the new temporary password to sign in.`)) return;
    const res = await fetch(`/api/users/${user.id}/reset-password`, { method: "POST" });
    const data = await res.json();
    if (res.ok) setTempPasswordInfo({ name: user.name, password: data.temporaryPassword });
  }

  async function deleteUser(user: SafeUser) {
    if (!confirm(`Permanently delete ${user.name}? This can't be undone.`)) return;
    await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Employees</h1>
          <p className="mt-1 text-sm text-slate">Add, manage and review the team.</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" /> Add employee
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        {loading ? (
          <div className="p-6 text-sm text-slate">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-6">
            <EmptyState message="No employees yet — add your first one." />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-slate">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4">
                    <Link href={`/portal/employees/${u.id}`} className="font-medium text-navy hover:text-gold-dim">
                      {u.name}
                    </Link>
                    <div className="text-xs text-slate">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate">{u.department || "—"}</td>
                  <td className="px-6 py-4">
                    <Badge tone={u.active ? "success" : "neutral"}>{u.active ? "Active" : "Deactivated"}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/portal/employees/${u.id}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate hover:bg-paper-dim hover:text-navy"
                        title="View profile"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => resetPassword(u)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate hover:bg-paper-dim hover:text-navy"
                        title="Reset password"
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleActive(u)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate hover:bg-paper-dim hover:text-navy"
                        title={u.active ? "Deactivate" : "Reactivate"}
                      >
                        {u.active ? <UserX className="h-4 w-4" /> : <UserCheck2 className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteUser(u)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <AddEmployeeModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={(name, password) => {
          setShowAdd(false);
          load();
          if (password) setTempPasswordInfo({ name, password });
        }}
      />

      <Modal open={!!tempPasswordInfo} onClose={() => setTempPasswordInfo(null)} title="Temporary password">
        {tempPasswordInfo && (
          <div>
            <p className="text-sm text-slate">
              Share this with <strong className="text-navy">{tempPasswordInfo.name}</strong> — it won&apos;t be shown again.
            </p>
            <div className="mt-4 rounded-xl border border-line bg-paper px-4 py-3 font-mono text-lg text-navy">
              {tempPasswordInfo.password}
            </div>
            <Button className="mt-5" onClick={() => setTempPasswordInfo(null)}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AddEmployeeModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (name: string, password?: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, department: department || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't create employee.");
      setName("");
      setEmail("");
      setDepartment("");
      onCreated(data.user.name, data.temporaryPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add employee">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Department (optional)" value={department} onChange={(e) => setDepartment(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-slate">
          A temporary password will be generated automatically — you&apos;ll see it once, right after creating the account.
        </p>
        <Button type="submit" disabled={submitting} className="w-full justify-center">
          {submitting ? "Creating…" : "Create employee"}
        </Button>
      </form>
    </Modal>
  );
}
