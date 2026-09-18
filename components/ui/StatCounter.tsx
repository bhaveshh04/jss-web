"use client";

import { useEffect, useRef, useState } from "react";

export function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <div className="font-heading text-3xl font-bold text-white sm:text-4xl">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-xs text-white/55 sm:text-sm">{label}</div>
    </div>
  );
}
