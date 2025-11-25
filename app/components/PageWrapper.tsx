"use client";

import type { ReactNode } from "react";
import PageInfo from "./PageInfo";

const validPages = [
  "dashboard",
  "projects",
  "tasks",
  "businesses",
  "tickets",
  "agents",
  "settings",
  "clients",
  "contacts",
  "profile"
] as const;

type PageKey = (typeof validPages)[number];

type PageWrapperProps = {
  children: ReactNode;
  infoPage?: PageKey;
  title?: string;
};

export default function PageWrapper({
  children,
  infoPage,
  title
}: PageWrapperProps) {
  const pageKey = infoPage && validPages.includes(infoPage) ? infoPage : null;

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
            <PageInfo page={pageKey} />
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
