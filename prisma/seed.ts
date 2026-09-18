import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SECTION_DEFAULTS, SECTION_KEYS } from "../lib/site-sections";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = (process.env.OWNER_EMAIL || "owner@jssinnovative.in").toLowerCase();
  const ownerName = process.env.OWNER_NAME || "Owner";
  const ownerPassword = process.env.OWNER_PASSWORD || "ChangeMe123!";

  const existingOwner = await prisma.user.findUnique({ where: { email: ownerEmail } });

  if (existingOwner) {
    console.log(`Owner account already exists: ${ownerEmail} — skipping creation.`);
  } else {
    const passwordHash = await bcrypt.hash(ownerPassword, 12);
    await prisma.user.create({
      data: {
        name: ownerName,
        email: ownerEmail,
        passwordHash,
        role: "OWNER",
        department: "Management",
        active: true,
      },
    });
    console.log(`Created owner account: ${ownerEmail}`);
    console.log(`Temporary password: ${ownerPassword} — change this after first login.`);
  }

  const existingSettings = await prisma.officeSettings.findUnique({ where: { id: 1 } });
  if (existingSettings) {
    console.log("Office settings already configured — skipping.");
  } else {
    await prisma.officeSettings.create({
      data: {
        id: 1,
        name: "JSS Innovative Solutions — Pune HQ",
        lat: Number(process.env.OFFICE_LAT ?? 18.5793),
        lng: Number(process.env.OFFICE_LNG ?? 73.8143),
        radiusMeters: Number(process.env.OFFICE_RADIUS_METERS ?? 200),
      },
    });
    console.log("Created default office settings — update the exact coordinates from Settings once you're set up.");
  }

  let seededSections = 0;
  for (const section of SECTION_KEYS) {
    const existing = await prisma.siteContent.findUnique({ where: { section } });
    if (existing) continue;
    await prisma.siteContent.create({ data: { section, data: SECTION_DEFAULTS[section] } });
    seededSections++;
  }
  if (seededSections > 0) {
    console.log(`Seeded ${seededSections} website content section(s) with default copy — editable from Portal → Website content.`);
  } else {
    console.log("Website content sections already exist — skipping.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
