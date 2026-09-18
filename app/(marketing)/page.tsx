import { ArrowUpRight, ShieldCheck, Layers, Compass, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import { Eyebrow, SectionHeading, PrimaryButton, GhostButton } from "@/components/ui/marketing-ui";
import { StatCounter } from "@/components/ui/StatCounter";
import { getSiteContentMany } from "@/lib/site-content-db";

const whyIcons = [Compass, Layers, TrendingUp, ArrowUpRight, ShieldCheck];

export default async function Home() {
  const { company, hero, services, values, whyChooseUs, industries, about } = await getSiteContentMany([
    "company",
    "hero",
    "services",
    "values",
    "whyChooseUs",
    "industries",
    "about",
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="bp-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              {company.location} · {company.tagline}
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.75rem]">
              {hero.headline} <span className="text-gold">{hero.headlineHighlight}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{hero.subheadline}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PrimaryButton to="/contact">{hero.primaryCta}</PrimaryButton>
              <GhostButton to="/services">{hero.secondaryCta}</GhostButton>
            </div>
          </div>
        </div>

        {/* Stats banner */}
        <div className="relative border-t border-white/10 bg-navy-2">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:gap-6">
            {hero.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center">
                <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-navy sm:text-4xl">
              An ERP partner that starts with your process, not our product
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate">{about.whoWeAreBody}</p>
            <div className="mt-8">
              <GhostButton to="/about" className="border-navy/15 text-navy hover:border-navy/30 hover:bg-navy/[0.03]">
                More about us
              </GhostButton>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-7">
              <h3 className="font-heading text-lg font-semibold text-navy">Our Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{about.vision}</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-7">
              <h3 className="font-heading text-lg font-semibold text-navy">Our Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{about.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES GRID */}
      <section className="bg-navy-2 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            dark
            eyebrow="What we build"
            title="Core services"
            description="Four practice areas that plug directly into the ERP core — not bolt-on add-ons sold separately."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.items.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.06]"
              >
                <h3 className="font-heading text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.description}</p>
                <ul className="mt-4 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-white/55">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading eyebrow="Why choose us" title="Five reasons implementations stick with us" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {whyChooseUs.items.map((w, i) => {
            const Icon = whyIcons[i % whyIcons.length];
            return (
              <div key={w.title} className="rounded-2xl border border-line bg-white p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-navy/5 text-navy">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-navy">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{w.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="border-y border-line bg-paper-dim py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="Core values" title="The five I's behind every implementation" align="center" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {values.items.map((v) => (
              <div key={v.title} className="rounded-2xl border border-line bg-white p-6 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-navy font-heading text-lg font-bold text-gold">
                  {v.letter}
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Eyebrow>Industries on the floor with us</Eyebrow>
          <div className="mt-6 flex flex-wrap gap-3">
            {industries.items.map((ind) => (
              <span key={ind} className="rounded-full border border-line bg-white px-5 py-2.5 text-sm text-navy/75">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-navy py-20 text-white sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 text-center sm:px-8">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            Ready to see your process mapped, not just quoted?
          </h2>
          <p className="max-w-xl text-white/65">
            Tell us where the leakages are — inventory, billing, production, or all
            three — and we&apos;ll show you what a 200% customised implementation
            looks like on your floor.
          </p>
          <PrimaryButton to="/contact" className="mt-2">Request a Demo</PrimaryButton>
        </div>
      </section>
    </>
  );
}
