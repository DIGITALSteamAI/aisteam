"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";

type AssistantStatus = "idle" | "thinking" | "listening";

type AgentId =
  | "chief"
  | "deliveryLead"
  | "clientSuccess"
  | "creative"
  | "growth"
  | "tech"
  | "webEngineer";

type AssistantMessage = {
  id: string;
  from: "user" | "agent";
  agentId?: AgentId;
  text: string;
  kind?: "text" | "status" | "form";
};

type AssistantPersistentState = {
  messages: AssistantMessage[];
  activeAgent: AgentId;
  currentTask: string | null;
  currentWorkflow: string | null;
  formPayload: any;
};

type AssistantContextData = {
  isOpen: boolean;
  status: AssistantStatus;

  // panel controls
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;

  // voice mode
  isVoiceActive: boolean;
  startVoice: () => Promise<void>;
  stopVoice: () => void;

  // persona control
  activeAgent: AgentId;
  setActiveAgent: (id: AgentId) => void;

  // workflow and task
  currentTask: string | null;
  setCurrentTask: (id: string | null) => void;

  currentWorkflow: string | null;
  setCurrentWorkflow: (id: string | null) => void;

  // form injection
  formPayload: any;
  setFormPayload: (payload: any) => void;

  // shared conversation
  messages: AssistantMessage[];
  addMessage: (message: Omit<AssistantMessage, "id">) => void;
  clearMessages: () => void;
};

const AssistantContext = createContext<AssistantContextData | null>(null);

const STORAGE_KEY = "aisteam_assistant_state_v1";
const CHANNEL_NAME = "aisteam_assistant_state";


export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<AssistantStatus>("idle");

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [activeAgent, setActiveAgent] = useState<AgentId>("chief");

  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [currentWorkflow, setCurrentWorkflow] = useState<string | null>(null);

  const [formPayload, setFormPayload] = useState<any>(null);

  const [messages, setMessages] = useState<AssistantMessage[]>([]);

  const channelRef = useRef<BroadcastChannel | null>(null);

  const [instanceId] = useState(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      // @ts-ignore
      return crypto.randomUUID() as string;
    }
    return String(Math.random());
  });

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const togglePanel = useCallback(() => setIsOpen(prev => !prev), []);

  const stopVoice = useCallback(() => {
    setIsVoiceActive(false);
    setStatus("idle");

    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  }, [mediaStream]);

  const startVoice = useCallback(async () => {
    if (isVoiceActive) {
      stopVoice();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setMediaStream(stream);
      setIsVoiceActive(true);
      setStatus("listening");
      openPanel();
    } catch (err) {
      console.error("Error starting voice mode", err);
      setIsVoiceActive(false);
      setStatus("idle");
    }
  }, [isVoiceActive, openPanel, stopVoice]);

  const addMessage = useCallback(
    (message: Omit<AssistantMessage, "id">) => {
      setMessages(prev => [
        ...prev,
        {
          ...message,
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        },
      ]);
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Restore from localStorage on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AssistantPersistentState = JSON.parse(raw);

        if (Array.isArray(parsed.messages)) {
          setMessages(parsed.messages);
        }

        if (parsed.activeAgent) {
          setActiveAgent(parsed.activeAgent);
        }

        setCurrentTask(parsed.currentTask ?? null);
        setCurrentWorkflow(parsed.currentWorkflow ?? null);
        setFormPayload(parsed.formPayload ?? null);
      }
    } catch (err) {
      console.error("Error restoring assistant state", err);
    }
  }, []);

  // Setup BroadcastChannel for cross window sync
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof BroadcastChannel === "undefined") return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = event => {
      const data = event.data || {};
      if (!data || data.instanceId === instanceId) return;

      if (data.type === "assistant_state") {
        const state = data.payload as AssistantPersistentState;

        setMessages(state.messages || []);
        setActiveAgent(state.activeAgent || "chief");
        setCurrentTask(state.currentTask ?? null);
        setCurrentWorkflow(state.currentWorkflow ?? null);
        setFormPayload(state.formPayload ?? null);
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [instanceId]);

  // Persist to localStorage and broadcast on changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const state: AssistantPersistentState = {
      messages,
      activeAgent,
      currentTask,
      currentWorkflow,
      formPayload,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Error persisting assistant state", err);
    }

    const channel = channelRef.current;
    if (channel) {
      channel.postMessage({
        type: "assistant_state",
        payload: state,
        instanceId,
      });
    }
  }, [messages, activeAgent, currentTask, currentWorkflow, formPayload, instanceId]);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        status,

        openPanel,
        closePanel,
        togglePanel,

        isVoiceActive,
        startVoice,
        stopVoice,

        activeAgent,
        setActiveAgent,

        currentTask,
        setCurrentTask,

        currentWorkflow,
        setCurrentWorkflow,

        formPayload,
        setFormPayload,

        messages,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const value = useContext(AssistantContext);
  if (!value) {
    throw new Error("useAssistant must be used inside AssistantProvider");
  }
  return value;
}
