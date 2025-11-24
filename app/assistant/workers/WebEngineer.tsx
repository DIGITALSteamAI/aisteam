"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useAssistant } from "../AssistantProvider";
import { Boxes, ChevronDown, ChevronUp } from "lucide-react";

type AgentMessage = {
  id: number;
  from: "user" | "assistant";
  text: string;
};

type WebEngineerProps = {
  projectName: string;
  projectDomain: string;
};

export default function WebEngineer({
  projectName,
  projectDomain
}: WebEngineerProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage: supervisorSend } = useAssistant();

  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: Date.now(),
      from: "assistant",
      text: `Hi, I am your Web Engineer for ${projectName}. Tell me what you need and I will help shape it into a clear task.`
    }
  ]);

  const [status, setStatus] = useState<"ready" | "thinking" | "listening">(
    "ready"
  );
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const [openTaskBuilder, setOpenTaskBuilder] = useState(false);

  const [action, setAction] = useState("");
  const [target, setTarget] = useState("");
  const [intent, setIntent] = useState("");
  const [notes, setNotes] = useState("");

  const [input, setInput] = useState("");

  const builderReady = action && target && intent;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const pushMessage = (from: "user" | "assistant", text: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.floor(Math.random() * 1000), from, text }
    ]);
  };

  const handleWorkerMessage = async (text: string) => {
    pushMessage("user", text);
    setStatus("thinking");

    try {
      supervisorSend?.(
        `Web Engineer worker received a task for project ${projectName} (${projectDomain}). Message content: ${text}`
      );
    } catch {}

    await new Promise(resolve => setTimeout(resolve, 500));

    pushMessage(
      "assistant",
      `Understood. Here is how I interpret your request. ${text}`
    );

    setStatus("ready");
  };

  const handleBuilderParse = () => {
    if (!builderReady) return;

    const compiled = `
Project ${projectName} (${projectDomain})
Action ${action}
Target ${target}
Intent ${intent}
Notes ${notes}
`.trim();

    setInput(compiled);
    setOpenTaskBuilder(false);
  };

  const handleFreeTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleWorkerMessage(input.trim());
    setInput("");
  };

  const toggleBuilder = () => {
    if (isVoiceMode) return;
    setOpenTaskBuilder(prev => !prev);
  };

  const toggleInputMode = () => {
    const next = !isVoiceMode;
    setIsVoiceMode(next);

    if (next) {
      setOpenTaskBuilder(false);
      setStatus("listening");
    } else {
      setStatus("ready");
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">

      {/* HEADER */}
      <div className="bg-white rounded-t-xl shadow-sm px-5 pt-5 pb-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Web Engineer
            </h2>
            <p className="text-xs text-slate-500">
              Project {projectName}
            </p>
          </div>

          {/* Switch instead of button */}
          <div className="flex items-center gap-2">

            <span className="text-xs text-slate-500">
              {isVoiceMode ? "Voice" : "Typing"}
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isVoiceMode}
                onChange={toggleInputMode}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-300 peer-focus:ring-2 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
              <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>
      </div>

      {/* CHAT ZONE */}
      <div className="bg-white px-5 py-3 shadow-sm border-b border-slate-200">
        <div
          ref={scrollRef}
          className="flex-1 max-h-[360px] overflow-y-auto space-y-3 pr-1"
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              className={
                msg.from === "user"
                  ? "ml-auto bg-slate-900 text-white px-3 py-2 rounded-lg max-w-[80%]"
                  : "mr-auto bg-slate-100 text-slate-900 px-3 py-2 rounded-lg max-w-[80%]"
              }
            >
              {msg.text}
            </div>
          ))}

          {isVoiceMode && status === "listening" && (
            <div className="flex justify-center py-3">
              <div className="flex items-end gap-1 h-10">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-blue-500 animate-wave"
                    style={{
                      animationDelay: `${i * 0.12}s`,
                      height: 18 + Math.sin(i) * 12
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BUILDER AND INPUT ZONE */}
      <div className="bg-white rounded-b-xl shadow-sm px-5 pb-5 pt-3 space-y-3">

        {/* BUILDER STICKY TO INPUT */}
        {!isVoiceMode && (
          <>
            <button
              type="button"
              onClick={toggleBuilder}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-200 text-xs text-slate-800"
            >
              <span>Task builder</span>
              <span className="flex items-center gap-2">
                {openTaskBuilder ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </span>
            </button>

            {openTaskBuilder && (
              <div className="mt-2 rounded-md bg-slate-300 p-3 text-xs text-slate-900 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="block mb-1">Action</label>
                    <select
                      value={action}
                      onChange={e => setAction(e.target.value)}
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
                      value={target}
                      onChange={e => setTarget(e.target.value)}
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
                      value={intent}
                      onChange={e => setIntent(e.target.value)}
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
                </div>

                <div>
                  <label className="block mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-2 py-1.5 h-16 rounded border border-slate-400 text-xs resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!builderReady}
                    onClick={handleBuilderParse}
                    className={
                      builderReady
                        ? "px-4 py-1.5 bg-slate-900 text-white rounded text-xs hover:bg-slate-800"
                        : "px-4 py-1.5 bg-slate-500 text-slate-300 rounded text-xs cursor-not-allowed"
                    }
                  >
                    Parse draft for agent
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* INPUT BOX */}
        {!isVoiceMode && (
          <form
            onSubmit={handleFreeTextSubmit}
            className="flex items-center gap-2"
          >
            <input
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe what you want to do..."
            />

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs hover:bg-slate-800"
            >
              Send
            </button>
          </form>
        )}

        {isVoiceMode && (
          <div className="text-xs text-slate-500 text-center py-2">
            Voice mode active. Speak your instructions to the Web Engineer.
          </div>
        )}
      </div>
    </div>
  );
}
