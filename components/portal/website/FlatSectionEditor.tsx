"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button, TextField, TextArea } from "../ui";
import { useSectionContent } from "./useSectionContent";
import type { SectionKey } from "@/lib/site-sections";

export type FlatField = {
  /** Dot-path into the section object, e.g. "social.linkedin" */
  path: string;
  label: string;
  type?: "text" | "textarea" | "email";
};

function getPath(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
  return typeof value === "string" ? value : "";
}

function setPath(obj: Record<string, unknown>, path: string, value: string): Record<string, unknown> {
  const keys = path.split(".");
  const clone: Record<string, unknown> = JSON.parse(JSON.stringify(obj));
  let cursor: Record<string, unknown> = clone;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      cursor[key] = value;
    } else {
      cursor[key] = { ...(cursor[key] as Record<string, unknown>) };
      cursor = cursor[key] as Record<string, unknown>;
    }
  });
  return clone;
}

export default function FlatSectionEditor<K extends SectionKey>({
  section,
  fields,
}: {
  section: K;
  fields: FlatField[];
}) {
  const { data, loading, saving, error, saved, save } = useSectionContent(section);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (data) setDraft(JSON.parse(JSON.stringify(data)));
  }, [data]);

  if (loading || !draft) return <p className="text-sm text-slate">Loading…</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(draft as never);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) =>
          f.type === "textarea" ? (
            <div key={f.path} className="sm:col-span-2">
              <TextArea
                label={f.label}
                rows={3}
                value={getPath(draft, f.path)}
                onChange={(e) => setDraft(setPath(draft, f.path, e.target.value))}
              />
            </div>
          ) : (
            <TextField
              key={f.path}
              label={f.label}
              type={f.type === "email" ? "email" : "text"}
              value={getPath(draft, f.path)}
              onChange={(e) => setDraft(setPath(draft, f.path, e.target.value))}
            />
          )
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </Button>
        {saved && <span className="text-sm text-emerald-700">Saved.</span>}
      </div>
    </form>
  );
}
