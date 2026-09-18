"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function CareersApplyForm({ positions }: { positions: { title: string }[] }) {
  const initialForm = {
    name: "",
    email: "",
    phone: "",
    position: positions[0]?.title ?? "",
    coverNote: "",
    resumeUrl: "",
  };
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-white p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold-dim" strokeWidth={1.5} />
        <h3 className="mt-5 font-heading text-2xl font-semibold text-navy">Application received</h3>
        <p className="mt-2 max-w-sm text-sm text-slate">
          Thanks, {form.name.split(" ")[0] || "there"} — we&apos;ll review your application and reach out at{" "}
          {form.email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy">
            Full name <span className="text-gold-dim">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none focus:border-gold-dim"
          />
        </div>
        <div>
          <label htmlFor="position" className="mb-1.5 block text-sm font-medium text-navy">
            Position
          </label>
          <select
            id="position"
            name="position"
            value={form.position}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none focus:border-gold-dim"
          >
            {positions.map((p) => (
              <option key={p.title}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
            Email <span className="text-gold-dim">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none focus:border-gold-dim"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-navy">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none focus:border-gold-dim"
          />
        </div>
      </div>

      <div>
        <label htmlFor="resumeUrl" className="mb-1.5 block text-sm font-medium text-navy">
          Resume link (Google Drive, LinkedIn, portfolio, etc.)
        </label>
        <input
          id="resumeUrl"
          name="resumeUrl"
          type="url"
          placeholder="https://"
          value={form.resumeUrl}
          onChange={handleChange}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none placeholder:text-slate/60 focus:border-gold-dim"
        />
      </div>

      <div>
        <label htmlFor="coverNote" className="mb-1.5 block text-sm font-medium text-navy">
          Anything you&apos;d like us to know?
        </label>
        <textarea
          id="coverNote"
          name="coverNote"
          rows={4}
          value={form.coverNote}
          onChange={handleChange}
          className="w-full resize-none rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none focus:border-gold-dim"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-heading text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:w-fit"
      >
        {status === "submitting" ? "Submitting…" : "Submit application"} <Send className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </form>
  );
}
