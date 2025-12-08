"use client";

import Link from "next/link";

export default function PerformancesPanelDocPage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-900 space-y-10">

      {/* BREADCRUMBS */}
      <header>
        <p className="text-xs text-slate-500 mb-3">
          <Link href="/kb" className="text-slate-600 hover:underline">Knowledge Base</Link>
          {" › "}
          <Link href="/kb/projects" className="text-slate-600 hover:underline">Projects</Link>
          {" › "}
          <Link href="/kb/projects/project-details" className="text-slate-600 hover:underline">Project Details</Link>
          {" › "}
          <span className="text-slate-800 font-semibold">Performance Panel</span>
        </p>

        <h1 className="text-2xl font-bold mb-2">Performance Panel Documentation</h1>

        <p className="text-sm text-slate-700 max-w-3xl">
          This page documents the complete architecture of the Performance panel found inside the Project Details dashboard.  
          The goal is to ensure that future development and future ChatGPT sessions can rebuild or modify this panel
          without needing to rediscover how the system works.
        </p>
      </header>

      {/* TABLE OF CONTENTS */}
      <section id="contents">
        <h2 className="text-xl font-semibold mb-2">Contents</h2>
        <ul className="ml-4 list-disc text-sm space-y-1">
          <li><a href="#overview" className="text-blue-600 hover:underline">Overview</a></li>
          <li><a href="#layout" className="text-blue-600 hover:underline">Page layout</a></li>
          <li><a href="#data-flow" className="text-blue-600 hover:underline">Data flow</a></li>
          <li><a href="#database" className="text-blue-600 hover:underline">Database structure</a></li>
          <li><a href="#api" className="text-blue-600 hover:underline">Backend API route</a></li>
          <li><a href="#frontend" className="text-blue-600 hover:underline">Frontend component architecture</a></li>
          <li><a href="#trends" className="text-blue-600 hover:underline">Trend modes</a></li>
          <li><a href="#errors" className="text-blue-600 hover:underline">Error handling</a></li>
          <li><a href="#future" className="text-blue-600 hover:underline">Future considerations</a></li>
        </ul>
      </section>

      {/* OVERVIEW */}
      <section id="overview">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="text-sm text-slate-700 max-w-3xl">
          The Performance panel is the analytics engine of the Project Dashboard.  
          It consolidates technical performance metrics, visitor traffic and social follower counts.  
          Each metric is stored in period based buckets that allow comparison between the current period
          and the previous equivalent period (yesterday, last week, last month, last year).
        </p>
      </section>

      {/* PAGE LAYOUT */}
      <section id="layout">
        <h2 className="text-xl font-semibold mb-2">Page layout</h2>

        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
