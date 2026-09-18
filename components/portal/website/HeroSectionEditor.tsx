"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button, TextField, TextArea } from "../ui";
import { useSectionContent } from "./useSectionContent";
import type { HeroSection } from "@/lib/site-sections";

const FLAT_FIELDS: { key: keyof HeroSection; label: string; type?: "text" | "textarea" }[] = [
  { key: "eyebrow", label: "Eyebrow tag (small text above headline)" },
  { key: "headline", label: "Headline (first part)" },
  { key: "headlineHighlight", label: "Headline (gold highlight part)" },
  { key: "subheadline", label: "Subheadline", type: "textarea" },
  { key: "primaryCta", label: "Primary button text" },
  { key: "secondaryCta", label: "Secondary button text" },
];

export default function HeroSectionEditor() {
  const { data, loading, saving, error, saved, save } = useSectionContent("hero");
  const [draft, setDraft] = useState<HeroSection | null>(null);

  useEffect(() => {
    if (data) setDraft(JSON.parse(JSON.stringify(data)));
  }, [data]);

  if (loading || !draft) return <p className="text-sm text-slate">Loading…</p>;

  function updateStat(index: number, patch: Partial<HeroSection["stats"][number]>) {
    setDraft((prev) => {
      if (!prev) return prev;
      const stats = prev.stats.map((s, i) => (i === index ? { ...s, ...patch } : s));
      return { ...prev, stats };
    });
  }

  function removeStat(index: number) {
    setDraft((prev) => (prev ? { ...prev, stats: prev.stats.filter((_, i) => i !== index) } : prev));
  }

  function addStat() {
    setDraft((prev) =>
      prev ? { ...prev, stats: [...prev.stats, { value: 0, suffix: "+", label: "New stat" }] } : prev
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {FLAT_FIELDS.map((f) =>
          f.type === "textarea" ? (
            <div key={f.key} className="sm:col-span-2">
              <TextArea
                label={f.label}
                rows={3}
                value={draft[f.key] as string}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            </div>
          ) : (
            <TextField
              key={f.key}
              label={f.label}
              value={draft[f.key] as string}
              onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
            />
          )
        )}
      </div>

      <div>
        <h4 className="mb-3 font-heading text-sm font-semibold text-navy">Stats banner</h4>
        <ul className="space-y-3">
          {draft.stats.map((s, i) => (
            <li key={i} className="grid grid-cols-[1fr_1fr_2fr_auto] items-end gap-3 rounded-xl border border-line bg-paper p-3">
              <TextField
                label="Value"
                type="number"
                value={String(s.value)}
                onChange={(e) => updateStat(i, { value: Number(e.target.value) })}
              />
              <TextField label="Suffix" value={s.suffix} onChange={(e) => updateStat(i, { suffix: e.target.value })} />
              <TextField label="Label" value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} />
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="grid h-9 w-9 place-items-center rounded-md text-red-500 hover:bg-red-50"
                title="Remove stat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="secondary" className="mt-3" onClick={addStat}>
          <Plus className="h-4 w-4" /> Add stat
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <Button type="button" onClick={() => save(draft)} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </Button>
        {saved && <span className="text-sm text-emerald-700">Saved.</span>}
      </div>
    </div>
  );
}
