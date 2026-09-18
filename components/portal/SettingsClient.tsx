"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, MapPin } from "lucide-react";
import { usePortalUser } from "./PortalProviders";
import { Card, Button, TextField } from "./ui";

export default function SettingsClient() {
  const user = usePortalUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't update password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-navy">Settings</h1>
        <p className="mt-1 text-sm text-slate">
          Signed in as <strong className="text-navy">{user.name}</strong> ({user.email})
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy/5 text-navy">
            <KeyRound className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-lg font-semibold text-navy">Change password</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <TextField
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
            required
          />
          <TextField
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {done && <p className="text-sm text-emerald-700">Password updated.</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </Card>

      {user.role === "OWNER" && (
        <Card>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy/5 text-navy">
              <MapPin className="h-4 w-4" />
            </span>
            <h2 className="font-heading text-lg font-semibold text-navy">Office location & geofence</h2>
          </div>
          <p className="mt-2 text-sm text-slate">
            Set where employees are allowed to clock in from.
          </p>
          <Link href="/portal/settings/office">
            <Button variant="secondary" className="mt-4">
              Open office settings
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