Project Details
  Panels Grid
    PerformancePanel
      Header
        Title
        Subtext for active trend mode
        Gear icon (Change trend period)
      Body
        Section: Performance metrics
        Section: Website traffic
        Section: Followers
        Metric rows (current, compare, trend icon)
        </pre>
      </section>

      {/* DATA FLOW */}
      <section id="data-flow">
        <h2 className="text-xl font-semibold mb-2">Data flow</h2>
        <p className="text-sm text-slate-700 max-w-3xl mb-2">The Performance panel loads asynchronously in four steps.</p>

        <ol className="ml-6 list-decimal text-sm text-slate-700 space-y-1 max-w-3xl">
          <li>Panel loads and retrieves the project id.</li>
          <li>Panel requests metrics from API route `/api/projects/[id]/panels/performance`.</li>
          <li>API route loads metric definitions and period based metric values.</li>
          <li>API merges definitions + values and returns grouped metrics to the frontend.</li>
        </ol>
      </section>

      {/* DATABASE */}
      <section id="database">
        <h2 className="text-xl font-semibold mb-2">Database structure</h2>
        <p className="text-sm text-slate-700 mb-4 max-w-3xl">
          The Performance panel relies on three core tables.  
          Below is the full explanation in the same structured format used across the KB.
        </p>

        {/* PROJECTS */}
        <h3 className="text-lg font-semibold mb-1">1. projects</h3>
        <p className="text-sm text-slate-700">
          Stores the project's settings including the selected trend mode under custom_data.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-3 overflow-x-auto">
{`Table: projects
Columns:
  id            uuid primary key
  tenant_id     uuid
  name          text
  cms_url       text
  domain        text
  cms           text
  custom_data   jsonb

custom_data.settings.performance_trend_mode can be:
  "yesterday" | "weekly" | "monthly" | "yearly"`}
        </pre>

        {/* DEFINITIONS */}
        <h3 className="text-lg font-semibold mb-1">2. project_panel_metric_definitions</h3>
        <p className="text-sm text-slate-700 mb-2">
          Defines which metrics belong to the Performance panel and how they are labeled.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-3 overflow-x-auto">
{`Table: project_panel_metric_definitions
Columns:
  id          uuid primary key
  panel_key   text   ("performance")
  metric_key  text
  label       text
  description text
  sort_order  integer

Performance metric keys include:
  speed_score
  load_time
  seo_score
  accessibility
  visitors
  top_pages
  facebook_followers
  instagram_followers
  tiktok_followers
  youtube_subscribers`}
        </pre>

        {/* METRICS */}
        <h3 className="text-lg font-semibold mb-1">3. project_panel_metrics</h3>
        <p className="text-sm text-slate-700">
          Stores the actual period based metric values.
        </p>

        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-3 overflow-x-auto">
{`Table: project_panel_metrics
Columns:
  id            uuid primary key
  project_id    uuid  references projects(id)
  panel_key     text   ("performance")
  metric_key    text
  period_type   text    daily | daily_prev | weekly | weekly_prev ...
  period_start  date
  period_end    date
  value         text    numeric value stored as text
  unit          text null
  source        text null
  created_at    timestamptz
  updated_at    timestamptz`}
        </pre>

        <h4 className="text-base font-semibold mb-1">Period types</h4>
        <ul className="ml-6 list-disc text-sm">
          <li>daily / daily_prev</li>
          <li>weekly / weekly_prev</li>
          <li>monthly / monthly_prev</li>
          <li>yearly / yearly_prev</li>
        </ul>

        <p className="text-sm text-slate-700 mt-3 max-w-3xl">
          The job of the API is to select the correct pair based on the active trend mode.
        </p>
      </section>

      {/* API ROUTE */}
      <section id="api">
        <h2 className="text-xl font-semibold mb-2">Backend API route</h2>

        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-3 overflow-x-auto">
GET /api/projects/[id]/panels/performance
        </pre>

        <p className="text-sm text-slate-700">
          This route retrieves metric definitions, loads the appropriate period values
          and computes trend direction for each metric before returning.
        </p>
      </section>

      {/* FRONTEND */}
      <section id="frontend">
        <h2 className="text-xl font-semibold mb-2">Frontend component architecture</h2>

        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-3 overflow-x-auto">
File:
  app/projects/[id]/panels/PerformancesPanel.tsx
        </pre>

        <p className="text-sm text-slate-700 mb-3">Responsibilities:</p>
        <ul className="ml-6 list-disc text-sm text-slate-700 space-y-1">
          <li>Fetch metrics</li>
          <li>Display active trend summary</li>
          <li>Group metrics into three UI clusters</li>
          <li>Render comparison values and trend icons</li>
          <li>Provide modal for changing trend settings</li>
        </ul>
      </section>

      {/* TREND MODES */}
      <section id="trends">
        <h2 className="text-xl font-semibold mb-2">Trend modes</h2>

        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-3 overflow-x-auto">
"yesterday" → daily vs daily_prev
"weekly"    → weekly vs weekly_prev
"monthly"   → monthly vs monthly_prev
"yearly"    → yearly vs yearly_prev
        </pre>

        <p className="text-sm text-slate-700 max-w-3xl">
          These values are consistent everywhere: database, API and UI.
        </p>
      </section>

      {/* ERRORS */}
      <section id="errors">
        <h2 className="text-xl font-semibold mb-2">Error handling</h2>
        <ul className="ml-6 list-disc text-sm text-slate-700 space-y-1 max-w-3xl">
          <li>Missing metrics default to zero.</li>
          <li>Missing compare period disables parentheses.</li>
          <li>Invalid trend mode falls back to yesterday.</li>
        </ul>
      </section>

      {/* FUTURE */}
      <section id="future">
        <h2 className="text-xl font-semibold mb-2">Future considerations</h2>
        <ul className="ml-6 list-disc text-sm text-slate-700 space-y-1 max-w-3xl">
          <li>Real time ingestion from Google Search Console.</li>
          <li>SmartCrawl integration for speed and SEO stats.</li>
          <li>Ability to add new metrics through database only.</li>
          <li>Drilldown history graphs for each metric.</li>
        </ul>
      </section>
    </div>
  );
}
