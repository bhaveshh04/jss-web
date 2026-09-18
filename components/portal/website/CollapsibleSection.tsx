"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "../ui";

export default function CollapsibleSection({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="p-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <div>
          <h3 className="font-heading text-lg font-semibold text-navy">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate">{description}</p>}
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-line p-6">{children}</div>}
    </Card>
  );
}
