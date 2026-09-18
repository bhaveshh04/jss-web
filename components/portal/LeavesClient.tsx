"use client";

import { useEffect, useState } from "react";
import { Plus, Check, X as XIcon } from "lucide-react";
import { usePortalUser } from "./PortalProviders";
import { Card, Button, Badge, Modal, TextField, TextArea, EmptyState } from "./ui";

type Leave = {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user: { id: string; name: string; department: string | null };
};

export default function LeavesClient() {
  const user = usePortalUser();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequest, setShowRequest] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/leaves");
    if (res.ok) setLeaves((await res.json()).leaveRequests);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function review(leave: Leave, status: "APPROVED" | "REJECTED") {
    await fetch(`/api/leaves/${leave.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">
            {user.role === "OWNER" ? "Leave requests" : "Leave"}
          </h1>
          <p className="mt-1 text-sm text-slate">
            {user.role === "OWNER" ? "Approve or reject requests from the team." : "Request leave and track your history."}
          </p>
        </div>
        {user.role === "EMPLOYEE" && (
          <Button onClick={() => setShowRequest(true)}>
            <Plus className="h-4 w-4" /> Request leave
          </Button>
        )}
      </div>

      <Card className="p-0">
        {loading ? (
          <div className="p-6 text-sm text-slate">Loading…</div>
        ) : leaves.length === 0 ? (
          <div className="p-6">
            <EmptyState message="No leave requests yet." />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {leaves.map((l) => (
              <li key={l.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {user.role === "OWNER" && <p className="font-medium text-navy">{l.user.name}</p>}
                    <p className="text-sm text-navy">
                      {new Date(l.fromDate).toLocaleDateString()} – {new Date(l.toDate).toLocaleDateString()}
                    </p>
                    <Badge tone={l.status === "APPROVED" ? "success" : l.status === "REJECTED" ? "danger" : "warning"}>
                      {l.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate">{l.reason}</p>
                </div>
                {user.role === "OWNER" && l.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => review(l, "APPROVED")}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button variant="danger" onClick={() => review(l, "REJECTED")}>
                      <XIcon className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {user.role === "EMPLOYEE" && (
        <RequestLeaveModal open={showRequest} onClose={() => setShowRequest(false)} onCreated={() => { setShowRequest(false); load(); }} />
      )}
    </div>
  );
}

function RequestLeaveModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromDate, toDate, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't submit request.");
      setFromDate("");
      setToDate("");
      setReason("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Request leave">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="From" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
          <TextField label="To" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
        </div>
        <TextArea label="Reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full justify-center">
          {submitting ? "Submitting…" : "Submit request"}
        </Button>
      </form>
    </Modal>
  );
}
