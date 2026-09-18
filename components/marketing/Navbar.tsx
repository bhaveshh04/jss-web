"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ArrowUpRight, LogIn } from "lucide-react";
import type { CompanySection, CategoriesSection } from "@/lib/site-sections";

type Props = {
  company: CompanySection;
  products: CategoriesSection["items"];
  solutions: CategoriesSection["items"];
};

export default function Navbar({ company, products, solutions }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<"products" | "solutions" | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-navy/95 backdrop-blur border-b border-white/10" : "bg-navy"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gold font-heading text-base font-bold text-navy">
            JS
          </span>
          <span className="font-heading text-base font-semibold leading-tight text-white">
            JSS Innovative<span className="block text-[11px] font-normal text-white/50">Solutions</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/" className="rounded-full px-4 py-2 font-sans text-sm text-white/80 hover:text-white">
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setDropdown("products")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="flex items-center gap-1 rounded-full px-4 py-2 font-sans text-sm text-white/80 hover:text-white">
              Products <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {dropdown === "products" && (
              <div className="absolute left-0 top-full w-72 rounded-2xl border border-white/10 bg-navy-2 p-3 shadow-2xl">
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/services#${p.slug}`}
                    className="block rounded-xl px-4 py-3 hover:bg-white/5"
                  >
                    <div className="font-heading text-sm font-semibold text-white">{p.name}</div>
                    <div className="mt-0.5 text-xs text-white/55">{p.summary}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setDropdown("solutions")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="flex items-center gap-1 rounded-full px-4 py-2 font-sans text-sm text-white/80 hover:text-white">
              Solutions <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {dropdown === "solutions" && (
              <div className="absolute left-0 top-full w-72 rounded-2xl border border-white/10 bg-navy-2 p-3 shadow-2xl">
                {solutions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services#${s.slug}`}
                    className="block rounded-xl px-4 py-3 hover:bg-white/5"
                  >
                    <div className="font-heading text-sm font-semibold text-white">{s.name}</div>
                    <div className="mt-0.5 text-xs text-white/55">{s.summary}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="rounded-full px-4 py-2 font-sans text-sm text-white/80 hover:text-white">
            Company
          </Link>
          <Link href="/portfolio" className="rounded-full px-4 py-2 font-sans text-sm text-white/80 hover:text-white">
            Portfolio
          </Link>
          <Link href="/careers" className="rounded-full px-4 py-2 font-sans text-sm text-white/80 hover:text-white">
            Careers
          </Link>
          <Link href="/contact" className="rounded-full px-4 py-2 font-sans text-sm text-white/80 hover:text-white">
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 font-heading text-sm font-semibold text-white/90 transition-colors hover:border-white/40"
          >
            <LogIn className="h-4 w-4" /> Login
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 font-heading text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
          >
            Request Demo
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-white/10 bg-navy px-5 pb-8 pt-2 lg:hidden">
          <nav className="flex flex-col">
            <Link href="/" className="border-b border-white/10 py-3.5 font-heading text-lg text-white/90" onClick={() => setOpen(false)}>
              Home
            </Link>

            <div className="border-b border-white/10 py-3.5">
              <div className="font-heading text-lg text-white/90">Products</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/services#${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-b border-white/10 py-3.5">
              <div className="font-heading text-lg text-white/90">Solutions</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {solutions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services#${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {[
              { to: "/about", label: "Company" },
              { to: "/portfolio", label: "Portfolio" },
              { to: "/careers", label: "Careers" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3.5 font-heading text-lg text-white/90"
              >
                {l.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-5 flex items-center justify-center gap-1.5 rounded-full border border-white/25 px-5 py-3 font-heading text-sm font-semibold text-white"
            >
              <LogIn className="h-4 w-4" /> Employee Login
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-3 font-heading text-sm font-semibold text-navy"
            >
              Request Demo <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="mt-3 text-center font-sans text-sm text-white/55">
              or call {company.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
