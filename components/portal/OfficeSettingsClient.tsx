"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, LocateFixed } from "lucide-react";
import { Card, Button, TextField } from "./ui";

export default function OfficeSettingsClient() {
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radiusMeters, setRadiusMeters] = useState("200");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function load() {
    const res = await fetch("/api/office-settings");
    if (res.ok) {
      const data = await res.json();
      setName(data.settings.name);
      setLat(String(data.settings.lat));
      setLng(String(data.settings.lng));
      setRadiusMeters(String(data.settings.radiusMeters));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function useCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
      },
      () => setError("Couldn't get your current location.")
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/office-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lat: Number(lat), lng: Number(lng), radiusMeters: Number(radiusMeters) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save settings.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-slate">Loading…</p>;

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/portal/settings" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back to settings
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold text-navy">Office location & geofence</h1>
        <p className="mt-1 text-sm text-slate">
          Employees can only clock in from within this radius of the office.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Office name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Latitude" type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} required />
            <TextField label="Longitude" type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} required />
          </div>
          <Button type="button" variant="secondary" onClick={useCurrentLocation}>
            <LocateFixed className="h-4 w-4" /> Use my current location
          </Button>
          <TextField
            label="Allowed radius (meters)"
            type="number"
            min={20}
            max={5000}
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {done && <p className="text-sm text-emerald-700">Office settings saved.</p>}
          <Button type="submit" disabled={submitting}>
            <MapPin className="h-4 w-4" /> {submitting ? "Saving…" : "Save settings"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
