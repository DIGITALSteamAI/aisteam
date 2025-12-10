"use client";

import type { ReactNode } from "react";
import InfoButton from "../ui/InfoButton";
import ListingViewToggle from "./ListingViewToggle";

type ListingHeaderProps = {
  title: string;
  infoPageKey?: string;
  onInfoClick: () => void;
  filters: ReactNode;
  sorts: ReactNode;
  view: "cards" | "list";
  onViewChange: (view: "cards" | "list") => void;
  actionButton?: ReactNode;
};

export default function ListingHeader({
  title,
  infoPageKey,
  onInfoClick,
  filters,
  sorts,
  view,
  onViewChange,
  actionButton,
}: ListingHeaderProps) {
  return (
    <>
      {/* Title row with info button and action button */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex-1 flex items-center gap-2">
          <h1 className="text-xl font-semibold mb-2 text-slate-800 uppercase">{title}</h1>
          {infoPageKey && (
            <div className="mb-2">
              <InfoButton onClick={onInfoClick} />
            </div>
          )}
        </div>
        {actionButton && (
          <div>
            {actionButton}
          </div>
        )}
      </div>

      {/* Filter, sort, and view toggle row */}
      <section className="w-full bg-slate-50 border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-end gap-3">
          {filters}
          {sorts}
          <ListingViewToggle view={view} onViewChange={onViewChange} />
        </div>
      </section>
    </>
  );
}

