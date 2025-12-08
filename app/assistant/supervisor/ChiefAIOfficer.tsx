"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useAssistant } from "../AssistantProvider";
import Waveform from "../Waveform";

type AgentId =
  | "chief"
  | "deliveryLead"
  | "clientSuccess"
  | "creative"
  | "growth"
  | "tech"
  | "webEngineer";

type MessageAuthor = "user" | "agent";

type AgentConfig = {
  id: AgentId;
  label: string;
  role: string;
  colorClass: string;
  initials: string;
};

type PanelMessage = {
  id: string;
  from: MessageAuthor;
  agentId?: AgentId;
  text: string;
  kind?: "text" | "status" | "form";
};

type ChiefAIOfficerProps = {
  projectName?: string;
  projectDomain?: string;
};

const AGENTS: Record<AgentId, AgentConfig> = {
  chief: {
    id: "chief",
    label: "Chief AI Officer",
    role: "Supervisor",
    colorClass: "bg-indigo-600",
    initials: "CA"
  },
  deliveryLead: {
    id: "deliveryLead",
    label: "Delivery Lead",
    role: "Project management",
    colorClass: "bg-emerald-600",
    initials: "DL"
  },
  clientSuccess: {
    id: "clientSuccess",
    label: "Client Success Lead",
    role: "Account management",
    colorClass: "bg-amber-600",
    initials: "CS"
  },
  creative: {
    id: "creative",
    label: "Creative Specialist",
    role: "Content and design",
    colorClass: "bg-pink-600",
    initials: "CR"
  },
  growth: {
    id: "growth",
    label: "Growth Specialist",
    role: "SEO and strategy",
    colorClass: "bg-sky-600",
    initials: "GR"
  },
  tech: {
    id: "tech",
    label: "Tech Specialist",
    role: "Systems and tools",
    colorClass: "bg-slate-700",
    initials: "TS"
  },
  webEngineer: {
    id: "webEngineer",
    label: "Web Engineer",
    role: "Build and implementation",
    colorClass: "bg-fuchsia-700",
    initials: "WE"
  }
};

