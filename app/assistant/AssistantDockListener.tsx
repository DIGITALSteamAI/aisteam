"use client";

import { useEffect } from "react";
import { useAssistant } from "./AssistantProvider";

type Props = {
  children: React.ReactNode;
};

export default function AssistantDockListener({ children }: Props) {
  const {
    openPanel,
    clearMessages,
    setActiveAgent,
    setCurrentTask,
    setCurrentWorkflow,
    setFormPayload
  } = useAssistant();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      // Popout window wants to dock back in
      if (event.data?.type === "ASSISTANT_DOCK_BACK") {
        openPanel();
      }

      // Popout window has closed a task and wants the docked panel to reset too
      if (event.data?.type === "ASSISTANT_RESET_TASK") {
        clearMessages();
        setActiveAgent("chief");
        setCurrentTask(null);
        setCurrentWorkflow(null);
        setFormPayload(null);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    openPanel,
    clearMessages,
    setActiveAgent,
    setCurrentTask,
    setCurrentWorkflow,
    setFormPayload
  ]);

  return <>{children}</>;
}
