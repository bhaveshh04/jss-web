import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword, generateTempPassword, toSafeUser, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const users = await prisma.user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });

  return NextResponse.json({ users: users.map(toSafeUser) });
}

const createSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email(),
  department: z.string().optional(),
  password: z.string().min(6).optional(),
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { name, email, department } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const tempPassword = parsed.data.password ?? generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      department,
      passwordHash,
      role: "EMPLOYEE",
      mustResetPw: !parsed.data.password,
    },
  });

  await prisma.activityLog.create({
    data: { type: "USER_CREATED", message: `${me.name} added employee ${user.name}.` },
  });

  return NextResponse.json({
    user: toSafeUser(user),
    // Only ever returned once, at creation time, so the owner can hand it to
    // the new employee. Never retrievable again after this response.
    temporaryPassword: parsed.data.password ? undefined : tempPassword,
  });
}