export default function ChiefAIOfficerPanel({
  projectName,
  projectDomain
}: ChiefAIOfficerProps) {

  const {
    isVoiceActive,
    status: assistantStatus,
    activeAgent,
    setActiveAgent,
    messages,
    addMessage,
    clearMessages,
    conversationId,
    closeConversation,
    setCurrentTask,
    setCurrentWorkflow,
    setFormPayload
  } = useAssistant() as any;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const initialisedRef = useRef(false);

  const [panelStatus, setPanelStatus] = useState("ready");
  const [openTaskBuilder, setOpenTaskBuilder] = useState(false);

  const [builderAction, setBuilderAction] = useState("");
  const [builderTarget, setBuilderTarget] = useState("");
  const [builderIntent, setBuilderIntent] = useState("");
  const [builderPriority, setBuilderPriority] = useState("");
  const [builderNotes, setBuilderNotes] = useState("");

  const [input, setInput] = useState("");
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const builderReady =
    builderAction && builderTarget && builderIntent;

  // FIX: Safe typed fallback
  const agentKey: AgentId =
    (activeAgent && AGENTS[activeAgent as AgentId] && activeAgent as AgentId) ||
    "chief";

  const currentAgent = AGENTS[agentKey];

  useEffect(() => {
    if (initialisedRef.current) return;

    if (!messages || messages.length === 0) {
      // Add initial greeting message without saving to DB (conversation not created yet)
      addMessage({
        from: "agent",
        agentId: "chief",
        kind: "text",
        text:
          "Hello, I am your Chief AI Officer for this workspace. Tell me what you want to achieve and I will plan the work with the team."
      }, false); // Don't save to DB yet - conversation will be created on first user message
    }

    initialisedRef.current = true;
  }, [messages, addMessage]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;

    const id = window.setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 20);

    return () => window.clearTimeout(id);
  }, [messages, panelStatus, assistantStatus]);

  const pushMessage = async (
    from: MessageAuthor,
    text: string,
    agentId?: AgentId,
    kind: PanelMessage["kind"] = "text"
  ) => {
    await addMessage({
      from,
      text,
      agentId,
      kind
    }, true); // Save to database
  };

  const handleAIChat = async (userText: string) => {
    setPanelStatus("thinking");

    try {
      // Prepare messages for OpenAI (last 15 messages for better context)
      const recentMessages = messages.slice(-15).map((msg: PanelMessage) => ({
        from: msg.from,
        text: msg.text,
        kind: msg.kind,
      }));

      // Add the current user message
      const messagesForAPI = [
        ...recentMessages,
        { from: "user" as const, text: userText },
      ];

      // Call OpenAI API - Supervisor (chief) will route to appropriate agent
      console.log("Calling OpenAI API with:", {
        messagesCount: messagesForAPI.length,
        agentId: agentKey,
        projectContext: { projectName, projectDomain }
      });

      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesForAPI,
          agentId: agentKey, // Current agent (Supervisor routes if needed)
          projectContext: {
            projectName,
            projectDomain,
          },
        }),
      });

      console.log("API Response status:", response.status, response.statusText);

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `API error: ${response.status}`;
        let errorDetails = "";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
          errorDetails = errorData.details || "";
          console.error("API Error Response:", errorData);
        } catch (parseErr) {
          // If response isn't JSON, use status text
          const text = await response.text();
          console.error("API Error Response (text):", text);
          errorMessage = `API error: ${response.status} ${response.statusText}`;
          if (text) {
            errorDetails = text.substring(0, 200); // First 200 chars
          }
        }
        throw new Error(errorMessage + (errorDetails ? ` - ${errorDetails}` : ""));
      }

      const data = await response.json();
      console.log("API Success Response:", { 
        hasMessage: !!data.message, 
        routedAgent: data.routedAgent,
        messageLength: data.message?.length 
      });

      // Check if the response contains an error
      if (data.error) {
        throw new Error(data.error + (data.details ? `: ${data.details}` : ""));
      }

      // If Supervisor routed to a different agent, optionally switch UI
      if (data.routedAgent && data.routedAgent !== agentKey && agentKey === "chief") {
        // Supervisor routed to another agent - could switch UI here
        // For now, we'll keep the response in the current view
      }

      // Add AI response
      pushMessage(
        "agent",
        data.message || "I'm sorry, I couldn't generate a response.",
        (data.routedAgent as AgentId) || agentKey,
        "text"
      );

      setPanelStatus("ready");
    } catch (err) {
      console.error("Error calling OpenAI:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Log full error details for debugging
      console.error("Full error details:", {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined
      });
      
      // Show more helpful error message
      let userFriendlyMessage = "I'm sorry, I encountered an error. Please try again.";
      if (errorMessage.includes("OPENAI_API_KEY") || errorMessage.includes("API key")) {
        userFriendlyMessage = "OpenAI API key is not configured. Please check your environment variables in Vercel.";
      } else if (errorMessage.includes("API error: 500") || errorMessage.includes("500")) {
        userFriendlyMessage = "The AI service encountered an error. Please check the server logs and try again.";
      } else if (errorMessage.includes("API error: 400") || errorMessage.includes("400")) {
        userFriendlyMessage = "Invalid request. Please check your message and try again.";
      } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        userFriendlyMessage = "Network error. Please check your connection and try again.";
      } else {
        // Show the actual error message for debugging
        userFriendlyMessage = `Error: ${errorMessage}. Please check the browser console for details.`;
      }
      
      pushMessage(
        "agent",
        userFriendlyMessage,
        agentKey,
        "text"
      );
      setPanelStatus("ready");
    }
  };

  const handleParsedTaskFromBuilder = async () => {
    if (!builderReady) return;

    const compiled = `
Action: ${builderAction}
Target: ${builderTarget}
Intent: ${builderIntent}
Priority: ${builderPriority || "medium"}
Notes: ${builderNotes || "None"}
`.trim();

    // Create task in database
    try {
      const priorityMap: Record<string, string> = {
        "Low": "low",
        "Normal": "medium",
        "High": "high",
      };
      const priority = priorityMap[builderPriority] || "medium";

      const response = await fetch("/api/assistant/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId || null,
          action: builderAction,
          target: builderTarget,
          intent: builderIntent,
          priority: priority,
          notes: builderNotes || null,
        }),
      });

      if (response.ok) {
        const { task } = await response.json();
        setCurrentTask(task.id);
        
        // Add a message about the task being created
        await pushMessage(
          "agent",
          `Task created: ${builderAction} ${builderTarget} (${builderIntent})`,
          "chief",
          "text"
        );
      }
    } catch (err) {
      console.error("Error creating task:", err);
      // Continue anyway - task builder still works without DB
    }

    setInput(compiled);
    setOpenTaskBuilder(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (panelStatus === "thinking") return; // Prevent double submission

    const text = input.trim();
    setInput("");
    
    // Add user message
    await pushMessage("user", text);

    // Call OpenAI for all agents
    await handleAIChat(text);
  };

  const toggleBuilder = () => {
    if (isVoiceActive) return;
    setOpenTaskBuilder(prev => !prev);
  };

  const handleConfirmCloseTask = async () => {
    // Close conversation in database
    if (conversationId) {
      await closeConversation();
    } else {
      clearMessages();
    }

    setActiveAgent("chief");
    setCurrentTask(null);
    setCurrentWorkflow(null);
    setFormPayload(null);

    setBuilderAction("");
    setBuilderTarget("");
    setBuilderIntent("");
    setBuilderPriority("");
    setBuilderNotes("");
    setInput("");
    setPanelStatus("ready");

    initialisedRef.current = false;
    setShowCloseConfirm(false);

    if (window.opener) {
      window.opener.postMessage(
        { type: "ASSISTANT_RESET_TASK" },
        window.location.origin
      );
    }
  };

  const handleCancelCloseTask = () => {
    setShowCloseConfirm(false);
  };

  return (
    <div className="w-full h-full max-w-[600px] mx-auto flex flex-col">

      <div className="bg-white rounded-t-xl shadow-sm px-5 pt-5 pb-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold text-white ${currentAgent.colorClass}`}
            >
              {currentAgent.initials}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {currentAgent.label}
              </h2>
              <p className="text-xs text-slate-500">
                {currentAgent.role}
                {projectName ? ` ${projectName}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-5 py-3 shadow-sm border-b border-slate-200 flex-1 min-h-0 flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 pr-1"
        >
          {messages &&
            messages.map((msg: PanelMessage) => {
              if (msg.from === "user") {
                return (
                  <div
                    key={msg.id}
                    className="ml-auto bg-slate-900 text-white px-3 py-2 rounded-lg max-w-[80%]"
                  >
                    {msg.text}
                  </div>
                );
              }

              const agent =
                (msg.agentId && AGENTS[msg.agentId]) ||
                AGENTS["chief"];

              return (
                <div
                  key={msg.id}
                  className="mr-auto max-w-[80%] flex items-start gap-2"
                >
                  <div
                    className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-semibold text-white ${agent.colorClass}`}
                  >
                    {agent.initials}
                  </div>

                  <div className="bg-slate-100 text-slate-900 px-3 py-2 rounded-lg">
                    <div className="text-[10px] text-slate-500 mb-1">
                      {agent.label}
                      {msg.kind === "status" ? " Status" : ""}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

          {isVoiceActive &&
            assistantStatus === "listening" && (
              <div className="flex justify-center py-3">
                <Waveform active />
              </div>
            )}
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm px-5 pb-4 pt-3 space-y-3">

        {!isVoiceActive && agentKey === "chief" && (
          <>
            <button
              type="button"
              onClick={toggleBuilder}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-200 text-xs text-slate-800"
            >
              <span>Task builder</span>
              <span className="text-[10px] text-slate-600">
                {openTaskBuilder ? "Hide" : "Open"}
              </span>
            </button>

            {openTaskBuilder && (
              <div className="mt-2 rounded-md bg-slate-300 p-3 text-xs text-slate-900 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div>
                    <label className="block mb-1">Action</label>
                    <select
                      value={builderAction}
                      onChange={e =>
                        setBuilderAction(e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-400 text-xs"
                    >
                      <option value="">Select</option>
                      <option>Create</option>
                      <option>Update</option>
                      <option>Review</option>
                      <option>Optimize</option>
                      <option>Audit</option>
                      <option>Translate</option>
                      <option>Fix</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Target</label>
                    <select
                      value={builderTarget}
                      onChange={e =>
                        setBuilderTarget(e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-400 text-xs"
                    >
                      <option value="">Select</option>
                      <option>Page</option>
                      <option>Post</option>
                      <option>Product</option>
                      <option>Image</option>
                      <option>SEO metadata</option>
                      <option>Template</option>
                      <option>Menu item</option>
                      <option>Collection entry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Intent</label>
                    <select
                      value={builderIntent}
                      onChange={e =>
                        setBuilderIntent(e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-400 text-xs"
                    >
                      <option value="">Select</option>
                      <option>Content rewrite</option>
                      <option>SEO improvement</option>
                      <option>Bilingual sync</option>
                      <option>Fix layout issues</option>
                      <option>Improve clarity</option>
                      <option>Expand content</option>
                      <option>Simplify content</option>
                      <option>Replace images</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Priority</label>
                    <select
                      value={builderPriority}
                      onChange={e =>
                        setBuilderPriority(e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-400 text-xs"
                    >
                      <option value="">Normal</option>
                      <option>Low</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Notes</label>
                  <textarea
                    value={builderNotes}
                    onChange={e =>
                      setBuilderNotes(e.target.value)
                    }
                    className="w-full px-2 py-1.5 h-16 rounded border border-slate-400 text-xs resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!builderReady}
                    onClick={handleParsedTaskFromBuilder}
                    className={
                      builderReady
                        ? "px-4 py-1.5 bg-slate-900 text-white rounded text-xs hover:bg-slate-800"
                        : "px-4 py-1.5 bg-slate-500 text-slate-300 rounded text-xs cursor-not-allowed"
                    }
                  >
                    Prepare draft in input
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!isVoiceActive && (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <input
              className="flex-1 px-3 py-2 border targets" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe what you want to do"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs hover:bg-slate-800"
            >
              Send
            </button>
          </form>
        )}

        {isVoiceActive && (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="text-xs text-slate-500 text-center">
              Voice mode active. Speak your instructions to the team.
            </div>
            <Waveform active={assistantStatus === "listening"} />
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setShowCloseConfirm(true);
            }}
            className="text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            Close task
          </button>
        </div>
      </div>

      {showCloseConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowCloseConfirm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-sm font-semibold text-slate-900 mb-2">
              Close this task
            </div>

            <div className="text-xs text-slate-600 mb-4 space-y-1">
              <p>
                Are you sure you want to close this task and reset the conversation in this assistant panel?
              </p>
              <p>
                The current discussion will be cleared so you can start a new request.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelCloseTask}
                className="px-3 py-1.5 rounded text-xs border border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmCloseTask}
                className="px-3 py-1.5 rounded text-xs bg-slate-900 text-white hover:bg-slate-800"
              >
                Close task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
