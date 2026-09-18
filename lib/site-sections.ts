import { z } from "zod";

// Every editable marketing-site section lives here: its shape (zod schema,
// used to validate saves from the admin UI), its TypeScript type, and its
// default content (used by the seed script and as a safety-net fallback if
// a row is ever missing from the database).
//
// To add a new editable section: add a schema below, add its default, and
// add it to SECTION_KEYS. The admin UI and public pages both read from here.

export const heroStatSchema = z.object({
  value: z.number(),
  suffix: z.string(),
  label: z.string().min(1),
});
export const heroSectionSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  headlineHighlight: z.string().min(1),
  subheadline: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
  stats: z.array(heroStatSchema).min(1),
});
export type HeroSection = z.infer<typeof heroSectionSchema>;

export const companySectionSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  shortTagline: z.string().min(1),
  location: z.string().min(1),
  serves: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  social: z.object({
    linkedin: z.string(),
    facebook: z.string(),
    twitter: z.string(),
    youtube: z.string(),
  }),
});
export type CompanySection = z.infer<typeof companySectionSchema>;

export const aboutSectionSchema = z.object({
  whoWeAreTitle: z.string().min(1),
  whoWeAreBody: z.string().min(1),
  whoWeAreBody2: z.string().min(1),
  vision: z.string().min(1),
  mission: z.string().min(1),
  leaderName: z.string().min(1),
  leaderTitle: z.string().min(1),
  leaderBio: z.string().min(1),
});
export type AboutSection = z.infer<typeof aboutSectionSchema>;

export const categoryItemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  points: z.array(z.string().min(1)).optional().default([]),
});
export const categoriesSectionSchema = z.object({ items: z.array(categoryItemSchema).min(1) });
export type CategoriesSection = z.infer<typeof categoriesSectionSchema>;

export const serviceItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  points: z.array(z.string().min(1)).optional().default([]),
});
export const servicesSectionSchema = z.object({ items: z.array(serviceItemSchema).min(1) });
export type ServicesSection = z.infer<typeof servicesSectionSchema>;

export const valueItemSchema = z.object({
  letter: z.string().min(1).max(2),
  title: z.string().min(1),
  description: z.string().min(1),
});
export const valuesSectionSchema = z.object({ items: z.array(valueItemSchema).min(1) });
export type ValuesSection = z.infer<typeof valuesSectionSchema>;

export const whyItemSchema = z.object({ title: z.string().min(1), description: z.string().min(1) });
export const whyChooseUsSectionSchema = z.object({ items: z.array(whyItemSchema).min(1) });
export type WhyChooseUsSection = z.infer<typeof whyChooseUsSectionSchema>;

export const industriesSectionSchema = z.object({ items: z.array(z.string().min(1)).min(1) });
export type IndustriesSection = z.infer<typeof industriesSectionSchema>;

export const caseStudyItemSchema = z.object({
  title: z.string().min(1),
  industry: z.string().min(1),
  challenge: z.string().min(1),
  outcome: z.string().min(1),
});
export const caseStudiesSectionSchema = z.object({ items: z.array(caseStudyItemSchema) });
export type CaseStudiesSection = z.infer<typeof caseStudiesSectionSchema>;

export const jobPositionSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  stack: z.array(z.string().min(1)).optional().default([]),
  summary: z.string().min(1),
});
export const careersSectionSchema = z.object({ positions: z.array(jobPositionSchema) });
export type CareersSection = z.infer<typeof careersSectionSchema>;

export const moduleGroupSchema = z.object({
  group: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});
export const modulesSectionSchema = z.object({ items: z.array(moduleGroupSchema).min(1) });
export type ModulesSection = z.infer<typeof modulesSectionSchema>;

export const SECTION_SCHEMAS = {
  company: companySectionSchema,
  hero: heroSectionSchema,
  about: aboutSectionSchema,
  products: categoriesSectionSchema,
  solutions: categoriesSectionSchema,
  services: servicesSectionSchema,
  values: valuesSectionSchema,
  whyChooseUs: whyChooseUsSectionSchema,
  industries: industriesSectionSchema,
  caseStudies: caseStudiesSectionSchema,
  careers: careersSectionSchema,
  modules: modulesSectionSchema,
} as const;

export type SectionKey = keyof typeof SECTION_SCHEMAS;
export const SECTION_KEYS = Object.keys(SECTION_SCHEMAS) as SectionKey[];

export type SectionDataMap = {
  company: CompanySection;
  hero: HeroSection;
  about: AboutSection;
  products: CategoriesSection;
  solutions: CategoriesSection;
  services: ServicesSection;
  values: ValuesSection;
  whyChooseUs: WhyChooseUsSection;
  industries: IndustriesSection;
  caseStudies: CaseStudiesSection;
  careers: CareersSection;
  modules: ModulesSection;
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  company: "Company & contact details",
  hero: "Homepage hero",
  about: "About page",
  products: "Products (nav + Services page)",
  solutions: "Solutions (nav + Services page)",
  services: "Core services grid",
  values: "Core values",
  whyChooseUs: "Why choose us",
  industries: "Industries served",
  caseStudies: "Portfolio / case studies",
  careers: "Careers / open positions",
  modules: "Detailed module breakdown (Services page)",
};

