/** Normalizes "now" to a UTC midnight Date so it matches Prisma's @db.Date columns. */
export function todayDateOnly(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Parses a "YYYY-MM-DD" query param into a UTC midnight Date, or null if invalid/absent. */
export function parseDateOnly(value: string | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}
