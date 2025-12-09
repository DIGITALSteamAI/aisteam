"use client";

import Link from "next/link";

export default function KBProjectDetailsPage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-800 space-y-10">

      <h1 className="text-3xl font-bold mb-4">
        Project Details Documentation
      </h1>

      <p className="text-sm leading-relaxed max-w-3xl">
        This document explains the structure and behaviour of the Project Details page.  
        It contains the project header, CMS icon, domain row and the entire panel grid including Branding, Web Design, Performance, Hosting and Agency panels.
      </p>

      {/* INTERNAL NAV */}
      <section id="contents">
        <h2 className="text-xl font-semibold mb-3">Contents</h2>

        <ul className="ml-4 list-disc text-sm space-y-2">
          <li><a href="#overview" className="text-blue-600 hover:underline">Overview</a></li>
          <li><a href="#layout" className="text-blue-600 hover:underline">Page layout</a></li>
          <li><a href="#data-flow" className="text-blue-600 hover:underline">Data flow</a></li>

          <li className="font-semibold mt-3">Panels</li>
          <ul className="ml-6 list-disc space-y-1">
            <li><a href="/kb/projects/project-details/branding" className="text-blue-600 hover:underline">Branding Panel</a></li>
            <li><a href="/kb/projects/project-details/web-design" className="text-blue-600 hover:underline">Web Design Panel</a></li>
            <li><a href="/kb/projects/project-details/performances" className="text-blue-600 hover:underline">Performance Panel</a></li>
            <li><a href="/kb/projects/project-details/hosting" className="text-blue-600 hover:underline">Hosting Panel</a></li>
            <li><a href="/kb/projects/project-details/agency" className="text-blue-600 hover:underline">Agency Panel</a></li>
          </ul>

          <li className="mt-3"><a href="#database" className="text-blue-600 hover:underline">Database</a></li>
          <li><a href="#related" className="text-blue-600 hover:underline">Related files</a></li>
          <li><a href="#future" className="text-blue-600 hover:underline">Future expansion</a></li>
        </ul>
      </section>

      {/* OVERVIEW */}
      <section id="overview">
        <h2 className="text-xl font-semibold mb-3">Overview</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The Project Details page is the core control center for each project.  
          It shows the project identity and contains the entire suite of dashboard panels.  
          All dynamic operations such as performance metric trend comparisons and data loading happen here.
        </p>
      </section>

      {/* PAGE LAYOUT */}
      <section id="layout">
        <h2 className="text-xl font-semibold mb-3">Page layout</h2>
        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
ProjectDetailsPage
  PageWrapper
    Project Header
      Name
      Domain
      CMS Icon
    Panels Grid
      BrandingPanel
      WebDesignPanel
      PerformancePanel
      HostingPanel
      AgencyPanel
        </pre>
      </section>

      {/* DATA FLOW */}
      <section id="data-flow">
        <h2 className="text-xl font-semibold mb-3">Data flow</h2>
        <p className="text-sm leading-relaxed max-w-3xl mb-2">
          The data flow for the Project Details page follows a structured pattern.
        </p>
        <ul className="ml-5 list-disc text-sm space-y-1">
          <li>Load project metadata from /api/projects/[id]</li>
          <li>Display project name and CMS</li>
          <li>Load each panel asynchronously</li>
          <li>Each panel hits its own API route</li>
          <li>API routes fetch definitions and values</li>
          <li>Panels render grouped metrics</li>
        </ul>
      </section>

      {/* DATABASE */}
      <section id="database">
        <h2 className="text-xl font-semibold mb-3">Database structure</h2>

        <ul className="ml-5 list-disc text-sm space-y-3">
          <li>
            <strong>projects</strong>  
            Stores the core identity of the project.  
            Includes CMS type, domain, custom settings (JSON), and timestamps.
          </li>

          <li>
            <strong>project_panel_metric_definitions</strong>  
            Master dictionary of all possible metrics.  
            Specifies:
            <ul className="ml-6 list-disc text-xs">
              <li>panel_key</li>
              <li>metric_key</li>
              <li>label</li>
              <li>description</li>
              <li>sort_order</li>
            </ul>
          </li>

          <li>
            <strong>project_panel_metrics</strong>  
            Contains raw values for each metric and each time period.  
            This is the backbone of the Performance Panel.
            <ul className="ml-6 list-disc text-xs">
              <li>project_id</li>
              <li>metric_key</li>
              <li>panel_key</li>
              <li>period_type (daily, weekly, monthly, yearly)</li>
              <li>value</li>
            </ul>
          </li>
        </ul>
      </section>

      {/* RELATED */}
      <section id="related">
        <h2 className="text-xl font-semibold mb-3">Related files</h2>
        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
app/projects/[id]/page.tsx
app/projects/[id]/panels/BrandingPanel.tsx
app/projects/[id]/panels/WebDesignPanel.tsx
app/projects/[id]/panels/PerformancesPanel.tsx
app/projects/[id]/panels/HostingPanel.tsx
app/projects/[id]/panels/AgencyPanel.tsx

API routes:
app/api/projects/[id]/route.ts
app/api/projects/[id]/panels/performance/route.ts
app/api/projects/[id]/panels/web_design/route.ts
app/api/projects/settings/trend/route.ts
        </pre>

        <h3 className="text-lg font-semibold mb-2 mt-4">Related pages</h3>
        <ul className="ml-4 list-disc text-sm space-y-1">
          <li>
            <Link href="/kb/projects/project-listings" className="text-blue-600 hover:underline">
              Project Listings
            </Link>
          </li>
          <li>
            <Link href="/kb/projects/project-details/project-settings" className="text-blue-600 hover:underline">
              Project Settings
            </Link>
          </li>
        </ul>
      </section>

      {/* FUTURE */}
      <section id="future">
        <h2 className="text-xl font-semibold mb-3">Future expansion</h2>
        <ul className="ml-5 list-disc text-sm space-y-1">
          <li>Full CMS sync</li>
          <li>Full performance integrations with real Google APIs</li>
          <li>Historical tracking engine</li>
          <li>Better branding asset management</li>
        </ul>
      </section>

    </div>
  );
}
