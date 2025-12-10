"use client";

import { Info } from "lucide-react";

type InfoButtonProps = {
  onClick: () => void;
  className?: string;
};

export default function InfoButton({ onClick, className }: InfoButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-slate-200 rounded-full transition ${className || ""}`}
      aria-label="Page information"
    >
      <Info size={16} className="text-slate-600" />
    </button>
  );
}