// Default content — used to seed the database on first run, and as a
// fallback if a section row is ever missing so pages never render broken.
export const SECTION_DEFAULTS: SectionDataMap = {
  company: {
    name: "JSS Innovative Solutions",
    tagline: "200% Customized ERP Solutions",
    shortTagline: "Innovating Your Business Judgments",
    location: "Pune, Maharashtra",
    serves: "India",
    phone: "+91 98812 64088",
    email: "hello@jssinnovative.in",
    address: "Guleria House, Bosari–Dighi Road, Dighi, Pune 411015, Maharashtra",
    social: {
      linkedin: "https://www.linkedin.com/company/jss-innovative-solutions",
      facebook: "https://www.facebook.com/jssinnovativesolutions",
      twitter: "https://twitter.com/jssinnovative",
      youtube: "https://www.youtube.com/@jssinnovativesolutions",
    },
  },
  hero: {
    eyebrow: "Pune, Maharashtra · 200% Customized ERP Solutions",
    headline: "Driving Digital Transformation for",
    headlineHighlight: "Indian manufacturing",
    subheadline:
      "JSS Innovative Solutions designs and implements ERP, HRMS, CRM and IIoT systems that are 200% customised to how your business actually runs — not the other way round.",
    primaryCta: "Request a Demo",
    secondaryCta: "Explore Our Products",
    stats: [
      { value: 100, suffix: "+", label: "Projects delivered" },
      { value: 50, suffix: "+", label: "Team members" },
      { value: 100, suffix: "%", label: "Client satisfaction" },
      { value: 8, suffix: "+", label: "Years in ERP" },
    ],
  },
  about: {
    whoWeAreTitle: "Founded on a simple observation: standard ERP fails more than it succeeds",
    whoWeAreBody:
      "Two businesses on the same street, in the same trade, rarely run their floor the same way — so a standard, configured ERP build fails one of them by design. JSS Innovative Solutions was built to fix that: every engagement starts with mapping your actual process, then building around it, not the other way round.",
    whoWeAreBody2:
      "Today our team covers full-stack development, ERP consulting, data analytics and IIoT integration — delivered by engineers who stay with the client through go-live and beyond, not a rotating support queue.",
    vision:
      "To integrate business with technology — pursuing innovations in every form likely to make our customers' operations simpler and more profitable.",
    mission:
      "Deliver 200% customised ERP, HRMS and CRM systems that map to real shop-floor process — backed by an implementation team that remains a technology partner through the client's growth, not just the rollout.",
    leaderName: "Prashant G. Sonawane",
    leaderTitle: "Chief Executive Officer · M.Sc. (Information Technology)",
    leaderBio:
      "With over two decades in enterprise IT, Prashant leads implementation strategy across every JSS engagement, carrying a track record of dozens of ERP rollouts and a belief that ERP succeeds only when management and vendor build it together.",
  },
  products: {
    items: [
      {
        slug: "erp",
        name: "ERP",
        summary: "Enterprise resource planning built 200% around how your floor already runs.",
        points: ["Inventory & warehouse", "Billing & GST/e-invoicing", "Production planning", "Financial accounting"],
      },
      {
        slug: "hrms",
        name: "HRMS",
        summary: "Payroll, attendance and employee lifecycle management in one system.",
        points: ["Biometric attendance", "Payroll & statutory compliance", "Leave management", "Employee self-service"],
      },
      {
        slug: "crm",
        name: "CRM",
        summary: "Pipeline visibility from first lead to closed sale to repeat order.",
        points: ["Lead & pipeline tracking", "Quotation & order management", "Customer support tickets", "Sales analytics"],
      },
      {
        slug: "iot",
        name: "IoT",
        summary: "Shop-floor sensors feeding live production data straight into your ERP.",
        points: ["Machine uptime monitoring", "OEE dashboards", "Predictive maintenance alerts", "Energy consumption tracking"],
      },
    ],
  },
  solutions: {
    items: [
      {
        slug: "ai",
        name: "AI & Machine Learning",
        summary: "Demand forecasting, anomaly detection and decision-support models trained on your own operating data.",
        points: [],
      },
      {
        slug: "data-analytics",
        name: "Data Analytics",
        summary: "Live dashboards and MIS reports that turn transactional data into decisions your managers actually use.",
        points: [],
      },
      {
        slug: "process-automation",
        name: "Process Automation",
        summary: "Workflow automation for approvals, alerts and repetitive back-office work that shouldn't need a human.",
        points: [],
      },
    ],
  },
  services: {
    items: [
      {
        title: "AI & ML",
        description:
          "Forecasting, anomaly detection and recommendation models built on top of your existing ERP data — not a separate silo.",
        points: ["Demand & inventory forecasting", "Quality-defect pattern detection", "Predictive maintenance"],
      },
      {
        title: "Data Analytics",
        description:
          "Dashboards and MIS reporting that management actually opens every morning, built around the metrics that move your business.",
        points: ["Live production & sales dashboards", "Custom MIS reports", "Deviation & exception alerts"],
      },
      {
        title: "IIoT / Industry 4.0",
        description:
          "Connect PLCs, sensors and legacy machines to your ERP for real-time visibility into what's actually happening on the floor.",
        points: ["Machine data capture", "OEE & downtime tracking", "Energy & utility monitoring"],
      },
      {
        title: "Custom Software Solutions",
        description:
          "Purpose-built web and mobile applications for the processes an off-the-shelf module was never designed to cover.",
        points: ["Bespoke ERP modules", "Customer/vendor portals", "Mobile field-force apps"],
      },
    ],
  },
  values: {
    items: [
      { letter: "I", title: "Integrity", description: "We commit to what we can deliver, and we deliver what we commit to." },
      { letter: "I", title: "Innovative", description: "Every implementation looks for a better way, not just the standard way." },
      { letter: "I", title: "Intelligence", description: "Decisions backed by data, not gut feel — for us and for the businesses we build for." },
      { letter: "I", title: "Inspiring", description: "We aim to leave every team we work with more confident with technology, not more dependent on us." },
      { letter: "I", title: "Initiative", description: "We flag the problem before you have to ask — on the floor and in the code." },
    ],
  },
  whyChooseUs: {
    items: [
      { title: "Consulting Approach", description: "We map your process before we propose a product — implementation starts with discovery, not a demo." },
      { title: "Customization", description: "200% tailor-made builds, not a configured template — because no two shops on the same street run the same way." },
      { title: "Future Tech", description: "React, Java Spring Boot, Node.js and modern cloud infrastructure — built to extend, not to replace in three years." },
      { title: "Scalability", description: "From a 10-user Progressive edition to an unlimited-user enterprise build, on the same underlying core." },
      { title: "Security", description: "Role-based access, encrypted credentials and audited activity logs on every system we ship." },
    ],
  },
  industries: {
    items: [
      "Textiles — ginning, spinning, weaving, garments",
      "Sheet metal & fabrication",
      "Machining & precision engineering",
      "Injection & rubber moulding",
      "Forging & cold-forging",
      "Electronics & assembly",
      "Food processing & poultry",
      "Distributors & traders",
      "Hotels & hospitality",
      "Education institutions",
    ],
  },
  caseStudies: {
    items: [
      {
        title: "Unified inventory & billing for a multi-unit textile group",
        industry: "Textiles",
        challenge: "Three plants tracking stock in separate spreadsheets, monthly GST reconciliation taking a full week.",
        outcome: "Single inventory ledger across plants, e-invoicing built in, GST filing prep cut from 5 days to under 1.",
      },
      {
        title: "Production planning overhaul for a sheet-metal manufacturer",
        industry: "Manufacturing",
        challenge: "Work orders scheduled manually on a whiteboard, frequent machine idle time going untracked.",
        outcome: "Sales-order-linked production planning with live machine-utilisation dashboards for the floor manager.",
      },
      {
        title: "HRMS & payroll rollout for a 200-employee engineering firm",
        industry: "Engineering",
        challenge: "Biometric attendance data manually re-entered into a separate payroll spreadsheet every month.",
        outcome: "Attendance-to-payroll pipeline fully automated, including PF/ESI statutory reports.",
      },
    ],
  },
  careers: {
    positions: [
      {
        title: "Full Stack Developer — Freshers Welcome",
        type: "Live-project ERP training-to-hire",
        stack: ["Java", "Spring Boot", "React.js", "MySQL"],
        summary:
          "3–4 months of live-project ERP training, then a performance-based full-time role. Freshers work on a real client implementation from week one, not a sandbox exercise.",
      },
      {
        title: "ERP Implementation Consultant",
        type: "Full-time",
        stack: ["Process mapping", "Client training", "MS SQL"],
        summary:
          "Own the discovery-to-go-live cycle for client implementations — requirement gathering, configuration, and floor-level training.",
      },
    ],
  },
  modules: {
    items: [
      { group: "Inventory & Billing", items: ["Stock & warehouse management", "GST-compliant billing & e-invoicing", "Purchase & vendor management", "Rate & margin analysis"] },
      { group: "Production", items: ["Sales-order-linked planning", "Bills of material & variance analysis", "Machine & labour efficiency tracking", "Quality control & deviation alerts"] },
      { group: "Payroll & HR", items: ["Biometric attendance capture", "Payroll & statutory compliance (PF/ESI)", "Leave & loan management", "Employee self-service portal"] },
      { group: "CRM & Sales", items: ["Lead & pipeline tracking", "Quotation & order management", "Customer support tickets", "Sales performance analytics"] },
      { group: "Finance", items: ["Financial accounting", "Accounts receivable & payable", "Budgeting & costing", "MIS & statutory reports"] },
      { group: "Command Centre", items: ["Live dashboards", "Deviation & exception alerts", "Mobile integration", "Role-based access control"] },
    ],
  },
};
