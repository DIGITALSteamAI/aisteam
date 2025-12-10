"use client";

export const dynamic = "force-dynamic";
export const revalidate = false;

import React, { useEffect, useState } from "react";
import ChiefAIOfficerPanel from "../assistant/supervisor/ChiefAIOfficer";
import PanelShimmer from "../components/PanelShimmer";

export default function AssistantPopoutPage() {
  const [showShimmer, setShowShimmer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShimmer(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDockBack = () => {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: "ASSISTANT_DOCK_BACK" },
          window.location.origin
        );
      }
    } catch (err) {
      console.warn("Parent window unavailable, skipping postMessage");
    }

    window.close();
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
        <div className="text-sm font-semibold text-slate-900">
          AI Team Assistant
        </div>

        <button
          onClick={handleDockBack}
          className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded"
        >
          Dock back in
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <ChiefAIOfficerPanel />
        <PanelShimmer show={showShimmer} />
      </div>
    </div>
  );
}
