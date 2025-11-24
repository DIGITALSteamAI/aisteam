"use client";

import PageInfo from "./PageInfo";

export default function PageWrapper({
  title,
  infoPage,
  children
}: {
  title: string;
  infoPage?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>

        {infoPage && (
          <PageInfo page={infoPage} />
        )}
      </div>

      <div className="bg-white rounded p-6 shadow border border-slate-200">
        {children}
      </div>
    </div>
  );
}
