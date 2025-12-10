"use client";

import ProjectSettingsContainer from "../../projects/[id]/settings/ProjectSettingsContainer";

interface ProjectSettingsModalProps {
  projectId: string;
  onClose: () => void;
}

export default function ProjectSettingsModal({
  projectId,
  onClose
}: ProjectSettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 m-4">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Project Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <ProjectSettingsContainer projectId={projectId} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

