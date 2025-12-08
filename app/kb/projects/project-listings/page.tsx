"use client";

export default function KBProjectListingsPage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-800 space-y-10">

      <h1 className="text-3xl font-bold mb-4">
        Project Listings Documentation
      </h1>

      <p className="text-sm leading-relaxed max-w-3xl">
        This document describes the full structure and behaviour of the Project Listings 
        page in AISTEAM. It is aligned with the live database and the current backend API.
        Use this page as a reference when working on the listing, filtering, loading or 
        rendering of project records.
      </p>

      {/* TABLE OF CONTENTS */}
      <section id="contents">
        <h2 className="text-xl font-semibold mb-3">Contents</h2>

        <ul className="ml-4 list-disc text-sm space-y-2">
          <li><a href="#overview" className="text-blue-600 hover:underline">Overview</a></li>
          <li><a href="#layout" className="text-blue-600 hover:underline">Page layout</a></li>
          <li><a href="#data-flow" className="text-blue-600 hover:underline">Data flow</a></li>
          <li><a href="#database" className="text-blue-600 hover:underline">Database structure</a></li>
          <li><a href="#api" className="text-blue-600 hover:underline">API endpoint</a></li>
          <li><a href="#related" className="text-blue-600 hover:underline">Related files</a></li>
          <li><a href="#future" className="text-blue-600 hover:underline">Future enhancements</a></li>
        </ul>
      </section>

      {/* OVERVIEW */}
      <section id="overview">
        <h2 className="text-xl font-semibold mb-3">Overview</h2>

        <p className="text-sm leading-relaxed max-w-3xl">
          The Project Listings page displays all projects associated with the active tenant.  
          It loads a curated list from the backend that includes each project's name, CMS type, 
          CMS icon and creation timestamp. Clicking a project sends the user to the full 
          Project Dashboard for that project.
        </p>
      </section>

      {/* PAGE LAYOUT */}
      <section id="layout">
        <h2 className="text-xl font-semibold mb-3">Page layout</h2>

        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
ProjectListingsPage
  PageWrapper
    Header
      Page title
    ProjectList
      For each project
        Name
        CMS text
        CMS icon (from public folder)
        Created timestamp
        Link to /projects/[id]
        </pre>
      </section>

      {/* DATA FLOW */}
      <section id="data-flow">
        <h2 className="text-xl font-semibold mb-3">Data flow</h2>

        <ul className="ml-5 list-disc text-sm space-y-1">
          <li>User opens the Project Listings page</li>
          <li>The frontend sends a GET request to /api/projects</li>
          <li>The backend loads all projects filtered by tenant_id</li>
          <li>The backend enriches each project with cms_icon</li>
          <li>The frontend renders each project row inside the page</li>
        </ul>
      </section>

      {/* DATABASE STRUCTURE */}
      <section id="database">
        <h2 className="text-xl font-semibold mb-3">Database structure</h2>

        <ul className="ml-5 list-disc text-sm space-y-3">

          <li>
            <strong>projects</strong><br />
            Core table for all projects in AISTEAM.  
            Confirmed active fields:
            <ul className="ml-6 list-disc text-xs space-y-1">
              <li>id</li>
              <li>tenant_id</li>
              <li>name</li>
              <li>cms</li>
              <li>created_at</li>
            </ul>

            <p className="text-xs mt-1">
              These fields are confirmed through live API queries and Supabase errors.  
              Fields such as domain, cms_url, status and custom_data will arrive in a later migration.
            </p>
          </li>

          <li>
            <strong>tenants</strong><br />
            Provides tenant ownership.  
            All project queries filter by tenant_id.
          </li>

        </ul>
      </section>

      {/* API ENDPOINT */}
      <section id="api">
        <h2 className="text-xl font-semibold mb-3">API endpoint</h2>

        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
{`GET /api/projects

Returns JSON shaped like:

{
  "projects": [
    {
      "id": "uuid",
      "name": "Project name",
      "tenant_id": "uuid",
      "cms": "WordPress",
      "created_at": "timestamp",
      "cms_icon": "/icon-wordpress.png"
    }
  ]
}

Backend logic:
  1. Query Supabase for projects with matching tenant_id
  2. Map CMS value to correct icon path in public
  3. Return enriched project list to the frontend
`}
        </pre>
      </section>

      {/* RELATED FILES */}
      <section id="related">
        <h2 className="text-xl font-semibold mb-3">Related files</h2>

        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
app/projects/page.tsx
app/projects/modules/CmsIcon.tsx

API routes:
app/api/projects/route.ts
        </pre>
      </section>

      {/* FUTURE ENHANCEMENTS */}
      <section id="future">
        <h2 className="text-xl font-semibold mb-3">Future enhancements</h2>

        <ul className="ml-5 list-disc text-sm space-y-1">
          <li>Add domain field to projects table and UI</li>
          <li>Add cms_url field</li>
          <li>Add project status values such as active or archived</li>
          <li>Add filters and sorting</li>
          <li>Add project logo or thumbnail support</li>
          <li>Add project search bar</li>
          <li>Add tenant switching toolbar</li>
        </ul>
      </section>

    </div>
  );
}
