import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/mailer";
import { logActivity } from "@/lib/activity";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional(),
  position: z.string().min(2),
  coverNote: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { name, email, phone, position, coverNote, resumeUrl } = parsed.data;

  const saved = await prisma.jobApplication.create({
    data: { name, email, phone, position, coverNote, resumeUrl: resumeUrl || undefined },
  });

  await sendNotificationEmail({
    subject: `New job application — ${position}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nPosition: ${position}\nResume: ${resumeUrl || "-"}\n\n${coverNote || ""}`,
  });

  await logActivity("JOB_APPLICATION", `${name} applied for ${position}.`);

  return NextResponse.json({ ok: true, id: saved.id });
}
