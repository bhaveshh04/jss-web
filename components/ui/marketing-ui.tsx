import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] ${
        dark ? "text-gold" : "text-gold-dim"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-gold" : "bg-gold-dim"}`} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-3 font-heading text-3xl font-semibold leading-[1.1] sm:text-4xl ${
          dark ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-white/65" : "text-slate"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({
  to,
  href,
  children,
  className = "",
  type,
  onClick,
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const classes = `inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-6 py-3.5 font-heading text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5 ${className}`;
  if (type) {
    return (
      <button type={type} onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
      </a>
    );
  }
  return (
    <Link href={to ?? "/"} className={classes}>
      {children}
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
    </Link>
  );
}

export function GhostButton({
  to,
  href,
  children,
  className = "",
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = `inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 px-6 py-3.5 font-heading text-sm font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/[0.06] ${className}`;
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={to ?? "/"} className={classes}>
      {children}
    </Link>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-7 ${className}`}>{children}</div>;
}
