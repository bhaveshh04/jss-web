import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Eyebrow, SectionHeading } from "@/components/ui/marketing-ui";
import CareersApplyForm from "@/components/marketing/CareersApplyForm";
import { getSiteContent } from "@/lib/site-content-db";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open roles at JSS Innovative Solutions, including a Full Stack Developer training-to-hire position working on live ERP implementations in Java, Spring Boot, React and MySQL.",
};

export default async function Careers() {
  const careers = await getSiteContent("careers");
  const positions = careers.positions;

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Eyebrow dark>Careers</Eyebrow>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Build ERP that ships to real clients, not a sandbox
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            We keep the team small and the implementations real — every hire works
            on a live client engagement from week one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading eyebrow="Open positions" title="Current openings" />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {positions.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-white p-8">
              <span className="rounded-full bg-navy/5 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-navy/70">
                {p.type}
              </span>
              <h2 className="mt-4 font-heading text-xl font-semibold text-navy">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate">{p.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full border border-line px-3 py-1 text-xs text-navy/70">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4 rounded-2xl border border-gold/30 bg-gold/[0.06] p-7">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-gold-dim" strokeWidth={1.75} />
          <p className="text-sm leading-relaxed text-navy/80">
            <strong className="font-semibold">Please note:</strong> we are not a training
            institute — we are a working ERP solutions organisation, and every role above
            is a real seat on a live implementation team.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-paper-dim py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionHeading align="center" eyebrow="Apply" title="Send us your details" />
          <div className="mt-10">
            <CareersApplyForm positions={positions} />
          </div>
        </div>
      </section>
    </>
  );
}
