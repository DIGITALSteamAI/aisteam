"use client";

import { useState } from "react";
import type { AgentDefaultsSettings } from "../types";

interface AgentDefaultsSettingsProps {
  settings: AgentDefaultsSettings;
  onUpdate: (updates: Partial<AgentDefaultsSettings>) => void;
}

const AVAILABLE_AGENTS = [
  { value: "chief", label: "Chief AI Officer" },
  { value: "deliveryLead", label: "Delivery Lead" },
  { value: "clientSuccess", label: "Client Success Lead" },
  { value: "creativeLead", label: "Creative Lead" },
  { value: "growthLead", label: "Growth Lead" },
  { value: "technicalLead", label: "Technical Lead" },
  { value: "webEngineer", label: "Web Engineer" }
];

const AVAILABLE_TASK_TYPES = [
  "create_page",
  "update_content",
  "create_post",
  "create_product",
  "create_ticket",
  "run_audit",
  "update_settings"
];

export default function AgentDefaultsSettings({
  settings,
  onUpdate
}: AgentDefaultsSettingsProps) {
  const [newTaskType, setNewTaskType] = useState("");

  const handleToggleTaskType = (taskType: string) => {
    const current = settings.allowed_task_types || [];
    if (current.includes(taskType)) {
      onUpdate({ allowed_task_types: current.filter(t => t !== taskType) });
    } else {
      onUpdate({ allowed_task_types: [...current, taskType] });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Default Agent
        </label>
        <select
          value={settings.default_agent || "chief"}
          onChange={(e) => onUpdate({ default_agent: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          {AVAILABLE_AGENTS.map(agent => (
            <option key={agent.value} value={agent.value}>
              {agent.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">Default agent for this project's conversations</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Allowed Task Types
        </label>
        <div className="space-y-2">
          {AVAILABLE_TASK_TYPES.map(taskType => (
            <label
              key={taskType}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(settings.allowed_task_types || []).includes(taskType)}
                onChange={() => handleToggleTaskType(taskType)}
                className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
              />
              <span className="text-sm text-slate-700">{taskType}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">Task types allowed for this project</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="auto-execute"
          checked={settings.auto_execute ?? false}
          onChange={(e) => onUpdate({ auto_execute: e.target.checked })}
          className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
        />
        <label htmlFor="auto-execute" className="text-sm font-medium text-slate-700">
          Auto-execute Tasks
        </label>
        <p className="text-xs text-slate-500">Allow agents to execute tasks without explicit confirmation</p>
      </div>
    </div>
  );
}

