import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword, verifyPassword, unauthorized } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const ok = await verifyPassword(parsed.data.currentPassword, me.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: me.id },
    data: { passwordHash, mustResetPw: false },
  });

  return NextResponse.json({ ok: true });
}
