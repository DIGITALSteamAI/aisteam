"use client";

import Link from "next/link";

export default function KBProjectSettingsPage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-800 space-y-10">

      <h1 className="text-3xl font-bold mb-4">
        Project Settings Documentation
      </h1>

      <p className="text-sm leading-relaxed max-w-3xl">
        This document describes the Project Settings feature in AISTEAM.  
        It explains how project configuration is stored, accessed and updated through both a modal interface and a full page view.  
        Project settings control agent behavior, domain configuration, hosting details and feature flags that affect how the system interacts with each project.
      </p>

      {/* TABLE OF CONTENTS */}
      <section id="contents">
        <h2 className="text-xl font-semibold mb-3">Contents</h2>

        <ul className="ml-4 list-disc text-sm space-y-2">
          <li><a href="#purpose" className="text-blue-600 hover:underline">Purpose</a></li>
          <li><a href="#access-paths" className="text-blue-600 hover:underline">When the settings page appears</a></li>
          <li><a href="#database" className="text-blue-600 hover:underline">Database structure</a></li>
          <li><a href="#api" className="text-blue-600 hover:underline">API routes</a></li>
          <li><a href="#architecture" className="text-blue-600 hover:underline">Component architecture</a></li>
          <li><a href="#usage" className="text-blue-600 hover:underline">Usage in the application</a></li>
          <li><a href="#future" className="text-blue-600 hover:underline">Future expansion</a></li>
        </ul>
      </section>

      {/* PURPOSE */}
      <section id="purpose">
        <h2 className="text-xl font-semibold mb-3">Purpose</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          Project settings represent the configuration layer for each project in AISTEAM.  
          These settings control how agents interact with the project, which domains are associated with it, hosting configuration and feature flags that enable or disable specific behaviors.
        </p>

        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          The following panels and systems rely on project settings:
        </p>

        <ul className="ml-5 list-disc text-sm space-y-1">
          <li><strong>Assistant System</strong> uses agent_defaults to determine which agent should handle conversations and which task types are allowed</li>
          <li><strong>Performance Panel</strong> may use domain settings to configure monitoring endpoints</li>
          <li><strong>Web Design Panel</strong> uses domain configuration to identify staging and production environments</li>
          <li><strong>Hosting Panel</strong> displays hosting provider and region information from settings</li>
          <li><strong>Feature Flags</strong> control experimental features or project specific behaviors</li>
        </ul>
      </section>

      {/* ACCESS PATHS */}
      <section id="access-paths">
        <h2 className="text-xl font-semibold mb-3">When the settings page appears</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          The Project Settings interface can be accessed through two different paths, both using the same underlying component for consistency.
        </p>

        <h3 className="text-lg font-semibold mb-2">From project listings modal</h3>
        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          When viewing the project listings page, each project card or row includes a Settings button.  
          Clicking this button opens a modal overlay that displays the full Project Settings interface.  
          The modal uses the same ProjectSettingsContainer component as the full page, ensuring identical behavior and validation.
        </p>

        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto mb-3">
{`User clicks Settings button on project card
  → ProjectSettingsModal opens
    → ProjectSettingsContainer renders inside modal
      → Settings are loaded and displayed`}
        </pre>

        <h3 className="text-lg font-semibold mb-2">From project details full page</h3>
        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          The project details page header includes a Settings link that navigates to a dedicated full page view.  
          This route is located at /projects/[projectId]/settings and provides the same settings interface without the modal overlay.  
          This path is useful when users need to reference other parts of the application while configuring settings.
        </p>

        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
{`User clicks Settings link in project header
  → Navigation to /projects/[projectId]/settings
    → ProjectSettingsPage renders
      → ProjectSettingsContainer renders on full page
        → Settings are loaded and displayed`}
        </pre>
      </section>

      {/* DATABASE */}
      <section id="database">
        <h2 className="text-xl font-semibold mb-3">Database structure</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          Project settings are stored in a dedicated table that maintains a one to one relationship with projects.  
          The settings are stored as a JSONB object, allowing flexible schema evolution without migrations.
        </p>

        <h3 className="text-lg font-semibold mb-2">project_settings table</h3>
        <p className="text-sm text-slate-700 mb-2">
          Stores all project configuration in a structured JSONB format.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-3 overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS project_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  settings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_settings_project_id 
  ON project_settings(project_id);`}
        </pre>

        <h3 className="text-lg font-semibold mb-2">Settings JSONB structure</h3>
        <p className="text-sm text-slate-700 mb-2">
          The settings column contains a JSON object with the following top level categories:
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-3 overflow-x-auto">
{`{
  "general": {
    "name": "string",
    "description": "string",
    "client": "string",
    "status": "active" | "staging" | "development" | "archived"
  },
  "domains": {
    "primary": "string",
    "staging": "string",
    "development": ["string"]
  },
  "hosting": {
    "provider": "string",
    "region": "string",
    "ssl_enabled": boolean
  },
  "agent_defaults": {
    "default_agent": "chief" | "deliveryLead" | "clientSuccess" | "creativeLead" | "growthLead" | "technicalLead" | "webEngineer",
    "allowed_task_types": ["create_page", "update_content", "create_post", "create_product", "create_ticket", "run_audit", "update_settings"],
    "auto_execute": boolean
  },
  "feature_flags": {
    "[key]": boolean | string | number | null
  }
}`}
        </pre>
      </section>

      {/* API ROUTES */}
      <section id="api">
        <h2 className="text-xl font-semibold mb-3">API routes</h2>

        <h3 className="text-lg font-semibold mb-2">GET /api/projects/settings</h3>
        <p className="text-sm text-slate-700 mb-2">
          Retrieves project settings. If no settings exist, creates a default entry and returns it.
        </p>

        <p className="text-sm font-medium mb-1">Query parameters:</p>
        <ul className="ml-5 list-disc text-sm space-y-1 mb-3">
          <li><strong>projectId</strong> (required) - UUID of the project</li>
        </ul>

        <p className="text-sm font-medium mb-1">Response shape:</p>
        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto mb-3">
{`{
  "settings": {
    "general": { ... },
    "domains": { ... },
    "hosting": { ... },
    "agent_defaults": { ... },
    "feature_flags": { ... }
  }
}`}
        </pre>

        <p className="text-sm text-slate-700 mb-3">
          If the project has no settings record, the API automatically creates one with default values before returning.
        </p>

        <h3 className="text-lg font-semibold mb-2">PATCH /api/projects/settings</h3>
        <p className="text-sm text-slate-700 mb-2">
          Updates project settings by merging the provided updates into the existing settings object.
        </p>

        <p className="text-sm font-medium mb-1">Request body:</p>
        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto mb-3">
{`{
  "projectId": "uuid",
  "updates": {
    "general": { "status": "active" },
    "domains": { "primary": "example.com" },
    "hosting": { "provider": "Vercel" },
    "agent_defaults": { "default_agent": "webEngineer" },
    "feature_flags": { "new_feature": true }
  }
}`}
        </pre>

        <p className="text-sm font-medium mb-1">Response shape:</p>
        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto mb-3">
{`{
  "ok": true,
  "settings": {
    "general": { ... },
    "domains": { ... },
    "hosting": { ... },
    "agent_defaults": { ... },
    "feature_flags": { ... }
  }
}`}
        </pre>

        <p className="text-sm text-slate-700 mb-3">
          The PATCH endpoint performs a deep merge, meaning you can update individual fields within categories without affecting other fields.  
          The API uses upsert logic, so it will create a record if one does not exist.
        </p>
      </section>

      {/* COMPONENT ARCHITECTURE */}
      <section id="architecture">
        <h2 className="text-xl font-semibold mb-3">Component architecture</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          The Project Settings feature uses a reusable container component that is rendered in both modal and full page contexts.  
          This ensures consistent behavior and validation across both access paths.
        </p>

        <h3 className="text-lg font-semibold mb-2">page.tsx</h3>
        <p className="text-sm text-slate-700 mb-2">
          Located at app/projects/[projectId]/settings/page.tsx, this is the full page route component.  
          It extracts the projectId from URL parameters and renders ProjectSettingsContainer without any modal wrapper.
        </p>

        <h3 className="text-lg font-semibold mb-2">ProjectSettingsContainer</h3>
        <p className="text-sm text-slate-700 mb-2">
          The main container component that manages all settings state and API interactions.  
          Located at app/projects/[projectId]/settings/ProjectSettingsContainer.tsx.
        </p>

        <p className="text-sm text-slate-700 mb-2">
          Responsibilities:
        </p>
        <ul className="ml-5 list-disc text-sm space-y-1 mb-3">
          <li>Fetches settings from the API on mount</li>
          <li>Manages local state for all settings categories</li>
          <li>Handles save operations by calling the PATCH endpoint</li>
          <li>Renders all category components in a form layout</li>
          <li>Displays loading and error states</li>
          <li>Accepts an optional onClose callback for modal usage</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Category components</h3>
        <p className="text-sm text-slate-700 mb-2">
          Each settings category has its own component that handles editing and validation for that specific section:
        </p>

        <ul className="ml-5 list-disc text-sm space-y-1 mb-3">
          <li><strong>GeneralInfoSettings</strong> - Project name, description, client, status</li>
          <li><strong>DomainSettings</strong> - Primary domain, staging domain, development domains array</li>
          <li><strong>HostingSettings</strong> - Hosting provider, region, SSL enabled toggle</li>
          <li><strong>AgentDefaultsSettings</strong> - Default agent selection, allowed task types checkboxes, auto execute toggle</li>
          <li><strong>FeatureFlagsSettings</strong> - Dynamic feature flags with support for boolean, string, number and null values</li>
        </ul>

        <p className="text-sm text-slate-700 mb-3">
          Each category component receives the current settings for its category and an onUpdate callback.  
          When a user makes changes, the component calls onUpdate with the partial updates, which the container merges into its state.
        </p>

        <h3 className="text-lg font-semibold mb-2">Modal wrapper</h3>
        <p className="text-sm text-slate-700 mb-2">
          Located at app/components/projects/ProjectSettingsModal.tsx, this component provides the modal overlay and close functionality.  
          It renders ProjectSettingsContainer inside a centered modal with backdrop, matching the styling pattern used by the trend settings modal.
        </p>

        <p className="text-sm text-slate-700 mb-3">
          The modal passes the onClose callback to ProjectSettingsContainer, which triggers it after a successful save operation.
        </p>
      </section>

      {/* USAGE */}
      <section id="usage">
        <h2 className="text-xl font-semibold mb-3">Usage in the application</h2>

        <h3 className="text-lg font-semibold mb-2">Requesting settings from panels</h3>
        <p className="text-sm text-slate-700 mb-2">
          Other panels and components can fetch project settings by calling the GET endpoint:
        </p>

        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto mb-3">
{`const response = await fetch(\`/api/projects/settings?projectId=\${projectId}\`);
const data = await response.json();
const settings = data.settings;

// Access specific categories
const primaryDomain = settings.domains?.primary;
const defaultAgent = settings.agent_defaults?.default_agent;
const sslEnabled = settings.hosting?.ssl_enabled;`}
        </pre>

        <h3 className="text-lg font-semibold mb-2">Agent defaults consumption</h3>
        <p className="text-sm text-slate-700 mb-2">
          The assistant system uses agent_defaults to configure behavior for each project:
        </p>

        <ul className="ml-5 list-disc text-sm space-y-1 mb-3">
          <li><strong>default_agent</strong> - When a conversation starts without an explicit agent selection, this value determines which agent handles the initial request</li>
          <li><strong>allowed_task_types</strong> - The execution API checks this array before allowing task execution. Tasks with types not in this list are rejected</li>
          <li><strong>auto_execute</strong> - When true, agents can execute tasks without explicit user confirmation, respecting the law of no return for irreversible actions</li>
        </ul>

        <p className="text-sm text-slate-700 mb-3">
          The assistant chat API loads these settings when projectContext is provided and injects them into agent prompts.
        </p>

        <h3 className="text-lg font-semibold mb-2">Feature flags consumption</h3>
        <p className="text-sm text-slate-700 mb-2">
          Feature flags allow enabling or disabling features on a per project basis.  
          Components can check feature flags like this:
        </p>

        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto mb-3">
{`const settings = await fetchSettings(projectId);
const enableNewFeature = settings.feature_flags?.new_feature === true;

if (enableNewFeature) {
  // Render or enable the new feature
}`}
        </pre>

        <p className="text-sm text-slate-700 mb-3">
          Feature flags support boolean, string, number and null values, making them flexible for various use cases beyond simple on off toggles.
        </p>
      </section>

      {/* FUTURE */}
      <section id="future">
        <h2 className="text-xl font-semibold mb-3">Future expansion</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          The project_settings table uses JSONB for the settings column, which provides significant flexibility for future expansion without requiring database migrations.
        </p>

        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          New settings categories can be added by:
        </p>

        <ul className="ml-5 list-disc text-sm space-y-1 mb-3">
          <li>Adding new top level keys to the settings JSONB object</li>
          <li>Creating new category components that handle the new settings</li>
          <li>Updating the TypeScript types in types.ts</li>
          <li>Updating the DEFAULT_SETTINGS constant in the API route</li>
        </ul>

        <p className="text-sm leading-relaxed max-w-3xl mb-3">
          The existing API routes will automatically handle new categories because they perform deep merges and preserve unknown keys.  
          This means you can add new settings without breaking existing functionality or requiring immediate updates to all consumers.
        </p>

        <p className="text-sm leading-relaxed max-w-3xl">
          Potential future categories might include:
        </p>

        <ul className="ml-5 list-disc text-sm space-y-1">
          <li>Integration settings for third party services</li>
          <li>Notification preferences</li>
          <li>Custom branding configuration</li>
          <li>Performance monitoring thresholds</li>
          <li>Backup and retention policies</li>
        </ul>
      </section>

      {/* RELATED */}
      <section id="related">
        <h2 className="text-xl font-semibold mb-3">Related pages</h2>

        <ul className="ml-4 list-disc text-sm space-y-1">
          <li>
            <Link href="/kb/projects/project-listings" className="text-blue-600 hover:underline">
              Project Listings
            </Link>
          </li>
          <li>
            <Link href="/kb/projects/project-details" className="text-blue-600 hover:underline">
              Project Details
            </Link>
          </li>
          <li>
            <Link href="/kb/agents" className="text-blue-600 hover:underline">
              Agents
            </Link>
          </li>
        </ul>
      </section>

    </div>
  );
}

