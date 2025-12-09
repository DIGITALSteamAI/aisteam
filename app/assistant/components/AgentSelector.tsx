"use client";

import { useAssistant } from "../AssistantProvider";

type AgentId =
  | "chief"
  | "deliveryLead"
  | "clientSuccess"
  | "creativeLead"
  | "growthLead"
  | "technicalLead"
  | "webEngineer";

type AgentConfig = {
  id: AgentId;
  label: string;
  role: string;
  colorClass: string;
  initials: string;
  layer: "supervisor" | "lead" | "execution" | "utility";
};

const AGENTS: Record<AgentId, AgentConfig> = {
  chief: {
    id: "chief",
    label: "Chief AI Officer",
    role: "Supervisor",
    colorClass: "bg-indigo-600",
    initials: "CA",
    layer: "supervisor"
  },
  deliveryLead: {
    id: "deliveryLead",
    label: "Delivery Lead",
    role: "Project management",
    colorClass: "bg-emerald-600",
    initials: "DL",
    layer: "lead"
  },
  clientSuccess: {
    id: "clientSuccess",
    label: "Client Success Lead",
    role: "Account management",
    colorClass: "bg-amber-600",
    initials: "CS",
    layer: "lead"
  },
  creativeLead: {
    id: "creativeLead",
    label: "Creative Lead",
    role: "Brand voice and visual identity",
    colorClass: "bg-pink-600",
    initials: "CL",
    layer: "lead"
  },
  growthLead: {
    id: "growthLead",
    label: "Growth Lead",
    role: "Traffic, leads, and revenue",
    colorClass: "bg-sky-600",
    initials: "GL",
    layer: "lead"
  },
  technicalLead: {
    id: "technicalLead",
    label: "Technical Lead",
    role: "Architecture and integrations",
    colorClass: "bg-slate-700",
    initials: "TL",
    layer: "lead"
  },
  webEngineer: {
    id: "webEngineer",
    label: "Web Engineer",
    role: "Web and CMS execution",
    colorClass: "bg-fuchsia-700",
    initials: "WE",
    layer: "execution"
  }
};

export default function AgentSelector() {
  const { activeAgent, setActiveAgent } = useAssistant();

  const supervisorAgents = Object.values(AGENTS).filter(a => a.layer === "supervisor");
  const leadAgents = Object.values(AGENTS).filter(a => a.layer === "lead");
  const executionAgents = Object.values(AGENTS).filter(a => a.layer === "execution");

  return (
    <div className="border-r border-slate-200 bg-slate-50 w-48 flex flex-col">
      <div className="p-3 border-b border-slate-200">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          Select Agent
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Supervisor Layer */}
        {supervisorAgents.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
              Supervisor
            </div>
            {supervisorAgents.map(agent => (
              <AgentButton
                key={agent.id}
                agent={agent}
                isActive={activeAgent === agent.id}
                onClick={() => setActiveAgent(agent.id)}
              />
            ))}
          </div>
        )}

        {/* Lead Layer */}
        {leadAgents.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
              Leads
            </div>
            {leadAgents.map(agent => (
              <AgentButton
                key={agent.id}
                agent={agent}
                isActive={activeAgent === agent.id}
                onClick={() => setActiveAgent(agent.id)}
              />
            ))}
          </div>
        )}

        {/* Execution Layer */}
        {executionAgents.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
              Execution
            </div>
            {executionAgents.map(agent => (
              <AgentButton
                key={agent.id}
                agent={agent}
                isActive={activeAgent === agent.id}
                onClick={() => setActiveAgent(agent.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentButton({
  agent,
  isActive,
  onClick
}: {
  agent: AgentConfig;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 px-2 py-2 rounded-md text-left
        transition-colors
        ${isActive 
          ? "bg-white shadow-sm border border-slate-200" 
          : "hover:bg-slate-100"
        }
      `}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold text-white ${agent.colorClass}`}
      >
        {agent.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold ${isActive ? "text-slate-900" : "text-slate-700"}`}>
          {agent.label}
        </div>
        <div className="text-[10px] text-slate-500 truncate">
          {agent.role}
        </div>
      </div>
    </button>
  );
}

