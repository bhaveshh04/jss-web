import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword, generateTempPassword, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();
  const { id } = await params;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  await prisma.user.update({
    where: { id },
    data: { passwordHash, mustResetPw: true },
  });

  await prisma.activityLog.create({
    data: { type: "PASSWORD_RESET", message: `${me.name} reset the password for ${target.name}.` },
  });

  // Returned once, in-band, so the owner can relay it to the employee. It is
  // never stored or logged in plaintext anywhere.
  return NextResponse.json({ temporaryPassword: tempPassword });
}
