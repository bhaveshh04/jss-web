import type { Role } from "@prisma/client";

// Serialized shape of a User handed from server layouts to client
// components — dates as ISO strings (safe across the server/client
// boundary), and never includes passwordHash (see lib/auth.ts toSafeUser).
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string | null;
  active: boolean;
  mustResetPw: boolean;
  createdAt: string;
  updatedAt: string;
};
