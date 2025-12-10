"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import InfoButton from "./ui/InfoButton";
import InfoPanel from "./ui/InfoPanel";
import { getPageContent } from "@/lib/pageContent";

const validPages = [
  "dashboard",
  "projects",
  "projects-listing",
  "project-details",
  "project-settings",
  "tasks",
  "tasks-listing",
  "task-details",
  "tickets",
  "tickets-listing",
  "ticket-details",
  "agents",
  "agents-listing",
  "agent-details",
  "settings",
  "clients",
  "clients-listing",
  "client-details",
  "contacts",
  "contacts-listing",
  "contact-details",
  "profile"
] as const;

type PageKey = (typeof validPages)[number];

type PageWrapperProps = {
  children: ReactNode;
  infoPage?: PageKey | string;
  title?: string;
};

export default function PageWrapper({
  children,
  infoPage,
  title
}: PageWrapperProps) {
  const [openInfo, setOpenInfo] = useState(false);
  const pageKey = infoPage as string;

  // Get content for the info panel
  const content = pageKey ? getPageContent(pageKey) : "";
  const panelTitle = title || (pageKey ? pageKey.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Information");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex-1">
          {title && (
            <h1 className="text-xl font-semibold mb-2 text-slate-800">
              {title}
            </h1>
          )}
        </div>

        {pageKey && (
          <div>
            <InfoButton onClick={() => setOpenInfo(true)} />
          </div>
        )}
      </div>

      {children}

      {pageKey && (
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
