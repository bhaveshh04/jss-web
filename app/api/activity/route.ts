import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const activity = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return NextResponse.json({ activity });
}
