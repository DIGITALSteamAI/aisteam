"use client";

import { useState } from "react";
import type { FeatureFlagsSettings } from "../types";

interface FeatureFlagsSettingsProps {
  settings: FeatureFlagsSettings;
  onUpdate: (updates: Partial<FeatureFlagsSettings>) => void;
}

export default function FeatureFlagsSettings({
  settings,
  onUpdate
}: FeatureFlagsSettingsProps) {
  const [newFlagKey, setNewFlagKey] = useState("");
  const [newFlagValue, setNewFlagValue] = useState("");

  const handleAddFlag = () => {
    if (newFlagKey) {
      let value: boolean | string | number | null = newFlagValue;
      
      // Try to parse as boolean
      if (newFlagValue.toLowerCase() === "true") value = true;
      else if (newFlagValue.toLowerCase() === "false") value = false;
      // Try to parse as number
      else if (!isNaN(Number(newFlagValue)) && newFlagValue !== "") {
        value = Number(newFlagValue);
      }
      // Otherwise keep as string or null if empty
      else if (newFlagValue === "") {
        value = null;
      }

      onUpdate({ [newFlagKey]: value });
      setNewFlagKey("");
      setNewFlagValue("");
    }
  };

  const handleRemoveFlag = (key: string) => {
    const updated = { ...settings };
    delete updated[key];
    onUpdate(updated);
  };

  const handleUpdateFlag = (key: string, value: boolean | string | number | null) => {
    onUpdate({ [key]: value });
  };

  const flagEntries = Object.entries(settings || {});

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Add New Feature Flag
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFlagKey}
            onChange={(e) => setNewFlagKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFlag();
              }
            }}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="flag_key"
          />
          <input
            type="text"
            value={newFlagValue}
            onChange={(e) => setNewFlagValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFlag();
              }
            }}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="value (true/false/number/string)"
          />
          <button
            onClick={handleAddFlag}
            className="px-4 py-2 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">Enter flag key and value (boolean, number, or string)</p>
      </div>

      {flagEntries.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Feature Flags
          </label>
          <div className="space-y-2">
            {flagEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">{key}</span>
                  {typeof value === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleUpdateFlag(key, e.target.checked)}
                      className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(value ?? "")}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          handleUpdateFlag(key, null);
                        } else if (!isNaN(Number(val))) {
                          handleUpdateFlag(key, Number(val));
                        } else {
                          handleUpdateFlag(key, val);
                        }
                      }}
                      className="px-2 py-1 border border-slate-300 rounded text-sm w-32 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  )}
                </div>
                <button
                  onClick={() => handleRemoveFlag(key)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

