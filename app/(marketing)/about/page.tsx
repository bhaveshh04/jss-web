import type { Metadata } from "next";
import { Eyebrow, SectionHeading, PrimaryButton } from "@/components/ui/marketing-ui";
import { getSiteContentMany } from "@/lib/site-content-db";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "JSS Innovative Solutions is a Pune-based ERP implementation partner — our story, vision, mission and the values behind every 200% customised build.",
};

export default async function About() {
  const { company, about, values, whyChooseUs } = await getSiteContentMany([
    "company",
    "about",
    "values",
    "whyChooseUs",
  ]);

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Eyebrow dark>About {company.name}</Eyebrow>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Integrating business with technology
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            We&apos;re a {company.location}-based ERP and software development
            partner, building systems for manufacturing, textile and process
            industries across {company.serves}.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-navy sm:text-4xl">
              {about.whoWeAreTitle}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate">{about.whoWeAreBody}</p>
            <p className="mt-4 text-base leading-relaxed text-slate">{about.whoWeAreBody2}</p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-2xl border border-line bg-white p-8">
              <h3 className="font-heading text-xl font-semibold text-navy">Our Vision</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate">{about.vision}</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-8">
              <h3 className="font-heading text-xl font-semibold text-navy">Our Mission</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate">{about.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-navy-2 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading dark eyebrow="Why choose us" title="What an engagement with us actually looks like" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {whyChooseUs.items.map((w) => (
              <div key={w.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-heading text-base font-semibold text-white">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{w.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading eyebrow="Core values" title="The five I's" align="center" />
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
      </section>

      {/* LEADERSHIP */}
      <section className="border-y border-line bg-paper-dim py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-center">
            <div>
              <Eyebrow>Leadership</Eyebrow>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-navy">
                Led from the floor, not the boardroom
              </h2>
            </div>
            <div className="rounded-2xl border border-line bg-white p-8">
              <h3 className="font-heading text-xl font-semibold text-navy">{about.leaderName}</h3>
              <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-wide text-gold-dim">
                {about.leaderTitle}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate">{about.leaderBio}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 text-center sm:px-8">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Want the full picture before you call?
          </h2>
          <PrimaryButton to="/services">See what we build</PrimaryButton>
        </div>
      </section>
    </>
  );
}
