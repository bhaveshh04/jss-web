import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { distanceMeters } from "@/lib/geo";
import { todayDateOnly } from "@/lib/date";

export const runtime = "nodejs";

const schema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Location is required to clock in." }, { status: 400 });
  }
  const { lat, lng } = parsed.data;

  const settings = await prisma.officeSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return NextResponse.json(
      { error: "Office location hasn't been configured yet. Ask the owner to set it up in Settings." },
      { status: 400 }
    );
  }

  const distance = distanceMeters(lat, lng, settings.lat, settings.lng);
  if (distance > settings.radiusMeters) {
    return NextResponse.json(
      {
        error: `You're about ${Math.round(distance)}m from the office — clock-in only works within ${settings.radiusMeters}m.`,
      },
      { status: 403 }
    );
  }

  const date = todayDateOnly();
  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId: me.id, date } },
  });

  if (existing?.inTime) {
    return NextResponse.json({ error: "You've already clocked in today." }, { status: 409 });
  }

  const attendance = existing
    ? await prisma.attendance.update({
        where: { id: existing.id },
        data: { inTime: new Date(), inLat: lat, inLng: lng },
      })
    : await prisma.attendance.create({
        data: { userId: me.id, date, inTime: new Date(), inLat: lat, inLng: lng },
      });

  await prisma.activityLog.create({
    data: { type: "CLOCK_IN", message: `${me.name} clocked in.` },
  });

  return NextResponse.json({ attendance });
}
