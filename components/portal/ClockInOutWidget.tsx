"use client";

import { useState } from "react";
import { MapPin, CheckCircle2, LogIn, LogOut } from "lucide-react";
import { Card, Button } from "./ui";

export default function ClockInOutWidget({
  clockedIn,
  clockedOut,
  onChange,
}: {
  clockedIn: boolean;
  clockedOut: boolean;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function getLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation isn't supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        resolve,
        () => reject(new Error("Couldn't get your location. Please allow location access and try again.")),
        { enableHighAccuracy: true, timeout: 10_000 }
      );
    });
  }

  async function handleAction(action: "clock-in" | "clock-out") {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const position = await getLocation();
      const { latitude: lat, longitude: lng } = position.coords;

      const res = await fetch(`/api/attendance/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setInfo(action === "clock-in" ? "Clocked in successfully." : "Clocked out successfully.");
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-gold/30 bg-gold/[0.04]">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-gold">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold text-navy">Location-based attendance</h2>
            <p className="mt-1 text-sm text-slate">
              {clockedOut
                ? "You've completed attendance for today."
                : clockedIn
                  ? "You're clocked in — clock out when you leave."
                  : "You'll need to be within the office geofence to clock in."}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {!clockedIn && (
            <Button onClick={() => handleAction("clock-in")} disabled={busy}>
              <LogIn className="h-4 w-4" /> {busy ? "Checking location…" : "Clock In"}
            </Button>
          )}
          {clockedIn && !clockedOut && (
            <Button variant="secondary" onClick={() => handleAction("clock-out")} disabled={busy}>
              <LogOut className="h-4 w-4" /> {busy ? "Checking location…" : "Clock Out"}
            </Button>
          )}
          {clockedOut && (
            <span className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Done for today
            </span>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {info && <p className="mt-4 text-sm text-emerald-700">{info}</p>}
    </Card>
  );
}
