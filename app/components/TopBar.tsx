"use client";

import { useAssistant } from "../assistant/AssistantProvider";

export default function TopBar() {
  const { openPanel } = useAssistant();

  return (
    <div className="topBar">
      <div className="titleZone">Welcome to AISTEAM</div>

      <div className="userZone flex items-center gap-3">
        {/* Assistant trigger button */}
        <button
          type="button"
          onClick={openPanel}
          className="text-xs px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Assistant
        </button>

        <div>User</div>
      </div>
    </div>
  );
}
