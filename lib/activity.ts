import { prisma } from "./prisma";

export async function logActivity(type: string, message: string) {
  try {
    await prisma.activityLog.create({ data: { type, message } });
  } catch {
    // Activity logging is best-effort — never break the calling request over it.
  }
}
