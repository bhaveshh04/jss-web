import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { Eyebrow, SectionHeading } from "@/components/ui/marketing-ui";
import ContactForm from "@/components/marketing/ContactForm";
import { getSiteContent } from "@/lib/site-content-db";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with JSS Innovative Solutions for an ERP demo, implementation quote, or support query. Pune office, phone and email details inside.",
};

export default async function Contact() {
  const company = await getSiteContent("company");

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24">
          <Eyebrow dark>Contact</Eyebrow>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Let&apos;s map your process before we talk product
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Reach out for a discovery call, a product demo, or a general question —
            we typically reply within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading eyebrow="Reach us directly" title="Prefer to just call or write?" />
            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-dim" strokeWidth={1.75} />
                <div>
                  <div className="font-sans text-xs font-semibold uppercase tracking-wide text-slate">Call</div>
                  <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="mt-1 block font-heading text-base font-semibold text-navy">
                    {company.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-dim" strokeWidth={1.75} />
                <div>
                  <div className="font-sans text-xs font-semibold uppercase tracking-wide text-slate">Email</div>
                  <a href={`mailto:${company.email}`} className="mt-1 block break-all font-heading text-base font-semibold text-navy">
                    {company.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-dim" strokeWidth={1.75} />
                <div>
                  <div className="font-sans text-xs font-semibold uppercase tracking-wide text-slate">Office</div>
                  <p className="mt-1 font-heading text-base font-semibold text-navy">{company.address}</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 overflow-hidden rounded-2xl border border-line">
              <iframe
                title="JSS Innovative Solutions office location"
                className="h-64 w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(company.address)}&output=embed`}
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
