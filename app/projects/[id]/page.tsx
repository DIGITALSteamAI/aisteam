"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const id = params?.id as string | undefined;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const json = (await res.json()) as any;
        setProject(json.data ?? null);
      } catch (err) {
        console.error("Project fetch failed", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
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

  const domain = project.cms_url || project.domain || "(no domain)";
  const cmsType = project.cms || project.cmsType || "";

  return (
    <PageWrapper title={project.name}>
      <section className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {project.name}
            </h1>
            <p className="text-sm text-slate-600">{domain}</p>
          </div>

          <div className="w-12 h-12 border rounded-full flex items-center justify-center bg-white">
            <CmsIcon cmsType={cmsType} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Branding */}
        <BrandingPanel />

        {/* Web Design */}
        <WebDesignPanel projectId={project.id} />

        {/* Performances */}
        <PerformancesPanel projectId={project.id} />

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
