"use client";

import React from "react";

type AssistantPanelHeaderProps = {
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  onPrimaryAction: () => void;
  primaryLabel: string;
  onClose: () => void;
};

export function AssistantPanelHeader({
  isVoiceActive,
  onToggleVoice,
  onPrimaryAction,
  primaryLabel,
  onClose
}: AssistantPanelHeaderProps) {
  return (
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
        {/* Typing or Voice toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {isVoiceActive ? "Voice" : "Typing"}
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isVoiceActive}
              onChange={onToggleVoice}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-300 peer-focus:ring-2 rounded-full peer peer-checked:bg-blue-600 transition-all" />
            <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-all peer-checked:translate-x-5" />
          </label>
        </div>

        {/* Pop out or Dock back */}
        <button
          type="button"
          onClick={onPrimaryAction}
          className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
        >
          {primaryLabel}
        </button>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
        >
          Close
        </button>
      </div>
    </header>
  );
}
