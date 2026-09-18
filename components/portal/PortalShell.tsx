"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListChecks,
  CalendarDays,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { usePortalUser } from "./PortalProviders";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const ownerNav: NavItem[] = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/employees", label: "Employees", icon: Users },
  { href: "/portal/tasks", label: "Tasks", icon: ListChecks },
  { href: "/portal/leaves", label: "Leave requests", icon: CalendarDays },
  { href: "/portal/attendance", label: "Attendance", icon: Clock },
  { href: "/portal/website", label: "Website content", icon: Globe },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

const employeeNav: NavItem[] = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/attendance", label: "Clock in / out", icon: Clock },
  { href: "/portal/tasks", label: "My tasks", icon: ListChecks },
  { href: "/portal/leaves", label: "Leave", icon: CalendarDays },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

function NavLinks({ nav, pathname, onNavigate }: { nav: NavItem[]; pathname: string; onNavigate: () => void }) {
  return (
    <>
      {nav.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              active ? "bg-gold/15 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const user = usePortalUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const nav = user.role === "OWNER" ? ownerNav : employeeNav;

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy p-5 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-2 pb-6">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gold font-heading text-base font-bold text-navy">
            JS
          </span>
          <span className="font-heading text-sm font-semibold text-white">JSS Portal</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          <NavLinks nav={nav} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </nav>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" /> {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </aside>

      {/* Mobile topbar + drawer */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-white px-5 py-4 lg:px-8">
          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-line lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="font-heading text-lg font-semibold text-navy">Welcome back, {user.name.split(" ")[0]}</p>
            <p className="text-xs text-slate">{user.role === "OWNER" ? "Owner / Admin" : user.department || "Team member"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-xs font-medium text-slate hover:text-navy sm:block">
              ← Back to website
            </Link>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-gold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex w-72 flex-col bg-navy p-5">
            <div className="flex items-center justify-between pb-6">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-gold font-heading text-base font-bold text-navy">
                  JS
                </span>
                <span className="font-heading text-sm font-semibold text-white">JSS Portal</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="text-white/70" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1">
              <NavLinks nav={nav} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </nav>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
