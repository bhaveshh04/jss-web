import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { todayDateOnly } from "@/lib/date";

export const runtime = "nodejs";

const schema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  const { lat, lng } = parsed.success ? parsed.data : {};

  const date = todayDateOnly();
  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId: me.id, date } },
  });

  if (!existing?.inTime) {
    return NextResponse.json({ error: "You haven't clocked in today yet." }, { status: 400 });
  }
  if (existing.outTime) {
    return NextResponse.json({ error: "You've already clocked out today." }, { status: 409 });
  }

  const attendance = await prisma.attendance.update({
    where: { id: existing.id },
    data: { outTime: new Date(), outLat: lat, outLng: lng },
  });

  await prisma.activityLog.create({
    data: { type: "CLOCK_OUT", message: `${me.name} clocked out.` },
  });

  return NextResponse.json({ attendance });
}
