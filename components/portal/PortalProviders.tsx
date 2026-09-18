"use client";

import { createContext, useContext } from "react";
import type { SafeUser } from "@/lib/types";

const PortalUserContext = createContext<SafeUser | null>(null);

export function PortalProviders({ user, children }: { user: SafeUser; children: React.ReactNode }) {
  return <PortalUserContext.Provider value={user}>{children}</PortalUserContext.Provider>;
}

export function usePortalUser(): SafeUser {
  const user = useContext(PortalUserContext);
  if (!user) throw new Error("usePortalUser must be used within PortalProviders");
  return user;
}
