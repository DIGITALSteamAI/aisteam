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
          It describes the architecture, parallel multi agent runs, routing and validation rules, project context handling, execution model, logging and experience tracking, UI behavior and error handling for the centralized assistant panel and its agents.
        </p>
        <p className="text-sm leading-relaxed max-w-3xl">
          Use this as the source of truth when building or refactoring the assistant panel, the agent routing logic, the assistant API routes and the related database tables.  
          The system is governed by four assistant laws that apply to every task and every run.
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
          <li>Scope, assistant panel, chat, routing, parallel runs, execution, logging and experience</li>
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
              The Chief AI Officer, also called Hans. Receives all messages first at the model level and decides who should handle the request.
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
              A structured action that can be executed. For example create a page in WordPress, update a product, or create an internal task.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Experience</dt>
            <dd className="text-slate-700">
              The sequence of visible messages and status events that the user sees for a given conversation or run. Includes text, status bubbles and progress states.
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
          The assistant system sits between the front end assistant panel, the AI model, the Supabase database and any external platforms such as WordPress or WooCommerce.
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
        </p>
      </section>

      {/* 4. Message Lifecycle */}
      <section id="message-lifecycle" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">4. Message Lifecycle</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Every user message in the assistant panel follows a structured lifecycle.  
          This lifecycle is important for logging, error handling and consistent user experience.
        </p>

        <h3 className="text-lg font-semibold">4.1 Stages</h3>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>User enters a message in the assistant panel and clicks send.</li>
          <li>Front end sends request to the assistant chat API with conversation id, active agent id and project context.</li>
          <li>API loads conversation history and context from the database.</li>
          <li>Supervisor evaluates the new message and classifies it as a simple answer or a multi step run.</li>
          <li>If simple, Supervisor chooses the best agent and that agent prepares a direct answer.</li>
          <li>If a run is needed, Supervisor builds a plan and creates an AssistantRun record that groups the work.</li>
          <li>The plan is converted into one or more AssistantTask records, possibly grouped into phases with parallel tasks.</li>
          <li>Each task is checked against the assistant laws before it is allowed to execute.</li>
          <li>Tasks are executed or queued through the execution API, possibly in parallel where the plan allows it.</li>
          <li>Supervisor validates the combined agent output and builds the final user response.</li>
          <li>API saves new messages, status events, run and task updates in the database.</li>
          <li>Front end updates the conversation, any visible run cards and status indicators.</li>
        </ol>

        <h3 className="text-lg font-semibold">4.2 Message types</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Messages in assistant_messages can have different types. This allows the UI to display them correctly and supports richer experiences.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>
            <span className="font-semibold">user</span> text message that came from the human user
          </li>
          <li>
            <span className="font-semibold">assistant</span> response sent to the user
          </li>
          <li>
            <span className="font-semibold">status</span> internal status item such as task created or execution started that can be displayed as a thin status bubble
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
          These experience events should be logged as assistant messages with kind set to status so they can be replayed in the conversation and grouped by run when relevant.
        </p>
      </section>

      {/* 5. Agent Selection and Routing */}
      <section id="agent-selection-and-routing" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">5. Agent Selection and Routing</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant panel lets the user select an active agent, but the Supervisor still has authority to override routing when it clearly leads to a better outcome.
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
          All runs and tasks must respect four core assistant laws. These apply to every task, even when several tasks run in parallel.
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
            Every meaningful step is logged in a way that can be understood later. This includes routing decisions, task creation, status changes and final summaries.
          </li>
          <li>
            <span className="font-semibold">Law of no return</span>  
            The system should prefer operations that can be rolled back. If an action cannot be rolled back automatically, it must be clearly explained to the user and must receive explicit confirmation before execution. These irreversible actions should be rare and always visible in the logs.
          </li>
        </ul>
      </section>

      {/* 7. Project Context and Scoping */}
      <section id="project-context-and-scoping" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">7. Project Context and Scoping</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant must always know which project it is working on, or that it is in a cross project mode.  
          Context scoping is handled as part of every request.
        </p>

        <h3 className="text-lg font-semibold">7.1 Context resolution</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>If the user is on a project page, the front end passes projectId in the assistant request.</li>
          <li>The chat API loads project data from the projects table along with any extended configuration.</li>
          <li>A projectContext object is built and injected into the system prompt.</li>
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
      </section>

      {/* 8. Execution Model and Tasks */}
      <section id="execution-model-and-tasks" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">8. Execution Model and Tasks</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Execution is the part where ideas become changes in external systems.  
          The assistant uses structured runs and tasks that are sent to a dedicated execution API.
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
  createdByAgentId: string;      // usually 'chief' for the plan
  title: string;                 // human readable summary of the run
  status: "planning" | "running" | "completed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface AssistantTask {
  id: string;
  runId: string;
  conversationId: string;
  projectId?: string;
  parentTaskId?: string;         // for dependent steps
  stepGroup?: string;            // phase label for parallel groups, for example "A" or "B"
  sequenceOrder: number;         // order inside group if needed
  createdByAgentId: string;
  status: "open" | "in_progress" | "completed" | "failed" | "cancelled";
  taskType: string;
  parameters: Record<string, unknown>;
  summary: string;               // human readable description of what this task does
  isReversibleBySystem: boolean; // true if an automatic rollback is possible
  irreversibleConfirmedAt?: string;  // timestamp if user accepted a non reversible action
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
          <li>Routing decision for each user message, including previous and new agent</li>
          <li>Run creation, updates and completion</li>
          <li>Task creation, updates and completion including execution status and reversibility information</li>
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
    "time": "2025-12-09T12:00:10Z",
    "actor": "webEngineer",
    "kind": "task_created",
    "runId": "run_1",
    "summary": "Task create_page for About service"
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

        <h3 className="text-lg font-semibold">9.3 Internal reasoning</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Internal model reasoning is not stored verbatim for the user, but it can be helpful to keep a compact representation of decisions and plan steps.  
          This can live in metadata fields on runs, conversations or tasks and can be used later for analysis or retraining.
        </p>
      </section>

      {/* 10. Assistant Panel UI Behavior */}
      <section id="assistant-panel-ui-behavior" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">10. Assistant Panel UI Behavior</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The UI of the assistant panel is where users feel the system.  
          The behavior must be predictable and should make the invisible routing, run planning and execution steps easy to understand.
        </p>

        <h3 className="text-lg font-semibold">10.1 Layout</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Left column inside the panel, agent list with avatars and short labels.</li>
          <li>Right area inside the panel, conversation feed and input box.</li>
          <li>Top context bar that shows the current project and tenant.</li>
          <li>Optional status strip or run cards for ongoing multi step runs and long running operations.</li>
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
          <li>Status entries styled as light system chips such as task created or executing.</li>
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
          <li>Planning, Hans is creating a multi step run.</li>
          <li>Executing, one or more tasks are being sent to or processed by external systems.</li>
          <li>Validating, Supervisor is checking the result before answering.</li>
        </ul>
      </section>

      {/* 11. Error Handling and Recovery */}
      <section id="error-handling-and-recovery" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">11. Error Handling and Recovery</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Errors are inevitable. The system must handle them in a way that is safe and understandable.
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
          <li>Explain the failure in simple terms without technical overload.</li>
          <li>Whenever possible propose a recovery path in the same message.</li>
          <li>Log enough detail server side so the problem can be reproduced.</li>
          <li>For irreversible actions, always respect the law of no return with explicit confirmation before execution.</li>
        </ul>

        <h3 className="text-lg font-semibold">11.3 Example error responses</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`Example user facing response:

I tried to create the new page in WordPress but the site returned a permission error.
This usually means the API credentials are missing or invalid.
Here is what we can do next.
I can help you verify or update the credentials in the project settings then we can try again.`}
        </pre>
      </section>

      {/* 12. API Contracts */}
      <section id="api-contracts" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">12. API Contracts</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system exposes at least two main API routes.  
          The chat route handles conversational interactions and routing.  
          The execution route handles tasks and integration with external platforms.
        </p>

        <h3 className="text-lg font-semibold">12.1 Chat route</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`POST /api/assistant/chat

Request body:

{
  "conversationId": "uuid or null",
  "messages": [
    {
      "role": "user",
      "content": "string"
    },
    {
      "role": "assistant",
      "content": "string"
    }
  ],
  "activeAgentId": "chief",
  "projectContext": {
    "projectId": "uuid",
    "projectName": "string",
    "projectDomain": "string",
    "cmsPlatform": "wordpress"
  }
}

Response body:

{
  "conversationId": "uuid",
  "messages": [
    {
      "id": "uuid",
      "role": "assistant",
      "agentId": "webEngineer",
      "content": "Here is what I did..."
    }
  ],
  "routedAgentId": "webEngineer",
  "statusEvents": [
    {
      "kind": "routing",
      "summary": "Hans delegated this request to Web Engineer Nico"
    }
  ]
}`}
        </pre>

        <h3 className="text-lg font-semibold">12.2 Execution route</h3>
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
    "title": "New Service",
    "slug": "new-service",
    "contentHtml": "<h1>New Service</h1>..."
  },
  "summary": "Create service page called New Service"
}

