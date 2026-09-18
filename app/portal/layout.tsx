import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, toSafeUser } from "@/lib/auth";
import { PortalProviders } from "@/components/portal/PortalProviders";
import PortalShell from "@/components/portal/PortalShell";
import type { SafeUser } from "@/lib/types";

export const metadata: Metadata = {
  title: "Employee Portal",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  // Middleware already blocks unauthenticated requests to /portal/*, but we
  // re-check here too — defense in depth, and this is also where we fetch
  // the fresh user record to hand to client components.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const safeUser = toSafeUser(user);
  const serializedUser: SafeUser = {
    id: safeUser.id,
    name: safeUser.name,
    email: safeUser.email,
    role: safeUser.role,
    department: safeUser.department,
    active: safeUser.active,
    mustResetPw: safeUser.mustResetPw,
    createdAt: safeUser.createdAt.toISOString(),
    updatedAt: safeUser.updatedAt.toISOString(),
  };

  return (
    <PortalProviders user={serializedUser}>
      <PortalShell>{children}</PortalShell>
    </PortalProviders>
  );
}
