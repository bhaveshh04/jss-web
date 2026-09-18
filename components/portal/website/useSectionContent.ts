"use client";

import { useEffect, useState } from "react";
import type { SectionKey, SectionDataMap } from "@/lib/site-sections";

export function useSectionContent<K extends SectionKey>(section: K) {
  const [data, setData] = useState<SectionDataMap[K] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/site-content/${section}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't load this section.");
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  async function save(next: SectionDataMap[K]) {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/site-content/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't save this section.");
      setData(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  return { data, setData, loading, saving, error, saved, save, reload: load };
}
