"use client";

import type { GeneralInfoSettings } from "../types";

interface GeneralInfoSettingsProps {
  settings: GeneralInfoSettings;
  onUpdate: (updates: Partial<GeneralInfoSettings>) => void;
}

export default function GeneralInfoSettings({
  settings,
  onUpdate
}: GeneralInfoSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Project Name
        </label>
        <input
          type="text"
          value={settings.name || ""}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={settings.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Enter project description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Client
        </label>
        <input
          type="text"
          value={settings.client || ""}
          onChange={(e) => onUpdate({ client: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Enter client name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Status
        </label>
        <select
          value={settings.status || "active"}
          onChange={(e) => onUpdate({ status: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="active">Active</option>
          <option value="staging">Staging</option>
          <option value="development">Development</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>
  );
}

