"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  interest: "ERP implementation",
  message: "",
};

export default function ContactForm() {
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
      const res = await fetch("/api/contact", {
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
        <h3 className="mt-5 font-heading text-2xl font-semibold text-navy">Message received</h3>
        <p className="mt-2 max-w-sm text-sm text-slate">
          Thanks, {form.name.split(" ")[0] || "there"} — we&apos;ll get back to you at {form.email} shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(initialForm);
            setStatus("idle");
          }}
          className="mt-6 font-heading text-sm font-semibold text-gold-dim hover:text-navy"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" value={form.name} onChange={handleChange} required />
        <Field label="Company" name="company" value={form.company} onChange={handleChange} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>

      <div>
        <label htmlFor="interest" className="mb-1.5 block text-sm font-medium text-navy">
          I&apos;m interested in
        </label>
        <select
          id="interest"
          name="interest"
          value={form.interest}
          onChange={handleChange}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none focus:border-gold-dim"
        >
          <option>ERP implementation</option>
          <option>HRMS / Payroll</option>
          <option>CRM</option>
          <option>IoT / Industry 4.0</option>
          <option>Custom software development</option>
          <option>Careers</option>
          <option>Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
          Tell us about your process
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          required
          placeholder="Industry, current pain point, team size — whatever's useful."
          className="w-full resize-none rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none placeholder:text-slate/60 focus:border-gold-dim"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-heading text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:w-fit"
      >
        {status === "submitting" ? "Sending…" : "Send message"} <Send className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required && <span className="text-gold-dim">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-navy outline-none placeholder:text-slate/60 focus:border-gold-dim"
      />
    </div>
  );
}
