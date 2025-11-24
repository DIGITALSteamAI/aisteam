"use client";

import React, { useEffect, useState } from "react";
import { useAssistant } from "./AssistantProvider";
import ChiefAIOfficerPanel from "./supervisor/ChiefAIOfficer";
import PanelShimmer from "../components/PanelShimmer";

export function AssistantPanel() {
  const {
    isOpen,
    closePanel,
    isVoiceActive,
    startVoice,
    stopVoice
  } = useAssistant();

  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowShimmer(true);
      const timer = setTimeout(() => {
        setShowShimmer(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowShimmer(false);
    }
  }, [isOpen]);

  const handleToggleMode = () => {
    if (isVoiceActive) {
      stopVoice();
    } else {
      startVoice();
    }
  };

  const handlePopout = () => {
    if (typeof window === "undefined") return;

    const win = window.open(
      "/assistantPopout",
      "AISTEAM_ASSISTANT_POPOUT",
      "width=480,height=720"
    );

    if (win && !win.closed) {
      closePanel();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closePanel}
        />
      )}

      <aside
        className={[
          "fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm bg-white",
          "border-l shadow-xl z-50 flex flex-col",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        ].join(" ")}
      >
        
        <header className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              AISTEAM assistant
            </div>
            <div className="text-[11px] text-slate-500">
              Chief AI Officer panel
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {isVoiceActive ? "Voice" : "Typing"}
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVoiceActive}
                  onChange={handleToggleMode}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:ring-2 rounded-full peer peer-checked:bg-blue-600 transition-all" />
                <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-all peer-checked:translate-x-5" />
              </label>
            </div>

            <button
              type="button"
              onClick={handlePopout}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
            >
              Pop out
            </button>

            <button
              type="button"
              onClick={closePanel}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
            >
              Close
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <ChiefAIOfficerPanel />
          <PanelShimmer show={showShimmer} />
        </div>
      </aside>
    </>
  );
}
