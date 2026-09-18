import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import type { CompanySection, CategoriesSection } from "@/lib/site-sections";

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z" />
    </svg>
  );
}
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9V9.9H8v3.1h2.62v8h2.88Z" />
    </svg>
  );
}
function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.5 6.4c-.6.27-1.25.45-1.93.53a3.4 3.4 0 0 0 1.48-1.87c-.65.38-1.36.66-2.13.81a3.36 3.36 0 0 0-5.73 3.06A9.53 9.53 0 0 1 5.1 5.6a3.36 3.36 0 0 0 1.04 4.49c-.55-.02-1.07-.17-1.53-.42v.04a3.36 3.36 0 0 0 2.7 3.3 3.4 3.4 0 0 1-1.52.06 3.37 3.37 0 0 0 3.14 2.34A6.75 6.75 0 0 1 3.5 16.8a9.5 9.5 0 0 0 5.15 1.51c6.18 0 9.56-5.12 9.56-9.56l-.01-.44c.66-.47 1.23-1.06 1.68-1.73l.02-.18Z" />
    </svg>
  );
}
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2s-.2-1.5-.83-2.15c-.8-.83-1.68-.84-2.1-.89C15.7 4 12 4 12 4h-.01s-3.68 0-6.66.16c-.42.05-1.3.06-2.1.89C2.6 5.7 2.4 7.2 2.4 7.2S2.2 8.95 2.2 10.7v1.6c0 1.75.2 3.5.2 3.5s.2 1.5.83 2.15c.8.84 1.85.81 2.32.9 1.68.16 7.05.16 7.05.16s3.7 0 6.68-.17c.42-.05 1.3-.06 2.1-.89.63-.65.83-2.15.83-2.15s.2-1.75.2-3.5v-1.6c0-1.75-.2-3.5-.2-3.5ZM9.9 14.6V8.9l5.4 2.86-5.4 2.85Z" />
    </svg>
  );
}

const staticColumn = {
  title: "Company",
  links: [
    { to: "/about", label: "About us" },
    { to: "/services", label: "Services" },
    { to: "/portfolio", label: "Portfolio" },
    { to: "/careers", label: "Careers" },
  ],
};

type Props = {
  company: CompanySection;
  products: CategoriesSection["items"];
};

export default function Footer({ company, products }: Props) {
  const columns = [
    staticColumn,
    { title: "Products", links: products.map((p) => ({ to: `/services#${p.slug}`, label: p.name })) },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-gold font-heading text-base font-bold text-navy">
                JS
              </span>
              <span className="font-heading text-base font-semibold text-white">{company.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {company.tagline} — a Pune-based ERP implementation and software
              development partner serving manufacturing, textile and process
              industries across {company.serves}.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { href: company.social.linkedin, Icon: LinkedinIcon },
                { href: company.social.facebook, Icon: FacebookIcon },
                { href: company.social.twitter, Icon: TwitterIcon },
                { href: company.social.youtube, Icon: YoutubeIcon },
              ].map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/40">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.to} className="text-sm text-white/75 transition-colors hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/40">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${company.email}`} className="break-all hover:text-gold">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="font-sans text-xs text-white/40">{company.tagline} · {company.location}</p>
        </div>
      </div>
    </footer>
  );
}
