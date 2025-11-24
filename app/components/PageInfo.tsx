"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { pageHelp } from "./PageHelpContent";

export default function PageInfo({ page }: { page: string }) {
  const [open, setOpen] = useState(false);
  const info = pageHelp[page];

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
