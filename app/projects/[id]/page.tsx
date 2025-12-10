"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import PageWrapper from "../../components/PageWrapper";
import CmsIcon from "../modules/CmsIcon";

/* IMPORT PANELS */
import BrandingPanel from "./panels/BrandingPanel";
import WebDesignPanel from "./panels/WebDesignPanel";
import PerformancesPanel from "./panels/PerformancesPanel";
import HostingPanel from "./panels/HostingPanel";
import AgencyPanel from "./panels/AgencyPanel";

/* BASE PANEL CARD WRAPPER (used only for simple panels) */

function PanelCard({
  title,
  icon,
  rows
}: {
  title: string;
  icon: React.ReactNode;
  rows: string[];
}) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {rows.map(r => (
          <button
            key={r}
            className="w-full text-left py-2.5 px-2 flex items-center justify-between hover:bg-slate-50"
          >
            <span className="text-sm text-slate-700">{r}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ICONS */

function BrandingIcon() {
  return (
    <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 16.5 12 8l4 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HostingIcon() {
  return (
    <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24">
      <rect
        x="4"
        y="4"
        width="16"
        height="6"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="4"
        y="10"
        width="16"
        height="6"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="4"
        y="16"
        width="16"
        height="4"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="8" cy="7" r="0.8" fill="currentColor" />
      <circle cx="8" cy="13" r="0.8" fill="currentColor" />
    </svg>
  );
}

function AgencyIcon() {
  return (
    <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24">
      <circle
        cx="8"
        cy="9"
        r="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="16"
        cy="9"
        r="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4.5 17a3.8 3.8 0 0 1 7 0m2 0a3.8 3.8 0 0 1 7 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* MAIN PAGE */

export default function ProjectDashboardPage() {
  const params = useParams();
  console.log("Project Details params:", params);
  const id = params?.id as string | undefined;
  console.log("Project Details id:", id);

  if (!id) return null;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const loadedIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("Project Details useEffect triggered with id:", id);
    
    // Reset state when ID changes
    if (id !== loadedIdRef.current) {
      setProject(null);
      setLoading(true);
      loadedIdRef.current = null;
    }

    // Prevent multiple loads for the same ID
    if (loadedIdRef.current === id) {
      return;
    }

    let isMounted = true;
    loadedIdRef.current = id;

    async function loadProject() {
      try {
        const fetchUrl = `/api/projects/${id}`;
        console.log("Fetching project from:", fetchUrl);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const res = await fetch(fetchUrl, {
          signal: controller.signal,
          cache: "no-store"
        });
        
        clearTimeout(timeoutId);
        
        console.log("Fetch response status:", res.status);
        
        if (!isMounted) return;
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Project fetch failed:", res.status, errorData);
          if (isMounted) {
            setProject(null);
            setLoading(false);
          }
          return;
        }
        
        const json = (await res.json()) as any;
        console.log("Project data received:", json);
        
        if (!isMounted) return;
        
        if (json.data) {
          setProject(json.data);
        } else {
          console.error("Project data missing from response:", json);
          setProject(null);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Project fetch error:", err);
        if (err.name === 'AbortError') {
          console.error("Request timed out after 10 seconds");
        }
        setProject(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PageWrapper title="Loading project">
        <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
          Loading...
        </div>
      </PageWrapper>
    );
  }

  if (!project) {
    return (
      <PageWrapper title="Project not found">
        <div className="bg-white border rounded-xl p-8">
          <h1 className="text-2xl font-semibold mb-2">Project not found</h1>
          <p className="text-sm text-slate-600">
            This project does not exist.
          </p>
        </div>
      </PageWrapper>
    );
  }

  const domain = project?.cms_url || project?.domain || "(no domain)";
  const cmsType = project?.cms || project?.cmsType || "";
  const projectName = project?.name || "Unknown Project";
  const projectId = project?.id || id || "";

  if (!projectId) {
    return (
      <PageWrapper title="Error">
        <div className="bg-white border rounded-xl p-8">
          <h1 className="text-2xl font-semibold mb-2">Invalid Project</h1>
          <p className="text-sm text-slate-600">
            Project ID is missing or invalid.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={projectName}>
      <section className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {projectName}
            </h1>
            <p className="text-sm text-slate-600">{domain}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/projects/${projectId}/settings`}
              className="px-3 py-1.5 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Settings
            </Link>
            <div className="w-12 h-12 border rounded-full flex items-center justify-center bg-white">
              <CmsIcon cmsType={cmsType} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Branding */}
        <BrandingPanel />

        {/* Web Design */}
        {projectId && <WebDesignPanel projectId={projectId} />}

        {/* Performances */}
        {projectId && <PerformancesPanel projectId={projectId} />}

        {/* Hosting */}
        <HostingPanel />

        {/* Agency */}
        <div className="md:col-span-2">
          <AgencyPanel />
        </div>

      </section>
    </PageWrapper>
  );
}
