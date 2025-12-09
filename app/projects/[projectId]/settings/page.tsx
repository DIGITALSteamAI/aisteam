"use client";

import { useParams } from "next/navigation";
import PageWrapper from "../../../components/PageWrapper";
import ProjectSettingsContainer from "./ProjectSettingsContainer";

export default function ProjectSettingsPage() {
  const params = useParams();
  const projectId = (params?.projectId || params?.id) as string;

  if (!projectId) {
    return (
      <PageWrapper title="Project Settings">
        <div className="bg-white border rounded-xl p-8">
          <p className="text-slate-600">Project ID is required</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Project Settings" infoPage="projects">
      <div className="max-w-4xl">
        <ProjectSettingsContainer projectId={projectId} />
      </div>
    </PageWrapper>
  );
}