Response body:

{
  "taskId": "uuid",
  "status": "completed",
  "details": {
    "cmsId": 1234,
    "url": "https://example.com/new-service"
  }
}`}
        </pre>
      </section>

      {/* 13. Database Schema */}
      <section id="database-schema" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">13. Database Schema</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system relies on a small set of tables that store runs, conversations, messages, tasks and optional agent definitions.
        </p>

        <h3 className="text-lg font-semibold">13.1 assistant_conversations</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`id             uuid primary key
tenant_id      uuid not null
user_id        uuid null
started_at     timestamptz not null default now()
closed_at      timestamptz null
active_flag    boolean not null default true
current_agent  text not null default 'chief'
metadata       jsonb not null default '{}'`}
        </pre>

        <h3 className="text-lg font-semibold">13.2 assistant_runs</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`id               uuid primary key
conversation_id uuid not null references assistant_conversations(id)
project_id      uuid null
created_by      text not null       -- usually 'chief'
title           text not null
status          text not null       -- 'planning', 'running', 'completed', 'failed', 'cancelled'
created_at      timestamptz not null default now()
updated_at      timestamptz not null default now()
metadata        jsonb not null default '{}'`}
        </pre>

        <h3 className="text-lg font-semibold">13.3 assistant_messages</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`id               uuid primary key
