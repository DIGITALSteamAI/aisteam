"use client";

import { useState } from "react";
import { Project } from "../mockProjects";

type Props = {
  mode: "create" | "edit";
  project?: Project;
};

export default function ProjectForm({ mode, project }: Props) {
  const [name, setName] = useState(project?.name ?? "");
  const [type, setType] = useState(project?.type ?? "");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const payload = { name, type };

    if (mode === "create") {
      console.log("Create project", payload);
    } else {
      console.log("Update project", project?.id, payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-semibold">Project name</label>
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Project type</label>
        <input
          value={type}
          onChange={event => setType(event.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300 transition"
      >
        {mode === "create" ? "Create project" : "Save changes"}
      </button>

    </form>
  );
}
