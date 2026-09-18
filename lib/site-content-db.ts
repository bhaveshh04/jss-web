import "server-only";
import { prisma } from "./prisma";
import { SECTION_DEFAULTS, SECTION_SCHEMAS, type SectionDataMap, type SectionKey } from "./site-sections";

/**
 * Reads one editable section's content from the database. Falls back to the
 * built-in default (and re-validates through the section's own zod schema)
 * if the row is missing or its stored JSON doesn't parse — so a public page
 * never breaks even if a section hasn't been seeded or was saved oddly.
 */
export async function getSiteContent<K extends SectionKey>(section: K): Promise<SectionDataMap[K]> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { section } });
    if (row) {
      const parsed = SECTION_SCHEMAS[section].safeParse(row.data);
      if (parsed.success) return parsed.data as SectionDataMap[K];
    }
  } catch {
    // DB unreachable or table missing — fall through to defaults so the
    // public site still renders something sensible.
  }
  return SECTION_DEFAULTS[section];
}

/** Fetches several sections at once (small convenience for pages that need more than one). */
export async function getSiteContentMany<K extends SectionKey>(sections: K[]): Promise<Pick<SectionDataMap, K>> {
  const entries = await Promise.all(sections.map(async (s) => [s, await getSiteContent(s)] as const));
  return Object.fromEntries(entries) as Pick<SectionDataMap, K>;
}
