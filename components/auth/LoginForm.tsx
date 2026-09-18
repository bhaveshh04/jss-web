"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");

      const next = searchParams.get("next") || "/portal";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none focus:border-gold-dim"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none focus:border-gold-dim"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-heading text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"} <LogIn className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </form>
  );
}
