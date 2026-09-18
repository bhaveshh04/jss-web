"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button, TextField, TextArea } from "../ui";
import { useSectionContent } from "./useSectionContent";
import type { SectionKey } from "@/lib/site-sections";

export type ItemField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "stringlist" | "number";
  placeholder?: string;
};

type ObjectItem = Record<string, unknown>;

function emptyItem(fields: ItemField[]): ObjectItem {
  const item: ObjectItem = {};
  for (const f of fields) {
    item[f.key] = f.type === "stringlist" ? [] : f.type === "number" ? 0 : "";
  }
  return item;
}

/**
 * Renders + edits a section shaped `{ [arrayKey]: T[] }`, where T is either a
 * plain string (itemType "string") or a flat object described by `fields`
 * (itemType "object", the default). Covers every list-shaped content
 * section — products, solutions, services, values, whyChooseUs, industries,
 * caseStudies, careers, modules — from one component.
 */
export default function ListSectionEditor<K extends SectionKey>({
  section,
  arrayKey,
  fields,
  itemType = "object",
  itemLabel = "item",
}: {
  section: K;
  arrayKey: string;
  fields?: ItemField[];
  itemType?: "object" | "string";
  itemLabel?: string;
}) {
  const { data, loading, saving, error, saved, save } = useSectionContent(section);
  const [items, setItems] = useState<unknown[] | null>(null);

  useEffect(() => {
    if (data) {
      const arr = (data as unknown as Record<string, unknown>)[arrayKey];
      setItems(Array.isArray(arr) ? JSON.parse(JSON.stringify(arr)) : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (loading || items === null) return <p className="text-sm text-slate">Loading…</p>;

  function updateItem(index: number, next: unknown) {
    setItems((prev) => (prev ? prev.map((it, i) => (i === index ? next : it)) : prev));
  }

  function removeItem(index: number) {
    setItems((prev) => (prev ? prev.filter((_, i) => i !== index) : prev));
  }

  function addItem() {
    const next = itemType === "string" ? "" : emptyItem(fields ?? []);
    setItems((prev) => (prev ? [...prev, next] : [next]));
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      if (!prev) return prev;
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function handleSave() {
    const base = (data as unknown as Record<string, unknown>) ?? {};
    await save({ ...base, [arrayKey]: items } as never);
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                {itemType === "string" ? (
                  <TextField
                    label={`${itemLabel} ${index + 1}`}
                    value={typeof item === "string" ? item : ""}
                    onChange={(e) => updateItem(index, e.target.value)}
                  />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(fields ?? []).map((f) => (
                      <div key={f.key} className={f.type === "textarea" || f.type === "stringlist" ? "sm:col-span-2" : ""}>
                        {f.type === "textarea" ? (
                          <TextArea
                            label={f.label}
                            rows={2}
                            placeholder={f.placeholder}
                            value={String((item as ObjectItem)[f.key] ?? "")}
                            onChange={(e) => updateItem(index, { ...(item as ObjectItem), [f.key]: e.target.value })}
                          />
                        ) : f.type === "stringlist" ? (
                          <TextArea
                            label={`${f.label} (one per line)`}
                            rows={3}
                            placeholder={f.placeholder}
                            value={(((item as ObjectItem)[f.key] as string[]) ?? []).join("\n")}
                            onChange={(e) =>
                              updateItem(index, {
                                ...(item as ObjectItem),
                                [f.key]: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                              })
                            }
                          />
                        ) : f.type === "number" ? (
                          <TextField
                            label={f.label}
                            type="number"
                            value={String((item as ObjectItem)[f.key] ?? 0)}
                            onChange={(e) => updateItem(index, { ...(item as ObjectItem), [f.key]: Number(e.target.value) })}
                          />
                        ) : (
                          <TextField
                            label={f.label}
                            placeholder={f.placeholder}
                            value={String((item as ObjectItem)[f.key] ?? "")}
                            onChange={(e) => updateItem(index, { ...(item as ObjectItem), [f.key]: e.target.value })}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate hover:bg-paper-dim disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate hover:bg-paper-dim disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="grid h-7 w-7 place-items-center rounded-md text-red-500 hover:bg-red-50"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-xl border border-dashed border-line py-6 text-center text-sm text-slate">
            Nothing here yet — add one below.
          </li>
        )}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={addItem}>
          <Plus className="h-4 w-4" /> Add {itemLabel}
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </Button>
        {saved && <span className="text-sm text-emerald-700">Saved.</span>}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
