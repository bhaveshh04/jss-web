import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, toSafeUser } from "@/lib/auth";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/jwt";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Deliberately generic error for both "no such user" and "wrong password"
  // so a login attempt can't be used to enumerate valid employee emails.
  const genericError = () =>
    NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!user || !user.active) return genericError();

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return genericError();

  const token = await signSession({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  await prisma.activityLog.create({
    data: { type: "LOGIN", message: `${user.name} logged in.` },
  });

  const res = NextResponse.json({ user: toSafeUser(user) });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
