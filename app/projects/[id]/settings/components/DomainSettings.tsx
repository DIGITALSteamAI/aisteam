"use client";

import { useState } from "react";
import type { DomainSettings } from "../types";

interface DomainSettingsProps {
  settings: DomainSettings;
  onUpdate: (updates: Partial<DomainSettings>) => void;
}

export default function DomainSettings({
  settings,
  onUpdate
}: DomainSettingsProps) {
  const [newDevDomain, setNewDevDomain] = useState("");

  const validateDomain = (domain: string): boolean => {
    if (!domain) return true; // Allow empty
    // Basic validation: no spaces, allow dots, dashes, alphanumeric
    return !/\s/.test(domain);
  };

  const handleDomainChange = (field: "primary" | "staging", value: string) => {
    if (validateDomain(value)) {
      onUpdate({ [field]: value });
    }
  };

  const handleAddDevDomain = () => {
    if (newDevDomain && validateDomain(newDevDomain)) {
      const current = settings.development || [];
      if (!current.includes(newDevDomain)) {
        onUpdate({ development: [...current, newDevDomain] });
        setNewDevDomain("");
      }
    }
  };

  const handleRemoveDevDomain = (domain: string) => {
    const current = settings.development || [];
    onUpdate({ development: current.filter(d => d !== domain) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Primary Domain
        </label>
        <input
          type="text"
          value={settings.primary || ""}
          onChange={(e) => handleDomainChange("primary", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="example.com"
        />
        <p className="text-xs text-slate-500 mt-1">Main production domain</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Staging Domain
        </label>
        <input
          type="text"
          value={settings.staging || ""}
          onChange={(e) => handleDomainChange("staging", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="staging.example.com"
        />
        <p className="text-xs text-slate-500 mt-1">Staging environment domain</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Development Domains
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newDevDomain}
            onChange={(e) => setNewDevDomain(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddDevDomain();
              }
            }}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="dev.example.com"
          />
          <button
            onClick={handleAddDevDomain}
            className="px-4 py-2 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Add
          </button>
        </div>
        {(settings.development || []).length > 0 && (
          <div className="space-y-1">
            {settings.development?.map((domain, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-md"
              >
                <span className="text-sm text-slate-700">{domain}</span>
                <button
                  onClick={() => handleRemoveDevDomain(domain)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-500 mt-1">Additional development domains</p>
      </div>
    </div>
  );
}

