"use client";

import CollapsibleSection from "./CollapsibleSection";
import FlatSectionEditor from "./FlatSectionEditor";
import ListSectionEditor from "./ListSectionEditor";
import HeroSectionEditor from "./HeroSectionEditor";

export default function WebsiteContentClient() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-navy">Website content</h1>
        <p className="mt-1 text-sm text-slate">
          Everything here publishes live to the public site the moment you save — no deploy needed.
        </p>
      </div>

      <div className="space-y-4">
        <CollapsibleSection title="Company & contact details" description="Used across the nav, footer, and contact page." defaultOpen>
          <FlatSectionEditor
            section="company"
            fields={[
              { path: "name", label: "Company name" },
              { path: "tagline", label: "Tagline" },
              { path: "shortTagline", label: "Short tagline" },
              { path: "location", label: "Location" },
              { path: "serves", label: "Serves (region)" },
              { path: "phone", label: "Phone" },
              { path: "email", label: "Email", type: "email" },
              { path: "address", label: "Address", type: "textarea" },
              { path: "social.linkedin", label: "LinkedIn URL" },
              { path: "social.facebook", label: "Facebook URL" },
              { path: "social.twitter", label: "Twitter / X URL" },
              { path: "social.youtube", label: "YouTube URL" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Homepage hero" description="Headline, subheadline and the stats banner.">
          <HeroSectionEditor />
        </CollapsibleSection>

        <CollapsibleSection title="About page" description="Who we are, vision, mission, and leadership bio.">
          <FlatSectionEditor
            section="about"
            fields={[
              { path: "whoWeAreTitle", label: "\u201cWho we are\u201d heading" },
              { path: "whoWeAreBody", label: "Who we are — paragraph 1", type: "textarea" },
              { path: "whoWeAreBody2", label: "Who we are — paragraph 2", type: "textarea" },
              { path: "vision", label: "Vision", type: "textarea" },
              { path: "mission", label: "Mission", type: "textarea" },
              { path: "leaderName", label: "Leader name" },
              { path: "leaderTitle", label: "Leader title" },
              { path: "leaderBio", label: "Leader bio", type: "textarea" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Products" description="Nav dropdown + Services page (ERP, HRMS, CRM, IoT, etc.).">
          <ListSectionEditor
            section="products"
            arrayKey="items"
            itemLabel="product"
            fields={[
              { key: "slug", label: "Slug (used in the URL anchor)" },
              { key: "name", label: "Name" },
              { key: "summary", label: "Summary", type: "textarea" },
              { key: "points", label: "Bullet points", type: "stringlist" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Solutions" description="Nav dropdown + Services page (AI, Data Analytics, Process Automation).">
          <ListSectionEditor
            section="solutions"
            arrayKey="items"
            itemLabel="solution"
            fields={[
              { key: "slug", label: "Slug (used in the URL anchor)" },
              { key: "name", label: "Name" },
              { key: "summary", label: "Summary", type: "textarea" },
              { key: "points", label: "Bullet points", type: "stringlist" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Core services grid" description="The four cards on the homepage and Services page.">
          <ListSectionEditor
            section="services"
            arrayKey="items"
            itemLabel="service"
            fields={[
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
              { key: "points", label: "Bullet points", type: "stringlist" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Core values" description="The five values shown on Home and About.">
          <ListSectionEditor
            section="values"
            arrayKey="items"
            itemLabel="value"
            fields={[
              { key: "letter", label: "Letter/initial shown in the badge" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Why choose us" description="The five reasons grid on Home and About.">
          <ListSectionEditor
            section="whyChooseUs"
            arrayKey="items"
            itemLabel="reason"
            fields={[
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Industries served" description="The pill list shown on Home and Services.">
          <ListSectionEditor section="industries" arrayKey="items" itemType="string" itemLabel="industry" />
        </CollapsibleSection>

        <CollapsibleSection title="Portfolio / case studies" description="The representative-implementation cards on the Portfolio page.">
          <ListSectionEditor
            section="caseStudies"
            arrayKey="items"
            itemLabel="case study"
            fields={[
              { key: "title", label: "Title" },
              { key: "industry", label: "Industry tag" },
              { key: "challenge", label: "The challenge", type: "textarea" },
              { key: "outcome", label: "The outcome", type: "textarea" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Careers / open positions" description="Roles shown on the Careers page and in the application form.">
          <ListSectionEditor
            section="careers"
            arrayKey="positions"
            itemLabel="position"
            fields={[
              { key: "title", label: "Job title" },
              { key: "type", label: "Type (e.g. Full-time, Training-to-hire)" },
              { key: "stack", label: "Tech / skills stack", type: "stringlist" },
              { key: "summary", label: "Summary", type: "textarea" },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Detailed module breakdown" description="The deep-dive module groups on the Services page.">
          <ListSectionEditor
            section="modules"
            arrayKey="items"
            itemLabel="module group"
            fields={[
              { key: "group", label: "Group name" },
              { key: "items", label: "Items in this group", type: "stringlist" },
            ]}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}
