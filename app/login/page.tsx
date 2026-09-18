import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Employee Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/portal");

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between bg-navy p-12 text-white lg:flex">
        <div className="bp-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gold font-heading text-base font-bold text-navy">
            JS
          </span>
          <span className="font-heading text-base font-semibold text-white">JSS Innovative Solutions</span>
        </Link>
        <div className="relative max-w-md">
          <h1 className="font-heading text-3xl font-semibold leading-tight">
            The Employee Portal — attendance, tasks and leave in one place.
          </h1>
          <p className="mt-4 text-white/60">
            Geofenced clock-in, task tracking and leave requests for the JSS team.
          </p>
        </div>
        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} JSS Innovative Solutions
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-paper px-5 py-16 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-navy font-heading text-base font-bold text-gold">
                JS
              </span>
            </Link>
            <h2 className="mt-4 font-heading text-2xl font-semibold text-navy">Sign in to your portal</h2>
            <p className="mt-1 text-sm text-slate">Use the email and password issued by your owner/admin.</p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-xs text-slate lg:text-left">
            Forgot your password? Ask your owner/admin to reset it from the Employees screen.
          </p>
        </div>
      </div>
    </div>
  );
}
