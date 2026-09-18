import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";

export const runtime = "nodejs";

/** Ensures a settings row always exists (id is pinned to 1 — singleton table). */
async function getOrCreateSettings() {
  const existing = await prisma.officeSettings.findUnique({ where: { id: 1 } });
  if (existing) return existing;

  return prisma.officeSettings.create({
    data: {
      id: 1,
      name: "JSS Innovative Solutions — Pune HQ",
      lat: Number(process.env.OFFICE_LAT ?? 18.5793),
      lng: Number(process.env.OFFICE_LNG ?? 73.8143),
      radiusMeters: Number(process.env.OFFICE_RADIUS_METERS ?? 200),
    },
  });
}

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return unauthorized();

  const settings = await getOrCreateSettings();
  return NextResponse.json({ settings });
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radiusMeters: z.number().int().min(20).max(5000),
});

export async function PUT(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  await getOrCreateSettings();
  const settings = await prisma.officeSettings.update({
    where: { id: 1 },
    data: parsed.data,
  });

  await prisma.activityLog.create({
    data: { type: "OFFICE_SETTINGS_UPDATED", message: `${me.name} updated the office geofence settings.` },
  });

  return NextResponse.json({ settings });
}
