import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { SECTION_SCHEMAS, SECTION_DEFAULTS, SECTION_KEYS, type SectionKey } from "@/lib/site-sections";

export const runtime = "nodejs";

function isSectionKey(value: string): value is SectionKey {
  return (SECTION_KEYS as string[]).includes(value);
}

type Params = { params: Promise<{ section: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const { section } = await params;
  if (!isSectionKey(section)) return NextResponse.json({ error: "Unknown section." }, { status: 404 });

  const row = await prisma.siteContent.findUnique({ where: { section } });
  if (row) {
    const parsed = SECTION_SCHEMAS[section].safeParse(row.data);
    if (parsed.success) return NextResponse.json({ section, data: parsed.data, isDefault: false });
  }
  return NextResponse.json({ section, data: SECTION_DEFAULTS[section], isDefault: true });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const { section } = await params;
  if (!isSectionKey(section)) return NextResponse.json({ error: "Unknown section." }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = SECTION_SCHEMAS[section].safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid content.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await prisma.siteContent.upsert({
    where: { section },
    update: { data: parsed.data },
    create: { section, data: parsed.data },
  });

  await logActivity("SITE_CONTENT_UPDATED", `${me.name} updated the "${section}" website section.`);

  return NextResponse.json({ ok: true });
}
