"use client";

import PageWrapper from "../components/PageWrapper";
import Link from "next/link";
import { mockProjects, Project } from "./mockProjects";
import CmsIcon from "./modules/CmsIcon";

export default function ProjectsPage() {
  const projects: Project[] = mockProjects;

  return (
    <PageWrapper title="Projects" infoPage="projects">

      <section className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 text-xs bg-slate-900 text-white rounded-full hover:bg-slate-800 transition">
              All
            </button>
            <button className="px-3 py-2 text-xs bg-slate-200 rounded-full hover:bg-slate-300 transition">
              Active
            </button>
            <button className="px-3 py-2 text-xs bg-slate-200 rounded-full hover:bg-slate-300 transition">
              Staging
            </button>
            <button className="px-3 py-2 text-xs bg-slate-200 rounded-full hover:bg-slate-300 transition">
              Development
            </button>
          </div>

          <button className="px-5 py-2 bg-aisteam text-white rounded-full text-xs font-medium hover:bg-aisteam-dark transition">
            Add New Project
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map(project => (
          <div
            key={project.id}
            className="relative bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4"
          >

            <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">
              <CmsIcon cmsType={project.cmsType ?? ""} />
            </div>

            <div className="pr-12">
              <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>

              <p className="text-sm text-slate-600">{project.domain}</p>
              <p className="text-sm text-slate-600">Client {project.client}</p>

              <div className="mt-2">
                <p className="text-sm text-slate-800">Status {project.status}</p>
                <p className="text-xs text-slate-500">Last updated {project.lastUpdate}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/projects/${project.id}`}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-full text-xs hover:bg-slate-300 transition"
              >
                Open Project
              </Link>

              <Link
                href={`/projects/${project.id}/settings`}
                className="px-3 py-2 bg-slate-200 text-xs rounded-full hover:bg-slate-300 transition inline-flex items-center justify-center"
              >
                Settings
              </Link>
            </div>
          </div>
        ))}
      </section>
    </PageWrapper>
  );
}
