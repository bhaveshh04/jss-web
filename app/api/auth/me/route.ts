import { NextResponse } from "next/server";
import { getCurrentUser, toSafeUser, unauthorized } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return NextResponse.json({ user: toSafeUser(user) });
}