conversation_id uuid not null references assistant_conversations(id)
author          text not null       -- 'user' or 'assistant' or 'system'
agent_id        text null           -- which agent produced this message
kind            text not null       -- 'message' or 'status' or 'system'
content         text not null
created_at      timestamptz not null default now()
metadata        jsonb not null default '{}'`}
        </pre>

        <h3 className="text-lg font-semibold">13.4 assistant_tasks</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`id                       uuid primary key
run_id                   uuid not null references assistant_runs(id)
conversation_id          uuid not null references assistant_conversations(id)
project_id               uuid null
parent_task_id           uuid null references assistant_tasks(id)
step_group               text null          -- phase label for parallel groups
sequence_order           integer not null default 0
created_by               text not null      -- agent id
status                   text not null      -- 'open', 'in_progress', 'completed', 'failed', 'cancelled'
task_type                text not null
parameters               jsonb not null
summary                  text not null
is_reversible_by_system  boolean not null default true
irreversible_confirmed_at timestamptz null
created_at               timestamptz not null default now()
updated_at               timestamptz not null default now()
result                   jsonb null`}
        </pre>

        <h3 className="text-lg font-semibold">13.5 assistant_agent_definitions (optional)</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`id            uuid primary key
tenant_id     uuid null             -- null for global agent definitions
agent_id      text not null         -- 'chief', 'webEngineer', etc
display_name  text not null
role_summary  text not null
category      text not null         -- 'supervisor', 'lead', 'execution', 'utility'
visible       boolean not null default true
ordering      integer not null default 0
avatar        jsonb not null default '{}'
config        jsonb not null default '{}'`}
        </pre>
      </section>

      {/* 14. Implementation Patterns and Notes */}
      <section id="implementation-patterns-and-notes" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">14. Implementation Patterns and Notes</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          This section captures practical guidance for developers who work on the assistant system and its integration with the rest of AISTEAM.
        </p>

        <h3 className="text-lg font-semibold">14.1 Keep routing explicit</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Even when model based intent detection is used, keep a small routing helper in code that shows the final decision.  
          This makes debugging easier and allows Cursor agents to understand routing without full model introspection.
        </p>

        <h3 className="text-lg font-semibold">14.2 Use small, typed helpers</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Wrap common operations in small helpers such as loadConversation, buildProjectContext, createAssistantRun or createAssistantTask.  
          This keeps the main route handlers readable and reduces errors.
        </p>

        <h3 className="text-lg font-semibold">14.3 Avoid duplication of project context</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Project context should be built in one place and reused across the chat and execution routes.  
          When fields are added to project configuration, update the builder and not every route.
        </p>

        <h3 className="text-lg font-semibold">14.4 Align names across layers</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Agent ids, task types, run statuses and task statuses should have the same names in:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Database tables</li>
          <li>TypeScript enums or literal types</li>
          <li>Prompt and system instructions</li>
          <li>Front end strings where relevant</li>
        </ul>
      </section>

      {/* 15. Future Enhancements */}
      <section id="future-enhancements" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">15. Future Enhancements</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The current design is stable enough for first implementation.  
          Several enhancements are planned or expected as the platform grows.
        </p>

        <h3 className="text-lg font-semibold">15.1 Voice and real time sessions</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Streamed responses in the assistant panel.</li>
          <li>Live indication of active agent during a session.</li>
          <li>Ability to interrupt and redirect a running plan.</li>
        </ul>

        <h3 className="text-lg font-semibold">15.2 Richer intent detection</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Use a separate model call for complex routing decisions.</li>
          <li>Let the system propose a plan that spans multiple agents and tasks.</li>
          <li>Provide the user with a visible plan that they can approve or tweak.</li>
        </ul>

        <h3 className="text-lg font-semibold">15.3 Experience dashboards</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Show a history of assistant conversations, runs and tasks for each project.</li>
          <li>Visualize progress of automation over time.</li>
          <li>Surface common issues so that base configuration can be improved.</li>
        </ul>
      </section>

      {/* 16. Related Files and Integration Points */}
      <section id="related-files-and-integration-points" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">16. Related Files and Integration Points</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          This is the quick map of where the assistant system lives in the codebase and database.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>app/assistant/AssistantPanel.tsx, main UI component for the panel</li>
          <li>app/api/assistant/chat/route.ts, chat API route and routing logic</li>
          <li>app/api/assistant/execute/route.ts, execution API route</li>
          <li>supabase/migrations/assistant_conversations.sql, conversations table</li>
          <li>supabase/migrations/assistant_runs.sql, runs table</li>
          <li>supabase/migrations/assistant_messages.sql, messages table</li>
          <li>supabase/migrations/assistant_tasks.sql, tasks table</li>
          <li>supabase/migrations/assistant_agent_definitions.sql, optional agent catalog</li>
          <li>Any CMS or ecommerce integration modules used by the execution API</li>
        </ul>
      </section>
    </div>
  );
}
