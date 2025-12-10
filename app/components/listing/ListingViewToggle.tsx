"use client";

import { LayoutGrid, List } from "lucide-react";

type ListingViewToggleProps = {
  view: "cards" | "list";
  onViewChange: (view: "cards" | "list") => void;
};

export default function ListingViewToggle({
  view,
  onViewChange,
}: ListingViewToggleProps) {
  const isCards = view === "cards";

  return (
    <div className="flex items-center bg-white border rounded overflow-hidden">
      <button
        onClick={() => onViewChange("cards")}
        className={`p-2 ${isCards ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        aria-label="Card view"
      >
        <LayoutGrid size={16} />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-2 border-l ${!isCards ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        aria-label="List view"
      >
        <List size={16} />
      </button>
    </div>
  );
}

