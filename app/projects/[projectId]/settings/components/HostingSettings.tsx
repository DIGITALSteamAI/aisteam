"use client";

import type { HostingSettings } from "../types";

interface HostingSettingsProps {
  settings: HostingSettings;
  onUpdate: (updates: Partial<HostingSettings>) => void;
}

export default function HostingSettings({
  settings,
  onUpdate
}: HostingSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Hosting Provider
        </label>
        <input
          type="text"
          value={settings.provider || ""}
          onChange={(e) => onUpdate({ provider: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="e.g., Vercel, AWS, DigitalOcean"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Region
        </label>
        <input
          type="text"
          value={settings.region || ""}
          onChange={(e) => onUpdate({ region: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="e.g., us-east-1, eu-west-1"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="ssl-enabled"
          checked={settings.ssl_enabled ?? true}
          onChange={(e) => onUpdate({ ssl_enabled: e.target.checked })}
          className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
        />
        <label htmlFor="ssl-enabled" className="text-sm font-medium text-slate-700">
          SSL/TLS Enabled
        </label>
      </div>
    </div>
  );
}

