"use client";

import SidePanel from "@/app/components/SidePanel";

export default function KBLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SidePanel />
      <div className="flex-1 p-8 bg-slate-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}
