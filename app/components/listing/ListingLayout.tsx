"use client";

import { useState, useEffect, type ReactNode } from "react";
import ListingHeader from "./ListingHeader";
import InfoPanel from "../ui/InfoPanel";
import { getPageContent } from "@/lib/pageContent";

type ListingLayoutProps = {
  title: string;
  infoPageKey?: string;
  children?: ReactNode;
  filters: ReactNode;
  sorts: ReactNode;
  cardView: ReactNode;
  listView: ReactNode;
  storageKey?: string; // For localStorage persistence
  actionButton?: ReactNode; // Optional action button (e.g., "Add Client")
};

export default function ListingLayout({
  title,
  infoPageKey,
  children,
  filters,
  sorts,
  cardView,
  listView,
  storageKey,
  actionButton,
}: ListingLayoutProps) {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [openInfo, setOpenInfo] = useState(false);

  // Load view preference from localStorage
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved === "cards" || saved === "list") {
        setView(saved);
      }
    }
  }, [storageKey]);

  // Save view preference to localStorage
  const handleViewChange = (newView: "cards" | "list") => {
    setView(newView);
    if (storageKey) {
      localStorage.setItem(storageKey, newView);
    }
  };

  const content = infoPageKey ? getPageContent(infoPageKey) : "";
  const panelTitle = title;

  return (
    <div className="p-6">
      <ListingHeader
        title={title}
        infoPageKey={infoPageKey}
        onInfoClick={() => setOpenInfo(true)}
        filters={filters}
        sorts={sorts}
        view={view}
        onViewChange={handleViewChange}
        actionButton={actionButton}
      />

      {view === "cards" ? cardView : listView}

      {children}

      {infoPageKey && (
        <InfoPanel
          open={openInfo}
          onOpenChange={setOpenInfo}
          title={panelTitle}
          content={content}
        />
      )}
    </div>
  );
}

