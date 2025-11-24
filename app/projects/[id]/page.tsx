"use client";

import { useParams } from "next/navigation";
import PageWrapper from "../../components/PageWrapper";
import { mockProjects, Project } from "../mockProjects";
import CmsIcon from "../modules/CmsIcon";
import WebEngineer from "../../assistant/workers/WebEngineer";

export default function ProjectDashboardPage() {
  const params = useParams();
  const id = params?.id as string;

  const project: Project | null =
    mockProjects.find(p => p.id === id) ?? null;

  if (!project) {
    return (
      <PageWrapper title="Project not found">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">
            Project not found
          </h1>
          <p className="text-sm text-slate-600">
            This project does not exist.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={project.name}>
      {/* Header */}
      <section className="relative bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              {project.name}
            </h1>
            <p className="text-slate-600 text-sm">
              {project.domain}
            </p>
          </div>

          <div className="bg-white rounded-full shadow w-12 h-12 flex items-center justify-center">
            <CmsIcon cmsType={project.cmsType} />
          </div>
        </div>
      </section>

      {/* Web Engineer worker panel */}
      <section>
        <WebEngineer
          projectName={project.name}
          projectDomain={project.domain}
        />
      </section>
    </PageWrapper>
  );
}
