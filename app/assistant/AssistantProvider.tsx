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
  conversationId: string | null;
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

  // conversation management
  conversationId: string | null;
  startConversation: () => Promise<void>;
  closeConversation: () => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;

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
  addMessage: (message: Omit<AssistantMessage, "id">, saveToDb?: boolean) => Promise<void>;
  clearMessages: () => void;
};

const AssistantContext = createContext<AssistantContextData | null>(null);

const STORAGE_KEY = "aisteam_assistant_state_v2";
const CHANNEL_NAME = "aisteam_assistant_state";

// Default tenant/user IDs - in production, get from auth context
const DEFAULT_TENANT_ID = "56d1b96b-3e49-48c0-a6de-bab91b8f1864";
const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<AssistantStatus>("idle");

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [activeAgent, setActiveAgent] = useState<AgentId>("chief");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [currentWorkflow, setCurrentWorkflow] = useState<string | null>(null);

  const [formPayload, setFormPayload] = useState<any>(null);

  const [messages, setMessages] = useState<AssistantMessage[]>([]);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const saveMessageTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

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
    async (message: Omit<AssistantMessage, "id">, saveToDb = true) => {
      const messageId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const newMessage: AssistantMessage = {
        ...message,
        id: messageId,
      };

      setMessages(prev => [...prev, newMessage]);

      // Save to database if conversation exists and saveToDb is true
      if (saveToDb && conversationId && message.kind !== "status") {
        // Debounce database saves to avoid too many API calls
        const existingTimeout = saveMessageTimeoutRef.current.get(messageId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        const timeout = setTimeout(async () => {
          try {
            const response = await fetch("/api/assistant/messages/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                conversationId,
                author: message.from,
                agentId: message.agentId || null,
                kind: message.kind || "text",
                text: message.text,
              }),
            });
            
            if (!response.ok) {
              console.warn("Failed to save message to database, continuing with local storage");
            }
          } catch (err) {
            console.error("Error saving message to database:", err);
            // Continue without failing - local storage backup exists
          } finally {
            saveMessageTimeoutRef.current.delete(messageId);
          }
        }, 500); // 500ms debounce

        saveMessageTimeoutRef.current.set(messageId, timeout);
      }
    },
    [conversationId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    // Clear any pending message saves
    saveMessageTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    saveMessageTimeoutRef.current.clear();
  }, []);

  const startConversation = useCallback(async () => {
    try {
      const response = await fetch("/api/assistant/conversations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: DEFAULT_TENANT_ID,
          userId: DEFAULT_USER_ID,
          currentAgent: activeAgent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const { conversation } = await response.json();
      setConversationId(conversation.id);

      // Update conversation with current agent
      if (conversation.current_agent !== activeAgent) {
        await fetch("/api/assistant/conversations/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversation.id,
            currentAgent: activeAgent,
          }),
        });
      }

      return conversation.id;
    } catch (err) {
      console.error("Error starting conversation:", err);
      // Continue without database - local storage backup exists
      return null;
    }
  }, [activeAgent]);

  const closeConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      await fetch("/api/assistant/conversations/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          tenantId: DEFAULT_TENANT_ID,
          userId: DEFAULT_USER_ID,
        }),
      });
    } catch (err) {
      console.error("Error closing conversation:", err);
    } finally {
      setConversationId(null);
      clearMessages();
    }
  }, [conversationId, clearMessages]);

  const loadConversation = useCallback(async (convId: string) => {
    try {
      // Load conversation
      const convResponse = await fetch(
        `/api/assistant/conversations/get?id=${convId}&tenantId=${DEFAULT_TENANT_ID}&userId=${DEFAULT_USER_ID}`
      );
      if (!convResponse.ok) throw new Error("Failed to load conversation");
      const { conversation } = await convResponse.json();

      // Load messages
      const messagesResponse = await fetch(
        `/api/assistant/messages/get?conversationId=${convId}`
      );
      if (!messagesResponse.ok) throw new Error("Failed to load messages");
      const { messages: dbMessages } = await messagesResponse.json();

      // Type for database message format
      type DbMessage = {
        id: string;
        author: string;
        agent_id: string | null;
        text: string;
        kind: string | null;
      };

      // Convert database messages to local format
      const localMessages: AssistantMessage[] = (dbMessages as DbMessage[]).map((msg) => ({
        id: msg.id,
        from: msg.author as "user" | "agent",
        agentId: msg.agent_id as AgentId | undefined,
        text: msg.text,
        kind: msg.kind as "text" | "status" | "form" | undefined,
      }));

      setConversationId(convId);
      setMessages(localMessages);
      setActiveAgent((conversation.current_agent as AgentId) || "chief");
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  }, []);

  // Restore from localStorage on first mount and try to load active conversation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreState = async () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: AssistantPersistentState = JSON.parse(raw);

          // If we have a conversation ID, try to load it from database
          if (parsed.conversationId) {
            try {
              await loadConversation(parsed.conversationId);
              return; // Successfully loaded from DB, skip local storage restore
            } catch (err) {
              console.warn("Could not load conversation from DB, using local storage:", err);
              // Fall through to local storage restore
            }
          }

          // Fallback to local storage
          if (Array.isArray(parsed.messages)) {
            setMessages(parsed.messages);
          }

          if (parsed.activeAgent) {
            setActiveAgent(parsed.activeAgent);
          }

          setCurrentTask(parsed.currentTask ?? null);
          setCurrentWorkflow(parsed.currentWorkflow ?? null);
          setFormPayload(parsed.formPayload ?? null);
          setConversationId(parsed.conversationId ?? null);
        }
      } catch (err) {
        console.error("Error restoring assistant state", err);
      }
    };

    restoreState();
  }, [loadConversation]);

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
        setConversationId(state.conversationId ?? null);
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
      conversationId,
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
  }, [messages, activeAgent, currentTask, currentWorkflow, formPayload, conversationId, instanceId]);

  // Auto-create conversation when first message is added
  useEffect(() => {
    if (!conversationId && messages.length > 0) {
      startConversation();
    }
  }, [conversationId, messages.length, startConversation]);

  // Update conversation agent when activeAgent changes
  useEffect(() => {
    if (conversationId && activeAgent) {
      fetch("/api/assistant/conversations/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          currentAgent: activeAgent,
        }),
      }).catch(err => {
        console.error("Error updating conversation agent:", err);
      });
    }
  }, [conversationId, activeAgent]);

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

        conversationId,
        startConversation,
        closeConversation,
        loadConversation,

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
