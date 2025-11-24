"use client";

import { useParams } from "next/navigation";
import { mockProjects } from "../../mockProjects";
import ProjectForm from "../../modules/ProjectForm";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const project = mockProjects.find(item => item.id === id);

  if (!project) {
    return (
      <div className="p-6">
        <h1>Project not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Project Settings</h1>
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
