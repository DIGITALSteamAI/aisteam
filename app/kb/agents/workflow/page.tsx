"use client";

export default function AssistantSystemBiblePage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-800 space-y-10 max-w-6xl mx-auto">
      {/* Title and intro */}
      <header className="space-y-3">
        <h1 className="text-3xl font-bold mb-2">
          Assistant System Bible
        </h1>
        <p className="text-sm leading-relaxed max-w-3xl">
          This document is the complete reference for the AISTEAM assistant system.  
          It describes the architecture, parallel multi agent runs, routing and validation rules, task planning protocol, project context handling, execution model, logging and experience tracking, thinking stream, UI behavior and error handling for the centralized assistant panel and its agents.
        </p>
        <p className="text-sm leading-relaxed max-w-3xl">
          Use this as the source of truth when building or refactoring the assistant panel, the agent routing logic, the assistant API routes and the related database tables.  
          The system is governed by four assistant laws that apply to every task, every run and every planning session.
        </p>
      </header>

      {/* Contents */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contents</h2>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>
            <a href="#purpose-and-scope" className="text-blue-600 hover:text-blue-800 hover:underline">
              Purpose and Scope
            </a>
          </li>
          <li>
            <a href="#core-concepts-and-definitions" className="text-blue-600 hover:text-blue-800 hover:underline">
              Core Concepts and Definitions
            </a>
          </li>
          <li>
            <a href="#high-level-architecture" className="text-blue-600 hover:text-blue-800 hover:underline">
              High Level Architecture
            </a>
          </li>
          <li>
            <a href="#message-lifecycle" className="text-blue-600 hover:text-blue-800 hover:underline">
              Message Lifecycle
            </a>
          </li>
          <li>
            <a href="#agent-selection-and-routing" className="text-blue-600 hover:text-blue-800 hover:underline">
              Agent Selection and Routing
            </a>
          </li>
          <li>
            <a href="#validation-and-escalation" className="text-blue-600 hover:text-blue-800 hover:underline">
              Validation and Escalation
            </a>
          </li>
          <li>
            <a href="#project-context-and-scoping" className="text-blue-600 hover:text-blue-800 hover:underline">
              Project Context and Scoping
            </a>
          </li>
          <li>
            <a href="#execution-model-and-tasks" className="text-blue-600 hover:text-blue-800 hover:underline">
              Execution Model and Tasks
            </a>
          </li>
          <li>
            <a href="#logging-and-experience-model" className="text-blue-600 hover:text-blue-800 hover:underline">
              Logging and Experience Model
            </a>
          </li>
          <li>
            <a href="#assistant-panel-ui-behavior" className="text-blue-600 hover:text-blue-800 hover:underline">
              Assistant Panel UI Behavior
            </a>
          </li>
          <li>
            <a href="#error-handling-and-recovery" className="text-blue-600 hover:text-blue-800 hover:underline">
              Error Handling and Recovery
            </a>
          </li>
          <li>
            <a href="#api-contracts" className="text-blue-600 hover:text-blue-800 hover:underline">
              API Contracts
            </a>
          </li>
          <li>
            <a href="#database-schema" className="text-blue-600 hover:text-blue-800 hover:underline">
              Database Schema
            </a>
          </li>
          <li>
            <a href="#implementation-patterns-and-notes" className="text-blue-600 hover:text-blue-800 hover:underline">
              Implementation Patterns and Notes
            </a>
          </li>
          <li>
            <a href="#future-enhancements" className="text-blue-600 hover:text-blue-800 hover:underline">
              Future Enhancements
            </a>
          </li>
          <li>
            <a href="#task-planning-protocol" className="text-blue-600 hover:text-blue-800 hover:underline">
              Task Planning Protocol
            </a>
          </li>
          <li>
            <a href="#thinking-stream" className="text-blue-600 hover:text-blue-800 hover:underline">
              Thinking Stream and Real Time Reasoning Logs
            </a>
          </li>
          <li>
            <a href="#related-files-and-integration-points" className="text-blue-600 hover:text-blue-800 hover:underline">
              Related Files and Integration Points
            </a>
          </li>
        </ol>
      </section>

      {/* 1. Purpose and Scope */}
      <section id="purpose-and-scope" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">1. Purpose and Scope</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system in AISTEAM is the central intelligence that works across projects, tenants and panels.  
          It offers a single assistant panel where the user can talk to a set of agents that collaborate to plan and execute work, often in parallel runs that involve several agents at the same time.
        </p>
        <p className="text-sm leading-relaxed max-w-3xl">
          This Bible describes how that system behaves in detail.  
          It covers both conceptual behavior and concrete implementation details so developers and AI agents can reason about the same model.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Audience, engineers, AI configuration, product design and future agents</li>
          <li>Scope, assistant panel, chat, routing, planning protocol, parallel runs, execution, logging, experience and thinking stream</li>
          <li>Out of scope, billing, authentication and general app layout that is not related to the assistant workflow</li>
        </ul>
      </section>

      {/* 2. Core Concepts and Definitions */}
      <section id="core-concepts-and-definitions" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">2. Core Concepts and Definitions</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system uses a few core concepts.  
          These names should stay consistent in code, in database schema and in future documentation.
        </p>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-semibold">Assistant panel</dt>
            <dd className="text-slate-700">
              The right side UI that shows the agent list and the conversation. It is the main cockpit for interacting with the AI system.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Agent</dt>
            <dd className="text-slate-700">
              A defined persona with a clear responsibility and a set of tools. Examples, Chief AI Officer, Web Engineer, Growth Lead.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Supervisor</dt>
            <dd className="text-slate-700">
              The Chief AI Officer, also called Hans. Receives messages first at the model level and decides who should handle the request.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Conversation</dt>
            <dd className="text-slate-700">
              A continuous thread between a user and the assistant system. Stored in assistant_conversations with messages in assistant_messages.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Run</dt>
            <dd className="text-slate-700">
              A structured multi step response to a user intent that can involve several agents and tasks in parallel. All tasks in a run share a run identifier.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Run step group</dt>
            <dd className="text-slate-700">
              A phase inside a run that can contain one or more tasks that are allowed to execute in parallel before the next phase unlocks.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Task</dt>
            <dd className="text-slate-700">
              A structured action that can be executed. For example create a page in WordPress, update a product or create an internal ticket.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Experience</dt>
            <dd className="text-slate-700">
              The sequence of visible messages and status events that the user sees for a given conversation or run. Includes text, status bubbles, run cards and progress states.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Project context</dt>
            <dd className="text-slate-700">
              Structured information about the project that is currently in focus. For example project id, name, domains, CMS and important configuration.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Routing</dt>
            <dd className="text-slate-700">
              The process that decides which agent is responsible for a specific user request or part of a request.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Thinking stream</dt>
            <dd className="text-slate-700">
              A light, safe, summarized log of what agents are doing and planning behind the scenes. Shown as small grey entries under messages and in run cards. Stored as thinking messages, not raw chain of thought.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Assistant laws</dt>
            <dd className="text-slate-700">
              The core rules that govern all runs and tasks, including allowed scope, clarity of inputs, transparency of actions and the law of no return for reversibility and explicit consent.
            </dd>
          </div>
        </dl>
      </section>

      {/* 3. High Level Architecture */}
      <section id="high-level-architecture" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">3. High Level Architecture</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system sits between the front end assistant panel, the AI model, the Supabase database and external platforms such as WordPress or WooCommerce.
        </p>
        <p className="text-sm leading-relaxed max-w-3xl">
          At a high level the flow looks like this for multi step work. Simple questions can still be answered directly without a full run.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`flowchart TD
  U[User in assistant panel] --> C[Assistant chat API]
  C --> S[Supervisor logic]
  S --> P[Plan run and steps]
  P --> R1[Run with parallel tasks]
  R1 --> T[Execution API]
  T --> E[External systems and platforms]
  E --> T
  T --> S
  S --> ANS[Final consolidated answer]
  ANS --> U`}
        </pre>
        <p className="text-sm leading-relaxed max-w-3xl">
          The Supervisor always remains in the loop. For complex requests Hans creates a run that may involve several agents and tasks in parallel, then validates the combined result before sending the final message to the user.  
          During this process the thinking stream records safe reasoning steps so the user can see what is happening, in a light grey collapsible view.
        </p>
      </section>

      {/* 4. Message Lifecycle */}
      <section id="message-lifecycle" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">4. Message Lifecycle</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Every user message in the assistant panel follows a structured lifecycle.  
          This lifecycle is important for logging, error handling, planning protocol and consistent user experience.
        </p>

        <h3 className="text-lg font-semibold">4.1 Stages</h3>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>User enters a message in the assistant panel and clicks send.</li>
          <li>Front end sends a request to the assistant chat API with conversation id, active agent id and project context.</li>
          <li>API loads conversation history and context from the database.</li>
          <li>Supervisor evaluates the new message and classifies it as a simple answer or a multi step run that needs planning.</li>
          <li>If simple, Supervisor chooses the best agent and that agent prepares a direct answer.</li>
          <li>If a run is needed, Supervisor invokes the task planning protocol and creates an AssistantRun record that groups the work.</li>
          <li>The plan is converted into one or more AssistantTask records, possibly grouped into phases with parallel tasks.</li>
          <li>Each task is checked against the assistant laws before it is allowed to execute.</li>
          <li>Tasks are executed or queued through the execution API, sometimes in parallel when the plan allows it.</li>
          <li>Supervisor validates the combined agent output and builds the final user response.</li>
          <li>API saves new messages, status events, thinking events, run and task updates in the database.</li>
          <li>Front end updates the conversation, any visible run cards, thinking previews and status indicators.</li>
        </ol>

        <h3 className="text-lg font-semibold">4.2 Message types</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Messages in assistant_messages can have different types. This allows the UI to display them correctly and supports richer experiences, including the thinking stream.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>
            <span className="font-semibold">user</span> text message that came from the human user
          </li>
          <li>
            <span className="font-semibold">assistant</span> primary response sent to the user
          </li>
          <li>
            <span className="font-semibold">status</span> internal status item such as run created, task created or execution started that can be displayed as a thin status bubble
          </li>
          <li>
            <span className="font-semibold">thinking</span> safe summarized reasoning entries for the thinking stream. For example Hans is planning the run or Web Engineer is preparing layout options
          </li>
          <li>
            <span className="font-semibold">system</span> internal notes or prompts that are not shown to the user by default
          </li>
        </ul>

        <h3 className="text-lg font-semibold">4.3 Experience timeline</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          For each user message the system may generate several experience events.  
          For example the user might see:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Assistant is thinking</li>
          <li>Hans is planning a multi agent run for this request</li>
          <li>Growth Lead Dana and Creative Lead Mak are working in parallel</li>
          <li>Creating a new WordPress page in your project</li>
          <li>Task created and queued</li>
          <li>All tasks in this run are completed</li>
          <li>Final summary of what was done</li>
        </ul>
        <p className="text-sm leading-relaxed max-w-3xl">
          These experience events should be logged as assistant messages with kind set to status or thinking so they can be replayed in the conversation and grouped by run when relevant.  
          The UI can also present them as a compact timeline so the user understands what the system did, not only what it answered.
        </p>
      </section>

      {/* 5. Agent Selection and Routing */}
      <section id="agent-selection-and-routing" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">5. Agent Selection and Routing</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant panel lets the user select an active agent, but the Supervisor still has authority to override routing when this leads to a better outcome.  
          For complex work the Supervisor often builds a run that includes several agents working together.
        </p>

        <h3 className="text-lg font-semibold">5.1 Active agent from the panel</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>The assistant panel shows all relevant agents for the tenant or project.</li>
          <li>When the user clicks an agent avatar or entry, the activeAgentId in local state updates.</li>
          <li>Every message sent from that conversation includes the activeAgentId in the API request.</li>
          <li>assistant_conversations.current_agent stores the last known selected agent for that conversation.</li>
        </ul>

        <h3 className="text-lg font-semibold">5.2 Supervisor routing decision</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The Supervisor uses both the current agent and the message content to decide who should answer or which agents belong in the run for this request.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`type AgentId =
  | "chief"
  | "deliveryLead"
  | "clientSuccess"
  | "creativeLead"
  | "growthLead"
  | "technicalLead"
  | "webEngineer"
  | "seoSpecialist"
  | "ecommerceSpecialist"
  | "sportsMedia"
  | "notificationAgent"
  | "researchAgent"
  | "schedulerAgent"
  | "fileAgent";

interface RoutingContext {
  currentAgent: AgentId;
  messageText: string;
  projectContext?: {
    projectId: string;
    cmsPlatform?: string;
  };
}

function determineAgent(ctx: RoutingContext): AgentId {
  const message = ctx.messageText.toLowerCase();

  if (message.includes("delivery") || message.includes("timeline")) {
    return "deliveryLead";
  }
  if (message.includes("client") || message.includes("account")) {
    return "clientSuccess";
  }
  if (
    message.includes("brand") ||
    message.includes("visual") ||
    message.includes("creative")
  ) {
    return "creativeLead";
  }
  if (
    message.includes("seo") ||
    message.includes("traffic") ||
    message.includes("ads") ||
    message.includes("campaign")
  ) {
    return "growthLead";
  }
  if (
    message.includes("hosting") ||
    message.includes("server") ||
    message.includes("ssl") ||
    message.includes("integration")
  ) {
    return "technicalLead";
  }
  if (
    message.includes("page") ||
    message.includes("post") ||
    message.includes("template") ||
    message.includes("layout")
  ) {
    return "webEngineer";
  }

  return ctx.currentAgent || "chief";
}`}
        </pre>
        <p className="text-sm leading-relaxed max-w-3xl">
          This function can be extended with more domain signals or replaced by a small model call, but the important part is that routing remains explicit and debuggable.  
          Thinking messages can record how the routing decision was made in safe terms, for example Hans is choosing Growth Lead based on SEO intent.
        </p>

        <h3 className="text-lg font-semibold">5.3 Routing visibility for the user</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Whenever the Supervisor changes the agent that will answer a request or adds agents to a run, the system should create a status message such as:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Hans is handing this off to Web Engineer Nico for implementation.</li>
          <li>Growth Lead Dana and Creative Lead Mak are joining this run to help with SEO and layout.</li>
        </ul>
        <p className="text-sm leading-relaxed max-w-3xl">
          This keeps the experience understandable for the user and also leaves a clear audit trail in the conversation.  
          The thinking stream can give a lighter, more detailed view of the same routing step without overwhelming the primary conversation.
        </p>
      </section>

      {/* 6. Validation and Escalation */}
      <section id="validation-and-escalation" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">6. Validation and Escalation</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system has clear rules about when an agent can answer directly, when clarification is required and when escalation is needed.
        </p>

        <h3 className="text-lg font-semibold">6.1 Supervisor validation</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>The Supervisor validates every response that involves execution or important decisions.</li>
          <li>For simple advisory messages, the same agent that handled the request can answer directly.</li>
          <li>For actions that affect a live site, the Supervisor must confirm that the explanation and summary are clear.</li>
        </ul>

        <h3 className="text-lg font-semibold">6.2 Clarification before action</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Agents must not guess about critical parameters such as domain, live environment or destructive actions.  
          They follow this pattern:
        </p>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>Check project context for the required information.</li>
          <li>If missing, request clarification from the user with a clear list of what is needed.</li>
          <li>Once information is complete, confirm the plan in a short recap sentence.</li>
          <li>Only then proceed to call the execution API.</li>
        </ol>

        <h3 className="text-lg font-semibold">6.3 Escalation logic</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          If an agent does not have enough authority or information to safely handle a request it must escalate back to the Supervisor or to the correct lead.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Execution agents escalate to Technical Lead for risky changes such as DNS or certificates.</li>
          <li>Marketing related actions escalate to Growth Lead when budget or strategy questions appear.</li>
          <li>Client communication questions escalate to Client Success Lead.</li>
        </ul>

        <h3 className="text-lg font-semibold">6.4 Assistant laws</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          All runs and tasks must respect four core assistant laws. These apply to every task, even when several tasks run in parallel inside a run.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>
            <span className="font-semibold">Law of allowed scope</span>  
            Agents can only perform actions that are allowed for this project and tenant. Task types must be checked against project configuration before execution.
          </li>
          <li>
            <span className="font-semibold">Law of clarity</span>  
            No task can execute if critical inputs are missing. Agents must either use project context or ask the user for the missing information and confirm the plan before acting.
          </li>
          <li>
            <span className="font-semibold">Law of transparency</span>  
            Every meaningful step is logged in a way that can be understood later. This includes routing decisions, planning protocol, task creation, status changes, thinking stream entries and final summaries.
          </li>
          <li>
            <span className="font-semibold">Law of no return</span>  
            The system should prefer operations that can be rolled back. If an action cannot be rolled back automatically, it must be clearly explained to the user and must receive explicit confirmation before execution. These irreversible actions should be rare and always visible in the logs with clear flags in the tasks and runs.
          </li>
        </ul>
      </section>



      {/* 7. Project Context and Scoping */}
      <section id="project-context-and-scoping" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">7. Project Context and Scoping</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant must always know which project it is working on, or that it is in a cross project mode.  
          Context scoping is handled as part of every request and is reused by routing, planning, execution and logging.
        </p>

        <h3 className="text-lg font-semibold">7.1 Context resolution</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>If the user is on a project page, the front end passes projectId in the assistant request.</li>
          <li>The chat API loads project data from the projects table along with any extended configuration.</li>
          <li>A projectContext object is built and injected into the system prompt and planning protocol.</li>
          <li>Agents are instructed to rely on this context before asking the user about basic facts.</li>
        </ul>

        <h3 className="text-lg font-semibold">7.2 Cross project conversations</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Some conversations are not tied to a single project.  
          For example, a user might ask for a comparison between several sites.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>In that case projectId is omitted and context is scoped to the tenant.</li>
          <li>Agents may fetch information for several projects as part of the response.</li>
          <li>Any tasks created must include the correct projectId in their payload even in a cross project conversation.</li>
        </ul>

        <h3 className="text-lg font-semibold">7.3 Context in runs and tasks</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Runs and tasks should store project identifiers explicitly to keep logs and execution safe and traceable.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>AssistantRun.projectId indicates the main project for the run.</li>
          <li>AssistantTask.projectId indicates the project impacted by that specific task.</li>
          <li>If a run touches several projects, tasks can each carry their own projectId.</li>
          <li>Thinking messages should never guess project context when it is unknown. Instead they should record the absence and ask the user.</li>
        </ul>
      </section>

      {/* 8. Execution Model and Tasks */}
      <section id="execution-model-and-tasks" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">8. Execution Model and Tasks</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Execution is the part where ideas become changes in external systems.  
          The assistant uses structured runs and tasks that are sent to a dedicated execution API.  
          Planning decides what to do, execution performs the work.
        </p>

        <h3 className="text-lg font-semibold">8.1 Run and task contracts</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Runs group tasks that belong to the same user intent. Tasks represent individual actions that can be executed, often in parallel inside a run.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`interface AssistantRun {
  id: string;
  conversationId: string;
  projectId?: string;
  createdByAgentId: string;
  title: string;
  status: "planning" | "running" | "completed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface AssistantTask {
  id: string;
  runId: string;
  conversationId: string;
  projectId?: string;
  parentTaskId?: string;
  stepGroup?: string;
  sequenceOrder: number;
  createdByAgentId: string;
  status: "open" | "in_progress" | "completed" | "failed" | "cancelled";
  taskType: string;
  parameters: Record<string, unknown>;
  summary: string;
  isReversibleBySystem: boolean;
  irreversibleConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  result?: Record<string, unknown>;
}`}
        </pre>

        <h3 className="text-lg font-semibold">8.2 Typical task types</h3>
        <
      {/* 7. Project Context and Scoping */}
      <section id="project-context-and-scoping" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">7. Project Context and Scoping</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant must always know which project it is working on, or that it is in a cross project mode.  
          Context scoping is handled as part of every request and is reused by routing, planning, execution and logging.
        </p>

        <h3 className="text-lg font-semibold">7.1 Context resolution</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>If the user is on a project page, the front end passes projectId in the assistant request.</li>
          <li>The chat API loads project data from the projects table along with any extended configuration.</li>
          <li>A projectContext object is built and injected into the system prompt and planning protocol.</li>
          <li>Agents are instructed to rely on this context before asking the user about basic facts.</li>
        </ul>

        <h3 className="text-lg font-semibold">7.2 Cross project conversations</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Some conversations are not tied to a single project.  
          For example, a user might ask for a comparison between several sites.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>In that case projectId is omitted and context is scoped to the tenant.</li>
          <li>Agents may fetch information for several projects as part of the response.</li>
          <li>Any tasks created must include the correct projectId in their payload even in a cross project conversation.</li>
        </ul>

        <h3 className="text-lg font-semibold">7.3 Context in runs and tasks</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Runs and tasks should store project identifiers explicitly to keep logs and execution safe and traceable.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>AssistantRun.projectId indicates the main project for the run.</li>
          <li>AssistantTask.projectId indicates the project impacted by that specific task.</li>
          <li>If a run touches several projects, tasks can each carry their own projectId.</li>
          <li>Thinking messages should never guess project context when it is unknown. Instead they should record the absence and ask the user.</li>
        </ul>
      </section>

      {/* 8. Execution Model and Tasks */}
      <section id="execution-model-and-tasks" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">8. Execution Model and Tasks</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Execution is the part where ideas become changes in external systems.  
          The assistant uses structured runs and tasks that are sent to a dedicated execution API.  
          Planning decides what to do, execution performs the work.
        </p>

        <h3 className="text-lg font-semibold">8.1 Run and task contracts</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Runs group tasks that belong to the same user intent. Tasks represent individual actions that can be executed, often in parallel inside a run.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`interface AssistantRun {
  id: string;
  conversationId: string;
  projectId?: string;
  createdByAgentId: string;
  title: string;
  status: "planning" | "running" | "completed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface AssistantTask {
  id: string;
  runId: string;
  conversationId: string;
  projectId?: string;
  parentTaskId?: string;
  stepGroup?: string;
  sequenceOrder: number;
  createdByAgentId: string;
  status: "open" | "in_progress" | "completed" | "failed" | "cancelled";
  taskType: string;
  parameters: Record<string, unknown>;
  summary: string;
  isReversibleBySystem: boolean;
  irreversibleConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  result?: Record<string, unknown>;
}`}
        </pre>

        <h3 className="text-lg font-semibold">8.2 Typical task types</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>create_page, create or update a CMS page</li>
          <li>update_content_block, update part of a page or template</li>
          <li>create_product, create or update an ecommerce product</li>
          <li>create_ticket, create a ticket in the internal ticketing panel</li>
          <li>run_audit, request a performance or SEO audit</li>
        </ul>

        <h3 className="text-lg font-semibold">8.3 Execution API usage</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Agents never talk directly to external systems.  
          They call the execution API with a structured payload and let that layer handle integration details, including respect for project scope and the law of no return.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`POST /api/assistant/execute

Request body:

{
  "runId": "uuid",
  "conversationId": "uuid",
  "projectId": "uuid",
  "createdByAgentId": "webEngineer",
  "taskType": "create_page",
  "parameters": {
    "cms": "wordpress",
    "title": "About Aquaverter",
    "slug": "about-aquaverter",
    "contentHtml": "<h1>About Aquaverter</h1>..."
  },
  "summary": "Create new About page for Aquaverter site"
}`}
        </pre>

        <h3 className="text-lg font-semibold">8.4 Parallel execution inside runs</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          For complex work, several tasks may run at the same time as long as they do not depend on each other.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Tasks that share the same stepGroup can be considered parallel siblings.</li>
          <li>Tasks in a later group must wait until all tasks in earlier groups reach a terminal state.</li>
          <li>The execution layer can decide how to schedule parallel tasks within system limits.</li>
          <li>The thinking stream and status messages should make parallel work visible to the user without adding noise.</li>
        </ul>
      </section>

      {/* 9. Logging and Experience Model */}
      <section id="logging-and-experience-model" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">9. Logging and Experience Model</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system must be observable.  
          Logging is not only for debugging but also for reconstructing the user experience and understanding how agents collaborate across runs and tasks.
        </p>

        <h3 className="text-lg font-semibold">9.1 What gets logged</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Every user message and assistant message</li>
          <li>Agent id that authored each assistant message</li>
          <li>Routing decisions for each user message, including previous and new agent</li>
          <li>Run creation, updates and completion</li>
          <li>Task creation, updates and completion, including execution status and reversibility information</li>
          <li>Thinking entries that summarize safe reasoning steps during planning and execution</li>
          <li>Important system events such as missing configuration or external API errors</li>
        </ul>

        <h3 className="text-lg font-semibold">9.2 Experience timeline concept</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          For any conversation the system should be able to display a high level timeline of what happened, not only the raw text.  
          Timelines can be filtered by run so multi agent parallel work stays understandable.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`[
  {
    "time": "2025-12-09T12:00:00Z",
    "actor": "user",
    "kind": "message",
    "runId": "run_1",
    "summary": "User asked to create a new service page"
  },
  {
    "time": "2025-12-09T12:00:05Z",
    "actor": "supervisor",
    "kind": "routing",
    "runId": "run_1",
    "summary": "Hans delegated implementation to Web Engineer Nico and Growth Lead Dana"
  },
  {
    "time": "2025-12-09T12:00:08Z",
    "actor": "supervisor",
    "kind": "planning",
    "runId": "run_1",
    "summary": "Planning run with content, layout and SEO tasks in parallel"
  },
  {
    "time": "2025-12-09T12:00:10Z",
    "actor": "webEngineer",
    "kind": "task_created",
    "runId": "run_1",
    "summary": "Task create_page for Services page structure"
  },
  {
    "time": "2025-12-09T12:00:12Z",
    "actor": "growthLead",
    "kind": "task_created",
    "runId": "run_1",
    "summary": "Task run_audit for SEO suggestions"
  },
  {
    "time": "2025-12-09T12:00:20Z",
    "actor": "system",
    "kind": "task_completed",
    "runId": "run_1",
    "summary": "Page created in WordPress"
  }
]`}
        </pre>

        <h3 className="text-lg font-semibold">9.3 Thinking entries</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Thinking entries are small, summarized logs that describe what agents are doing behind the scenes in a safe way.  
          They are visible to the user as light grey text and support trust and understanding.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Thinking messages must never expose raw prompts or sensitive chain of thought.</li>
          <li>They should describe actions and decisions in simple language, for example Hans is checking missing values.</li>
          <li>They are linked to a conversation and optionally to a run and a step group.</li>
          <li>The UI can preview recent thinking items under each answer and show full sequences inside run cards.</li>
        </ul>

        <h3 className="text-lg font-semibold">9.4 Internal reasoning metadata</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Internal reasoning that is not safe to display can still influence planning and routing, but it should not be stored verbatim.  
          Instead the system can keep compact structured metadata to support later analysis.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>assistant_runs.metadata can keep structured planning information.</li>
          <li>assistant_tasks.metadata can store technical details about integration calls.</li>
          <li>assistant_conversations.metadata can store global flags such as risk level or confusion markers.</li>
        </ul>
      </section>

      {/* 10. Assistant Panel UI Behavior */}
      <section id="assistant-panel-ui-behavior" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">10. Assistant Panel UI Behavior</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The UI of the assistant panel is where users feel the system.  
          The behavior must be predictable and should make the invisible routing, planning and execution steps easy to understand without overwhelming the user.
        </p>

        <h3 className="text-lg font-semibold">10.1 Layout</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Left column inside the panel, agent list with avatars and short labels.</li>
          <li>Right area inside the panel, conversation feed and input box.</li>
          <li>Top context bar that shows the current project and tenant.</li>
          <li>Optional run cards area for ongoing multi step runs and long running operations.</li>
        </ul>

        <h3 className="text-lg font-semibold">10.2 Agent list behavior</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Only agents that are relevant to the current tenant or project are visible.</li>
          <li>Supervisor is always visible and usually selected by default.</li>
          <li>Clicking an agent highlights it and sets that agent as current for new messages.</li>
          <li>Tooltips show a short description and example prompts for each agent.</li>
        </ul>

        <h3 className="text-lg font-semibold">10.3 Conversation feed</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>User messages aligned to the right or styled differently.</li>
          <li>Assistant messages show the agent avatar that authored them.</li>
          <li>Status entries styled as light system chips such as run created or task executing.</li>
          <li>Runs can be summarized in collapsible blocks that list agents involved, tasks and current status.</li>
          <li>Long explanations can be collapsed with a short summary and an expand control.</li>
        </ul>

        <h3 className="text-lg font-semibold">10.4 Activity indicators</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          While the assistant is working the UI should indicate what is going on instead of a simple generic typing bubble.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Thinking, the Supervisor or agent is planning a response.</li>
          <li>Routing, Supervisor is deciding which agent or agents should handle this.</li>
          <li>Planning, Hans is creating a multi step run with tasks and step groups.</li>
          <li>Executing, one or more tasks are being sent to or processed by external systems.</li>
          <li>Validating, Supervisor is checking the result before answering.</li>
        </ul>

        <h3 className="text-lg font-semibold">10.5 Thinking stream in the UI</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The thinking stream is visible in two places, with a collapsible behavior and a dynamic preview.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>
            Under each assistant message, a small preview line appears in light grey, for example  
            Thinking details Hans is analyzing your request and preparing a plan.
          </li>
          <li>
            The preview is collapsible by default and shows only the most recent thinking entries that fit comfortably on one line based on the current screen width.
          </li>
          <li>
            Clicking the preview expands a vertical list of thinking entries related to that answer, for example routing decisions, checks for missing values and small plan steps.
          </li>
          <li>
            Inside run cards, a richer thinking section can show grouped entries per step group and per agent, so the user can see how the run unfolded over time.
          </li>
          <li>
            Thinking entries must remain visually secondary. They use smaller font size and lighter color so the primary content stays dominant.
          </li>
        </ul>
      </section>
      {/* 11. Error Handling and Recovery */}
      <section id="error-handling-and-recovery" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">11. Error Handling and Recovery</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Errors are inevitable. The system must handle them in a way that is safe, reversible when possible and understandable.  
          All error handling respects the law of no return and the visibility principles of the assistant panel including thinking entries.
        </p>

        <h3 className="text-lg font-semibold">11.1 Error categories</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Input errors, the user request is incomplete or conflicting.</li>
          <li>Context errors, project configuration is missing or invalid.</li>
          <li>Execution errors, external systems reject the request or time out.</li>
          <li>System errors, internal server problems or unexpected exceptions.</li>
        </ul>

        <h3 className="text-lg font-semibold">11.2 Principles</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Never pretend a task succeeded when it failed.</li>
          <li>Explain the failure in simple non technical language that still respects the truth of the issue.</li>
          <li>Always propose a recovery path when possible.</li>
          <li>Log all details privately in messages metadata and runs metadata for debugging and audits.</li>
          <li>When something irreversible would normally occur the system must prompt the user before allowing it.</li>
          <li>If irreversibility occurs with user approval the system must record it with irreversibleConfirmedAt on the task.</li>
        </ul>

        <h3 className="text-lg font-semibold">11.3 Example error responses and thinking stream</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`User facing content:

I tried to create the new page but the site returned a permission error.
This usually means the credentials are missing or incorrect.
Here is what we can do next.
I can help you verify or update the credentials in the project settings then we can try again.

Thinking entries (light grey to user):

Hans is checking WordPress credentials.
WordPress API returned code 403 access denied.
Marking task as failed.
Suggesting recovery path to the user.`}
        </pre>
      </section>

      {/* 12. API Contracts */}
      <section id="api-contracts" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">12. API Contracts</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system exposes at least two main API routes.  
          The chat route handles conversational interactions, routing, planning and thinking.  
          The execution route handles tasks and all integration with external systems.
        </p>

        <h3 className="text-lg font-semibold">12.1 Chat route with planning and thinking stream</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`POST /api/assistant/chat

Request:

{
  "conversationId": "uuid or null",
  "messages": [
    { "role": "user", "content": "Please create a new service page." }
  ],
  "activeAgentId": "chief",
  "projectContext": {
    "projectId": "uuid",
    "projectName": "Aquaverter",
    "projectDomain": "aquaverter.ca",
    "cmsPlatform": "wordpress"
  }
}

Response:

{
  "conversationId": "uuid",
  "messages": [
    {
      "id": "uuid",
      "role": "assistant",
      "agentId": "chief",
      "content": "Before I create this page I need a few details..."
    }
  ],
  "thinking": [
    {
      "kind": "routing",
      "summary": "Hans evaluated the request and will create a planning run."
    },
    {
      "kind": "planning",
      "summary": "Identifying required tasks for new service page creation."
    }
  ],
  "routedAgentId": "chief",
  "runCreated": {
    "runId": "run_123",
    "title": "Create new service page"
  }
}`}
        </pre>

        <h3 className="text-lg font-semibold">12.2 Execution route with reversibility controls</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`POST /api/assistant/execute

Request:

{
  "runId": "uuid",
  "conversationId": "uuid",
  "projectId": "uuid",
  "createdByAgentId": "webEngineer",
  "taskType": "create_page",
  "parameters": {
    "cms": "wordpress",
    "title": "Services",
    "slug": "services",
    "contentHtml": "<h1>Services</h1>..."
  },
  "summary": "Create Services page"
}

Response:

{
  "taskId": "uuid",
  "status": "completed",
  "details": {
    "cmsId": 4551,
    "url": "https://aquaverter.ca/services"
  }
}`}
        </pre>

        <p className="text-sm leading-relaxed max-w-3xl">
          Thinking messages generated during execution such as contacting WordPress or validating slugs are also logged and optionally surfaced to the user under run cards.
        </p>
      </section>

      {/* 13. Database Schema */}
      <section id="database-schema" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">13. Database Schema</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system relies on a structured set of tables that store conversations, messages, runs, tasks and optional agent definitions.  
          All schema follows the principles of transparency, planning clarity, thinking visibility and the law of no return.
        </p>

        <h3 className="text-lg font-semibold">13.1 assistant_conversations</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`id                 uuid primary key
tenant_id          uuid not null
user_id            uuid null
started_at         timestamptz not null default now()
closed_at          timestamptz null
active_flag        boolean not null default true
current_agent      text not null default 'chief'
metadata           jsonb not null default '{}'`}
        </pre>

        <h3 className="text-lg font-semibold">13.2 assistant_messages</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`id               uuid primary key
conversation_id   uuid not null references assistant_conversations(id)
author            text not null          -- user or assistant or system
agent_id          text null
kind              text not null          -- message or status or thinking or system
content           text not null
created_at        timestamptz not null default now()
metadata          jsonb not null default '{}'`}
        </pre>

        <p className="text-sm leading-relaxed max-w-3xl">
          thinking messages follow the same structure as status messages but use kind set to thinking and are collapsible by default in the UI.
        </p>

        <h3 className="text-lg font-semibold">13.3 assistant_runs</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`id               uuid primary key
conversation_id   uuid not null references assistant_conversations(id)
project_id        uuid null
created_by        text not null
title             text not null
status            text not null        -- planning or running or completed or failed or cancelled
created_at        timestamptz not null default now()
updated_at        timestamptz not null default now()
metadata          jsonb not null default '{}'`}
        </pre>

        <h3 className="text-lg font-semibold">13.4 assistant_tasks</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`id                     uuid primary key
run_id                 uuid not null references assistant_runs(id)
conversation_id        uuid not null references assistant_conversations(id)
project_id             uuid null
parent_task_id         uuid null
step_group             text null
sequence_order         integer not null default 0
created_by             text not null
status                 text not null        -- open or in_progress or completed or failed or cancelled
task_type              text not null
parameters             jsonb not null
summary                text not null
is_reversible_by_system boolean not null default true
irreversible_confirmed_at timestamptz null
created_at             timestamptz not null default now()
updated_at             timestamptz not null default now()
result                 jsonb null`}
        </pre>
        <h3 className="text-lg font-semibold">13.5 assistant_agent_definitions optional</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`id             uuid primary key
tenant_id       uuid null              -- null for global agent definitions
agent_id        text not null          -- chief or webEngineer etc
display_name    text not null
role_summary    text not null
category        text not null          -- supervisor or lead or execution or utility
visible         boolean not null default true
ordering        integer not null default 0
avatar          jsonb not null default '{}'
config          jsonb not null default '{}'`}
        </pre>
      </section>

      {/* 14. Implementation Patterns and Notes */}
      <section id="implementation-patterns-and-notes" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">14. Implementation Patterns and Notes</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          This section captures practical guidance for developers who work on the assistant system and its integration with the rest of AISTEAM.  
          The goal is to keep the codebase simple to reason about while still supporting planning, runs, parallel tasks and thinking streams.
        </p>

        <h3 className="text-lg font-semibold">14.1 Keep routing explicit</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Even when model based intent detection is used, keep a routing helper in code that shows the final decision.  
          This makes debugging easier and allows tools such as Cursor to understand routing without full model introspection.
        </p>

        <h3 className="text-lg font-semibold">14.2 Use small typed helpers</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Wrap common operations in small helpers such as loadConversation, buildProjectContext, createAssistantRun, createAssistantTask and appendThinkingMessage.  
          This keeps the main route handlers readable and reduces errors.
        </p>

        <h3 className="text-lg font-semibold">14.3 Avoid duplication of project context</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Project context should be built in one place and reused across chat, planning and execution routes.  
          When fields are added to project configuration, update the context builder instead of each route individually.
        </p>

        <h3 className="text-lg font-semibold">14.4 Align names across layers</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Agent ids, task types, run statuses and task statuses should have the same names across:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Database tables</li>
          <li>TypeScript enums or literal types</li>
          <li>Prompt and system instructions</li>
          <li>Front end strings where relevant</li>
        </ul>

        <h3 className="text-lg font-semibold">14.5 Keep thinking entries small and safe</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Thinking stream entries should be short and action focused.  
          They should never reveal low level chain of thought or internal prompts.  
          Use them only to reflect safe, high level steps such as planning, routing and checks.
        </p>
      </section>

      {/* 15. Future Enhancements */}
      <section id="future-enhancements" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">15. Future Enhancements</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The current design is stable enough for first implementation.  
          Several enhancements are planned or expected as the platform grows and real usage patterns emerge.
        </p>

        <h3 className="text-lg font-semibold">15.1 Voice and real time sessions</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Streamed responses in the assistant panel for more fluid interaction.</li>
          <li>Live indication of active agent during a session.</li>
          <li>Ability to interrupt and redirect a running plan or run in real time.</li>
        </ul>

        <h3 className="text-lg font-semibold">15.2 Richer intent detection</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Use a separate model call or dedicated router for complex decisions.</li>
          <li>Let the system propose a plan that spans multiple agents and tasks with explicit step groups.</li>
          <li>Provide the user with a visible plan card that they can approve or tweak before execution.</li>
        </ul>

        <h3 className="text-lg font-semibold">15.3 Experience dashboards</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Show a history of assistant conversations, runs and tasks for each project.</li>
          <li>Visualize progress of automation and frequency of different task types.</li>
          <li>Surface common issues so that base configuration and prompts can be improved.</li>
        </ul>

        <h3 className="text-lg font-semibold">15.4 Multi tenant guardrails</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Add automated checks that prevent any cross tenant leakage of data.</li>
          <li>Extend projectContext and tenantContext with stronger isolation flags.</li>
          <li>Increase transparency in thinking streams when context boundaries are relevant.</li>
        </ul>
      </section>

      {/* 16. Task Planning Protocol */}
      <section id="task-planning-protocol" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">16. Task Planning Protocol</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          For non trivial requests the assistant system must shift from a simple ask answer mode into a planning mode.  
          In this mode the Supervisor builds an explicit plan, checks requirements and only then creates runs and tasks.  
          This protocol is central for safety, clarity and parallel multi agent work.
        </p>

        <h3 className="text-lg font-semibold">16.1 When planning protocol is used</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The Supervisor should invoke planning protocol when:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>The request requires changes in external systems such as CMS or DNS.</li>
          <li>The work spans several agents, for example creative and technical and growth.</li>
          <li>The work logically breaks into multiple steps or phases.</li>
          <li>The law of no return might be relevant because irreversible changes are possible.</li>
        </ul>

        <h3 className="text-lg font-semibold">16.2 Planning protocol stages</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The planning protocol follows a predictable sequence that can be implemented as model instructions and helper code.
        </p>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>
            <span className="font-semibold">Understand the intent</span>  
            Supervisor restates the user goal in one or two sentences. For example create a Services page that fits Aquaverter brand and supports SEO.
          </li>
          <li>
            <span className="font-semibold">Check project context</span>  
            Load projectContext and verify basic information such as CMS type, domain and relevant settings.  
            Add a thinking entry for this check.
          </li>
          <li>
            <span className="font-semibold">Identify missing requirements</span>  
            Build a short internal list of required inputs such as page title, slug, language, layout preferences, SEO focus and any constraints.  
            Mark which ones are missing.
          </li>
          <li>
            <span className="font-semibold">Ask clarifying questions when needed</span>  
            If important requirements are missing, ask the user focused questions.  
            Each question should be clearly motivated by the goal of the plan.
          </li>
          <li>
            <span className="font-semibold">Propose helpful forks</span>  
            When reasonable, suggest alternative approaches that may better support the user goals.  
            For example create a generic Services page or separate Services by category or include a lead capture block.
          </li>
          <li>
            <span className="font-semibold">Draft a stepwise plan</span>  
            Once inputs are clear, create a short list of steps and step groups.  
            Each step must have a clear owner agent and a rough description of what the task will do.
          </li>
          <li>
            <span className="font-semibold">Check laws and reversibility</span>  
            For each step, verify allowed scope and reversibility.  
            Mark any step that is not reversible by the system and plan how to obtain explicit user confirmation.
          </li>
          <li>
            <span className="font-semibold">Show plan to user</span>  
            Present the plan in a concise human friendly way.  
            The user must be able to say yes proceed, or adjust specific steps before tasks are created.
          </li>
          <li>
            <span className="font-semibold">Create run and tasks</span>  
            After explicit approval, create an AssistantRun with linked AssistantTasks that match the plan.  
            Group parallel work into stepGroup labels.
          </li>
          <li>
            <span className="font-semibold">Switch to execution</span>  
            Once the run and tasks exist, the system moves into execution mode and uses the execution API to perform the work.
          </li>
        </ol>

        <h3 className="text-lg font-semibold">16.3 Example planning flow for a Services page</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Example when the user says Please create a new webpage called Services.
        </p>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>Supervisor identifies that this requires planning because it affects the live CMS and may need design and SEO.</li>
          <li>Project context confirms the site uses WordPress and has existing navigation.</li>
          <li>Assistant asks a small set of questions such as language, target audience, and SEO angle.</li>
          <li>Assistant proposes two or three layout strategies with short descriptions.</li>
          <li>User picks one and optionally tweaks a detail.</li>
          <li>Supervisor creates a plan with groups, for example:
            <ul className="list-disc ml-6 mt-1 space-y-1">
              <li>Group A creative and content draft by Creative Lead and Growth Lead.</li>
              <li>Group B page creation and layout implementation by Web Engineer based on Group A output.</li>
              <li>Group C final review and summary by Supervisor.</li>
            </ul>
          </li>
          <li>The plan is shown to the user with a simple yes proceed confirmation.</li>
          <li>AssistantRun and related AssistantTasks are created from this plan.</li>
          <li>Execution starts and the thinking stream logs planning and task activity in light grey.</li>
        </ol>

        <h3 className="text-lg font-semibold">16.4 Integration with assistant laws</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The planning protocol is where the assistant laws are applied proactively.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>The law of allowed scope is checked when deciding which task types are permitted.</li>
          <li>The law of clarity is enforced when missing requirements are detected and questions are asked.</li>
          <li>The law of transparency is implemented by keeping runs, tasks and thinking entries visible.</li>
          <li>The law of no return is enforced by marking irreversible tasks and requiring explicit user consent.</li>
        </ul>
      </section>
      {/* 17. Thinking Stream System */}
      <section id="thinking-stream-system" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">17. Thinking Stream System</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The thinking stream makes the assistant system feel alive and transparent.  
          It reveals high level reasoning steps, routing, planning, checks and execution behavior in a safe compact way.  
          It never exposes unsafe chain of thought.  
          It never reveals internal prompts.  
          It shows only safe structured reasoning summaries intended for the end user.
        </p>

        <h3 className="text-lg font-semibold">17.1 Purpose of thinking stream</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Give users confidence by showing what the system is doing.</li>
          <li>Provide real time insight into routing, planning and task execution.</li>
          <li>Make multi agent collaboration visible.</li>
          <li>Provide developers and support staff a clear audit trail.</li>
          <li>Keep the UI dynamic and interactive through collapsible thought previews.</li>
        </ul>

        <h3 className="text-lg font-semibold">17.2 Thinking message format</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Thinking entries use kind set to thinking in assistant_messages.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`{
  "kind": "thinking",
  "agentId": "chief",
  "summary": "Checking required inputs for planning",
  "created_at": "timestamp",
  "metadata": {
    "phase": "planning",
    "group": "A"
  }
}`}
        </pre>

        <h3 className="text-lg font-semibold">17.3 When thinking entries are generated</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>During routing when the Supervisor evaluates which agent or agents to involve.</li>
          <li>During planning when requirements are checked or forks are suggested.</li>
          <li>During run creation when tasks are built or grouped.</li>
          <li>During execution when tasks begin or complete.</li>
          <li>During validation when Supervisor checks outputs before sending the final answer.</li>
        </ul>

        <h3 className="text-lg font-semibold">17.4 Thinking stream under assistant messages</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Each assistant message may include several related thinking entries.  
          To avoid clutter the UI shows only a short adaptive preview.
        </p>

        <h4 className="text-md font-semibold">Preview behavior</h4>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Shows one to three short entries based on available width.</li>
          <li>Auto shrinks to one entry on smaller screens.</li>
          <li>Displays a small arrow to expand the full list.</li>
          <li>Full list appears in a subtle light grey vertical block.</li>
        </ul>

        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`Preview example visible to user:

Thinking summary: Hans checking inputs and identifying required tasks...
Expand to view more

Expanded:
Thinking details
• Hans checking page title
• Hans checking SEO requirements
• Hans listing required tasks for plan
• Hans evaluating reversibility
Collapse`}
        </pre>

        <h3 className="text-lg font-semibold">17.5 Thinking stream in run cards</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Run cards offer a consolidated view across all agents participating in a run.  
          Thinking entries enrich these cards with detailed insight into multi agent collaboration.
        </p>

        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Entries are grouped by step group A, B or C.</li>
          <li>Entries show the agent and the high level action.</li>
          <li>Long lists are collapsible by default.</li>
          <li>Internal routing logic is summarized in plain language.</li>
        </ul>

        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
{`Run card example:

Group A
• Hans identifying task set
• Growth Lead evaluating SEO signals
• Creative Lead preparing layout concept

Group B
• Web Engineer creating page structure
• Web Engineer applying template

Group C
• Supervisor validating all outputs
• Supervisor preparing final summary`}
        </pre>

        <h3 className="text-lg font-semibold">17.6 Safety rules for thinking logs</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Thinking stream must follow strict safety rules.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>No raw chain of thought ever appears.</li>
          <li>No uncertain speculation.</li>
          <li>No internal prompt instructions.</li>
          <li>No self commentary or meta cognitive descriptions.</li>
          <li>No sensitive reasoning about the user or their intentions.</li>
          <li>All thinking entries must be safe summaries of observable actions.</li>
        </ul>

        <h3 className="text-lg font-semibold">17.7 Developer integration notes</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Create helper appendThinkingMessage that generates structured entries.</li>
          <li>Associate each thinking message with its message and its run when relevant.</li>
          <li>In the UI group and collapse using simple state per message or run card.</li>
          <li>Keep font size small and color light to avoid competing with main content.</li>
        </ul>
      </section>

      {/* 18. Related Files and Integration Points */}
      <section id="related-files-and-integration-points" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">18. Related Files and Integration Points</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          This section serves as a quick reference for developers who work on the assistant system and its integrations.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>app/assistant/AssistantPanel.tsx main panel component</li>
          <li>app/assistant/components/MessageBubble.tsx message rendering including thinking previews</li>
          <li>app/assistant/components/RunCard.tsx run and task display including grouped thinking lists</li>
          <li>app/api/assistant/chat/route.ts chat entry point with routing and planning</li>
          <li>app/api/assistant/execute/route.ts execution entry point with reversibility checks</li>
          <li>supabase/migrations/assistant_conversations.sql conversation storage</li>
          <li>supabase/migrations/assistant_messages.sql user, status and thinking messages</li>
          <li>supabase/migrations/assistant_runs.sql run tracking</li>
          <li>supabase/migrations/assistant_tasks.sql task tracking and link to runs</li>
          <li>supabase/migrations/assistant_agent_definitions.sql optional catalog for agents</li>
          <li>Internal CMS integration modules for WordPress and WooCommerce used by the execution API</li>
        </ul>
      </section>
    </div>
  );
}
