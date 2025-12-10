"use client";

import React from "react";
import SidePanel from "./SidePanel";
import AssistantDockListener from "../assistant/AssistantDockListener";
import { AssistantPanel } from "../assistant/AssistantPanel";
import { AssistantHeaderPresence } from "../assistant/AssistantHeaderPresence";

interface BaseLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
}

export default function BaseLayout({ 
  children, 
  headerTitle = "Welcome to AISTEAM" 
}: BaseLayoutProps) {
  return (
    /* TEMPORARILY DISABLED: AssistantDockListener to test click event interception */
    /* <AssistantDockListener> */
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SidePanel />

        {/* Main area */}
        <div className="flex flex-col flex-1">
          {/* Top bar */}
          <header className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
            <div className="text-sm font-medium tracking-tight">
              {headerTitle}
            </div>
            <div className="flex items-center">
              {/* TEMPORARILY DISABLED: AssistantHeaderPresence */}
              {/* <AssistantHeaderPresence /> */}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto bg-slate-50">
            {children}
          </main>
        </div>

        {/* TEMPORARILY DISABLED: Assistant panel */}
        {/* <AssistantPanel /> */}
      </div>
    /* </AssistantDockListener> */
  );
}

