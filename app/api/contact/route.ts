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
  company: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().min(5, "Please add a short message."),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { name, email, phone, company, interest, message } = parsed.data;

  const saved = await prisma.contactMessage.create({
    data: { name, email, phone, company, interest, message },
  });

  // Best-effort — the form still succeeds even if SMTP isn't configured.
  await sendNotificationEmail({
    subject: `New contact form enquiry — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nCompany: ${company || "-"}\nInterest: ${interest || "-"}\n\n${message}`,
  });

  await logActivity("CONTACT_FORM", `New enquiry from ${name} (${email}).`);

  return NextResponse.json({ ok: true, id: saved.id });
}
