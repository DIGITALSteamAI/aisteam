"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";
import CmsIcon from "./modules/CmsIcon";
import ProjectSettingsModal from "../components/projects/ProjectSettingsModal";

type ViewMode = "cards" | "list";
type FilterMode = "all" | "active" | "staging" | "development";
type SortMode = "name" | "status" | "updated" | "cms";

type Project = {
  id: string;
  name: string;
  domain?: string;
  client?: string;
  status?: string;
  cms?: string;
  cmsType?: string;
  cms_icon?: string;
  lastUpdate?: string;
};

export default function ProjectsPage() {
  const [view, setView] = useState<ViewMode>("cards");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sortBy, setSortBy] = useState<SortMode>("name");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsProjectId, setSettingsProjectId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      console.log("Loading projects from API");
      console.log("FETCHING", window.location.origin + "/api/projects");

      try {
        const res = await fetch("/api/projects", { cache: "no-store" });


        if (!res.ok) {
          console.log("API error status", res.status);
          return;
        }

        const json = await res.json();
        console.log("Projects from API", json);

        setProjects(json.projects ?? []);
      } catch (err) {
        console.log("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const visibleProjects = useMemo(() => {
    let list = [...projects];

    if (filter !== "all") {
      list = list.filter(p => (p.status ?? "").toLowerCase() === filter);
    }

    list.sort((a, b) => {
      const safe = (v: any) => (v ?? "").toString().toLowerCase();

      if (sortBy === "name") return safe(a.name).localeCompare(safe(b.name));
      if (sortBy === "status") return safe(a.status).localeCompare(safe(b.status));
      if (sortBy === "cms") return safe(a.cms || a.cmsType).localeCompare(safe(b.cms || b.cmsType));
      return safe(a.lastUpdate).localeCompare(safe(b.lastUpdate));
    });

    return list;
  }, [projects, filter, sortBy]);

  const isCards = view === "cards";

  if (loading) {
    return (
      <PageWrapper title="Projects" infoPage="projects">
        <div className="p-6 text-center text-slate-500">Loading projects</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Projects" infoPage="projects">
      {/* DEBUG: High priority overlay to detect blocking elements */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 999999,
          border: "4px dashed yellow"
        }}
      >
        DEBUG OVERLAY ACTIVE
      </div>

      {/* DEBUG: Root container wrapper */}
      <div
        style={{
          border: "2px solid red",
          pointerEvents: "auto"
        }}
        onClick={() => console.log("Root container received a click")}
      >
        <ProjectToolbar
          view={view}
          setView={setView}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {isCards ? (
          <CardsView projects={visibleProjects} onSettingsClick={setSettingsProjectId} />
        ) : (
          <ListView projects={visibleProjects} onSettingsClick={setSettingsProjectId} />
        )}

        {settingsProjectId && (
          <ProjectSettingsModal
            key={settingsProjectId}
            projectId={settingsProjectId}
            onClose={() => setSettingsProjectId(null)}
          />
        )}
      </div>
    </PageWrapper>
  );
}

function ProjectToolbar({ view, setView, filter, setFilter, sortBy, setSortBy }: any) {
  const isCards = view === "cards";

  return (
    <section className="w-full bg-slate-50 border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-end gap-3">

        <div className="flex items-center px-2 py-1 bg-white border rounded">
          <select
            className="bg-transparent text-sm outline-none text-slate-700 cursor-pointer"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All projects</option>
            <option value="active">Active</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
          </select>
        </div>

        <div className="flex items-center px-2 py-1 bg-white border rounded">
          <select
            className="bg-transparent text-sm outline-none text-slate-700 cursor-pointer"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="updated">Last updated</option>
            <option value="cms">CMS type</option>
          </select>
        </div>

        <div className="flex items-center bg-white border rounded overflow-hidden">
          <button
            onClick={() => setView("cards")}
            className={`px 3 py 2 ${isCards ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Cards
          </button>

          <button
            onClick={() => setView("list")}
            className={`px 3 py 2 border-l ${!isCards ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            List
          </button>
        </div>

      </div>
    </section>
  );
}

function CardsView({ 
  projects, 
  onSettingsClick 
}: { 
  projects: Project[]; 
  onSettingsClick: (projectId: string) => void;
}) {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      style={{ border: "2px solid blue", position: "relative", zIndex: 10 }}
      onClick={() => console.log("CardsView wrapper clicked")}
    >

      {projects.map(project => (
        <div key={project.id} className="relative bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">

          <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">
            <CmsIcon
              cmsType={project.cms || project.cmsType}
              srcOverride={project.cms_icon}
            />
          </div>

          <div className="pr-12">
            <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
            {project.domain && <p className="text-sm text-slate-600">{project.domain}</p>}
            {project.client && <p className="text-sm text-slate-600">Client {project.client}</p>}
            {project.status && <p className="text-sm text-slate-800 mt-2">Status {project.status}</p>}
            {project.lastUpdate && <p className="text-xs text-slate-500">Last updated {project.lastUpdate}</p>}
          </div>

          <div className="flex gap-2">
            <Link href={`/projects/${project.id}`}>
              <span className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-full text-xs hover:bg-slate-300 transition inline-block">
                Open project
              </span>
            </Link>

            <button
              onClick={() => onSettingsClick(project.id)}
              className="px-3 py-1.5 bg-slate-200 text-xs rounded-full hover:bg-slate-300"
            >
              Settings
            </button>
          </div>

        </div>
      ))}

    </section>
  );
}

function ListView({ 
  projects, 
  onSettingsClick 
}: { 
  projects: Project[]; 
  onSettingsClick: (projectId: string) => void;
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">

        <table className="min-w-full text-sm">
          <tbody>

            {projects.map(project => (
              <tr key={project.id} className="hover:bg-slate-50">

                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                      <CmsIcon cmsType={project.cms || project.cmsType} srcOverride={project.cms_icon} />
                    </div>
                    <span className="text-slate-900 font-medium">{project.name}</span>
                  </div>
                </td>

                <td className="px-4 py-2">{project.domain ?? ""}</td>
                <td className="px-4 py-2">{project.client ?? ""}</td>
                <td className="px-4 py-2">{project.status ?? ""}</td>
                <td className="px-4 py-2">{(project.cms || project.cmsType) ?? ""}</td>
                <td className="px-4 py-2">{project.lastUpdate ?? ""}</td>

                <td className="px-4 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <Link href={`/projects/${project.id}`}>
                      <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition inline-block">
                        Open
                      </span>
                    </Link>
                    <button
                      onClick={() => onSettingsClick(project.id)}
                      className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      Settings
                    </button>
                  </div>
                </td>

              </tr>
            ))}

          </tbody>
        </table>

      </div>
    </section>
  );
}
