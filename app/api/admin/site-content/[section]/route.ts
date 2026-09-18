import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { SECTION_SCHEMAS, SECTION_DEFAULTS, SECTION_LABELS, type SectionKey } from "@/lib/site-sections";

export const runtime = "nodejs";

type Params = { params: Promise<{ section: string }> };

function isValidSection(value: string): value is SectionKey {
  return value in SECTION_SCHEMAS;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const { section } = await params;
  if (!isValidSection(section)) {
    return NextResponse.json({ error: "Unknown content section." }, { status: 404 });
  }

  const row = await prisma.siteContent.findUnique({ where: { section } });
  const data = row ? SECTION_SCHEMAS[section].safeParse(row.data) : null;

  return NextResponse.json({
    section,
    label: SECTION_LABELS[section],
    data: data?.success ? data.data : SECTION_DEFAULTS[section],
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const me = await getCurrentUser();
  if (!me) return unauthorized();
  if (me.role !== "OWNER") return forbidden();

  const { section } = await params;
  if (!isValidSection(section)) {
    return NextResponse.json({ error: "Unknown content section." }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = SECTION_SCHEMAS[section].safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid content for this section.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await prisma.siteContent.upsert({
    where: { section },
    update: { data: parsed.data },
    create: { section, data: parsed.data },
  });

  await logActivity("SITE_CONTENT_UPDATED", `${me.name} updated "${SECTION_LABELS[section]}" on the website.`);

  return NextResponse.json({ ok: true });
}
