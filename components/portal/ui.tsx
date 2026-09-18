"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function Card({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-6 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <Card>
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-slate">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate">{hint}</p>}
    </Card>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warning" | "danger" | "info"; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    neutral: "bg-slate/10 text-slate",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-navy/10 text-navy",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const variants: Record<string, string> = {
    primary: "bg-gold text-navy hover:-translate-y-0.5",
    secondary: "border border-line text-navy hover:bg-paper-dim",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-navy hover:bg-paper-dim",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-heading text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-heading text-xl font-semibold text-navy">{title}</h3>
          <button onClick={onClose} className="text-slate hover:text-navy" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-slate">{message}</p>;
}

export function TextField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-navy outline-none focus:border-gold-dim"
      />
    </div>
  );
}

export function TextArea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      <textarea
        {...props}
        className="w-full resize-none rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-navy outline-none focus:border-gold-dim"
      />
    </div>
  );
}

export function Select({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      <select
        {...props}
        className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-navy outline-none focus:border-gold-dim"
      >
        {children}
      </select>
    </div>
  );
}
