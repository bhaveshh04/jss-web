import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "./jwt";
import { prisma } from "./prisma";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Reads and verifies the session cookie. Returns null if absent/invalid — never throws. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Fetches the full, fresh user record for the current session and confirms
 * the account is still active. Always re-checks the DB rather than trusting
 * the JWT alone, so a deactivated account is locked out immediately even if
 * their token hasn't expired yet.
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user || !user.active) return null;
  return user;
}

/** Generates a random, human-typeable temporary password (e.g. for resets / new accounts). */
export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/** Standard 401/403 JSON responses for API route guards. */
export const unauthorized = () =>
  NextResponse.json({ error: "Not authenticated." }, { status: 401 });

export const forbidden = () =>
  NextResponse.json({ error: "You don't have permission to do that." }, { status: 403 });

/** Strips the passwordHash field before a User record is ever sent to the client. */
export function toSafeUser<T extends { passwordHash: string }>(user: T) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
