"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { pageHelp } from "./PageHelpContent";

// Derive valid keys and entry type directly from pageHelp
type PageKey = keyof typeof pageHelp;
type PageHelpEntry = (typeof pageHelp)[PageKey];

type PageInfoProps = {
  page: PageKey;
};

export default function PageInfo({ page }: PageInfoProps) {
  const [open, setOpen] = useState(false);

  const info: PageHelpEntry | undefined = pageHelp[page];

  if (!info) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-slate-200 rounded transition"
        aria-label="Page information"
      >
        <Info size={16} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white text-slate-900 border border-slate-300 shadow-xl">
          <DialogHeader>
            <DialogTitle>{info.title}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-600 leading-relaxed">
            {info.description}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
