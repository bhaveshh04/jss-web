import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Eyebrow, SectionHeading, PrimaryButton } from "@/components/ui/marketing-ui";
import { getSiteContentMany } from "@/lib/site-content-db";

export const metadata: Metadata = {
  title: "Products & Services",
  description:
    "ERP, HRMS, CRM and IoT products, plus AI, data analytics and process-automation solutions from JSS Innovative Solutions — 200% customised for manufacturing, textile and process industries.",
};

export default async function Services() {
  const { products, solutions, modules, services, industries } = await getSiteContentMany([
    "products",
    "solutions",
    "modules",
    "services",
    "industries",
  ]);

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Eyebrow dark>What we build</Eyebrow>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Products and solutions, mapped to how you work
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Every product below reads and writes to the same core, so dashboards
            and reports can span inventory, production, sales and HR instead of
            stopping at one department.
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading eyebrow="Products" title="ERP, HRMS, CRM & IoT" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.items.map((p) => (
            <div key={p.slug} id={p.slug} className="scroll-mt-24 rounded-2xl border border-line bg-white p-7">
              <h3 className="font-heading text-xl font-semibold text-navy">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{p.summary}</p>
              <ul className="mt-5 space-y-2.5">
                {p.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-slate">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-dim" strokeWidth={2} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="bg-navy-2 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading dark eyebrow="Solutions" title="AI, Data Analytics & Process Automation" />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {solutions.items.map((s) => (
              <div key={s.slug} id={s.slug} className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <h3 className="font-heading text-lg font-semibold text-white">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Under the hood"
          title="Six functional areas, one shared database"
          description="Every module below reads and writes to the same core — which is why dashboards, MIS reports and alerts can span departments."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.items.map((m) => (
            <div key={m.group} className="rounded-2xl border border-line bg-white p-7">
              <h3 className="font-heading text-lg font-semibold text-navy">{m.group}</h3>
              <ul className="mt-4 space-y-2.5">
                {m.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-dim" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CORE SERVICES DEEP DIVE */}
      <section className="border-y border-line bg-paper-dim py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="Beyond ERP" title="AI & ML, Data Analytics, IIoT & Custom Software" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.items.map((s) => (
              <div key={s.title} className="rounded-2xl border border-line bg-white p-7">
                <h3 className="font-heading text-lg font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading eyebrow="Industries" title="Vertical knowledge, not generic templates" />
        <div className="mt-12 flex flex-wrap gap-3">
          {industries.items.map((ind) => (
            <span key={ind} className="rounded-full border border-line bg-white px-5 py-3 text-sm text-navy/80">
              {ind}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 text-center sm:px-8">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Not sure which modules you need yet?
          </h2>
          <p className="max-w-xl text-white/65">
            Tell us your industry and current pain point — we&apos;ll scope the
            shortest path to a working system.
          </p>
          <PrimaryButton to="/contact">Request a Demo</PrimaryButton>
        </div>
      </section>
    </>
  );
}
