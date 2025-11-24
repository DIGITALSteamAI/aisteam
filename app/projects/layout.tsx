"use client";

import React from "react";
import SidePanel from "../components/SidePanel";
import AssistantDockListener from "../assistant/AssistantDockListener";
import { AssistantPanel } from "../assistant/AssistantPanel";
import { AssistantHeaderPresence } from "../assistant/AssistantHeaderPresence";

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AssistantDockListener>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <SidePanel />

        {/* Main area */}
        <div className="flex flex-col flex-1">

          {/* Top bar */}
          <header className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
            <div className="text-sm font-medium tracking-tight">
              Welcome to AISTEAM
            </div>
            <div className="flex items-center">
              <AssistantHeaderPresence />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>

        {/* Assistant panel */}
        <AssistantPanel />
      </div>
    </AssistantDockListener>
  );
}
