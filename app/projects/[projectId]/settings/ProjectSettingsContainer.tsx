"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProjectSettings, SettingsUpdate } from "./types";
import GeneralInfoSettings from "./components/GeneralInfoSettings";
import DomainSettings from "./components/DomainSettings";
import HostingSettings from "./components/HostingSettings";
import AgentDefaultsSettings from "./components/AgentDefaultsSettings";
import FeatureFlagsSettings from "./components/FeatureFlagsSettings";

interface ProjectSettingsContainerProps {
  projectId: string;
  onClose?: () => void;
}

export default function ProjectSettingsContainer({
  projectId,
  onClose
}: ProjectSettingsContainerProps) {
  const [settings, setSettings] = useState<ProjectSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch(`/api/projects/settings?projectId=${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to load settings");
        }
        const data = await response.json();
        setSettings(data.settings);
      } catch (err: any) {
        setError(err.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      loadSettings();
    }
  }, [projectId]);

  // Handle category updates
  const handleCategoryUpdate = useCallback((category: keyof ProjectSettings, updates: any) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [category]: { ...prev[category], ...updates }
      };
    });
  }, []);

  // Save all settings
  const handleSave = useCallback(async () => {
    if (!settings) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/projects/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          updates: settings
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      // Success - close modal if provided
      if (onClose) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }, [settings, projectId, onClose]);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-600">
        Loading settings...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || "Failed to load settings"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* General Info */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">General Information</h3>
        <GeneralInfoSettings
          settings={settings.general}
          onUpdate={(updates) => handleCategoryUpdate("general", updates)}
        />
      </div>

      {/* Domains */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Domains</h3>
        <DomainSettings
          settings={settings.domains}
          onUpdate={(updates) => handleCategoryUpdate("domains", updates)}
        />
      </div>

      {/* Hosting */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hosting</h3>
        <HostingSettings
          settings={settings.hosting}
          onUpdate={(updates) => handleCategoryUpdate("hosting", updates)}
        />
      </div>

      {/* Agent Defaults */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Defaults</h3>
        <AgentDefaultsSettings
          settings={settings.agent_defaults}
          onUpdate={(updates) => handleCategoryUpdate("agent_defaults", updates)}
        />
      </div>

      {/* Feature Flags */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Feature Flags</h3>
        <FeatureFlagsSettings
          settings={settings.feature_flags}
          onUpdate={(updates) => handleCategoryUpdate("feature_flags", updates)}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onClose && (
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

