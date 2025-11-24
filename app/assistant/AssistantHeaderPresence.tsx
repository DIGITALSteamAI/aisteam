"use client";

import { useAssistant } from "./AssistantProvider";

export function AssistantHeaderPresence() {
  const { openPanel, status, isVoiceActive } = useAssistant();

  const color =
    isVoiceActive
      ? "bg-blue-600"
      : status === "thinking"
      ? "bg-amber-500"
      : status === "listening"
      ? "bg-sky-600"
      : "bg-slate-300";

  const pulse =
    isVoiceActive || status === "thinking" || status === "listening"
      ? "animate-pulse"
      : "";

  return (
    <button
      type="button"
      onClick={openPanel}
      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100 transition"
    >
      <div
        className={[
          "w-2.5 h-2.5 rounded-full transition-all",
          color,
          pulse,
        ].join(" ")}
      />

      <span className="text-[11px] text-slate-600">
        Assistant
      </span>
    </button>
  );
}
