"use client";

export default function KBAgentsPage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-800 space-y-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        AI Agent System Documentation
      </h1>

      <p className="text-sm leading-relaxed max-w-3xl">
        This document describes the AISTEAM agent system architecture with a
        focus on the centralized assistant panel, the Supervisor pattern, and
        how multiple agents coordinate to execute real work for projects. It is
        intended as a reference for back end, front end, and product decisions
        related to the assistant and its agents.
      </p>

      {/* Contents */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Contents</h2>
        <ol className="list-decimal ml-6 space-y-1 text-sm">
          <li>
            <a href="#overview" className="text-blue-600 hover:text-blue-800 hover:underline">
              Overview
            </a>
          </li>
          <li>
            <a href="#central-agent-panel" className="text-blue-600 hover:text-blue-800 hover:underline">
              Central Agent Panel
            </a>
          </li>
          <li>
            <a href="#agent-hierarchy-and-types" className="text-blue-600 hover:text-blue-800 hover:underline">
              Agent Hierarchy and Types
            </a>
          </li>
          <li>
            <a href="#agent-catalog" className="text-blue-600 hover:text-blue-800 hover:underline">
              Agent Catalog
            </a>
          </li>
          <li>
            <a href="#assistant-chat-and-agent-selection" className="text-blue-600 hover:text-blue-800 hover:underline">
              Assistant Chat and Agent Selection
            </a>
          </li>
          <li>
            <a href="#task-flow-from-user-request-to-execution" className="text-blue-600 hover:text-blue-800 hover:underline">
              Task Flow from User Request to Execution
            </a>
          </li>
          <li>
            <a href="#supervisor-decision-process" className="text-blue-600 hover:text-blue-800 hover:underline">
              Supervisor Decision Process
            </a>
          </li>
          <li>
            <a href="#agent-routing-logic" className="text-blue-600 hover:text-blue-800 hover:underline">
              Agent Routing Logic
            </a>
          </li>
          <li>
            <a href="#project-context-and-information" className="text-blue-600 hover:text-blue-800 hover:underline">
              Project Context and Information
            </a>
          </li>
          <li>
            <a href="#task-execution" className="text-blue-600 hover:text-blue-800 hover:underline">
              Task Execution
            </a>
          </li>
          <li>
            <a href="#api-structure" className="text-blue-600 hover:text-blue-800 hover:underline">
              API Structure
            </a>
          </li>
          <li>
            <a href="#database-schema" className="text-blue-600 hover:text-blue-800 hover:underline">
              Database Schema
            </a>
          </li>
          <li>
            <a href="#workflow-logic" className="text-blue-600 hover:text-blue-800 hover:underline">
              Workflow Logic
            </a>
          </li>
          <li>
            <a href="#related-files" className="text-blue-600 hover:text-blue-800 hover:underline">
              Related Files
            </a>
          </li>
        </ol>
      </section>

      {/* Overview */}
      <section id="overview" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The AISTEAM agent system is built around a Supervisor pattern combined
          with a centralized agent panel. The Chief AI Officer, also called
          Hans, acts as the central coordinator. All user requests start in the
          assistant chat, which is visually tied to the agent panel. The system
          can:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Receive user messages through a single assistant panel</li>
          <li>Assign an active agent for each conversation</li>
          <li>Load project context and client settings automatically</li>
          <li>Route tasks to the correct execution agents</li>
          <li>Execute structured tasks through the execution API</li>
          <li>Store conversations and tasks for later review</li>
        </ul>
        <p className="text-sm leading-relaxed max-w-3xl">
          Core principle: all non supervisor agents are execution agents. They
          actually perform work such as creating pages, updating content, and
          running workflows. The supervisor coordinates these agents and
          validates results.
        </p>
      </section>

      {/* Central Agent Panel */}
      <section id="central-agent-panel" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">Central Agent Panel</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          AISTEAM uses a single centralized assistant panel instead of separate
          pages for each agent. The panel is available globally in the
          application and acts as the cockpit for all AI powered work.
        </p>
        <h3 className="text-lg font-semibold">Panel goals</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Expose all relevant agents for the current tenant or project</li>
          <li>Let the user choose which agent is currently active</li>
          <li>Display a persistent conversation for the selected context</li>
          <li>Show routing information such as which agent handled a reply</li>
          <li>Act as the primary entry point into the AI system</li>
        </ul>
        <h3 className="text-lg font-semibold">Panel structure</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>
            Agent selector list containing supervisor, leads, and specialists
          </li>
          <li>
            Conversation area showing messages, status updates, and task
            confirmations
          </li>
          <li>
            Context header that indicates the project or tenant currently in
            focus
          </li>
          <li>
            Optional meta section that summarizes which agents participated in
            the thread
          </li>
        </ul>
        <p className="text-sm leading-relaxed max-w-3xl">
          The same panel is used whether the user is on the main dashboard, in a
          project view, on tickets, or in other modules. Context and routing
          adapt to the location and projectId.
        </p>
      </section>

      {/* Agent Hierarchy and Types */}
      <section id="agent-hierarchy-and-types" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">Agent Hierarchy and Types</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Agents are organized into a clear hierarchy. This keeps the system
          understandable for users and predictable for developers.
        </p>

        <h3 className="text-lg font-semibold">Supervisor layer</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>
            Chief AI Officer Hans, primary brain and conversation owner for
            complex flows
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Lead layer</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Leads handle domains of responsibility and coordinate specialized
          work.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Delivery Lead</li>
          <li>Client Success Lead</li>
          <li>Creative Lead</li>
          <li>Growth Lead</li>
          <li>Technical Lead</li>
        </ul>

        <h3 className="text-lg font-semibold">Execution agents</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          These agents are the doers. They create content, perform web changes,
          and run actions through APIs.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Web Engineer Nico</li>
          <li>SEO Specialist</li>
          <li>Content and Copy Specialist</li>
          <li>Social and E marketing Specialist</li>
          <li>Sports Media Specialist</li>
          <li>Branding and Design Specialist</li>
          <li>E commerce Specialist</li>
        </ul>

        <h3 className="text-lg font-semibold">Utility agents</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Utility agents help with orchestration, scheduling, and research.
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Research Agent</li>
          <li>Scheduler and Calendar Agent</li>
          <li>File and Knowledge Agent</li>
          <li>Automation Agent</li>
          <li>Notification Agent</li>
        </ul>
      </section>

      {/* Agent Catalog */}
      <section id="agent-catalog" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">Agent Catalog</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          This section documents each core agent, the type of work they perform,
          and how developers should think about routing tasks to them. In
          practice, the exact list of active agents can be configured per tenant
          or project through Supabase configuration.
        </p>

        <h3 className="text-lg font-semibold">Chief AI Officer Hans, Supervisor</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Primary coordinator for all user conversations</li>
          <li>First recipient of every message in the assistant chat</li>
          <li>Decides whether to answer directly or call another agent</li>
          <li>
            Validates and refines outputs from execution agents before sending
            back to the user
          </li>
          <li>
            Responsible for multi step plans that involve several agents and
            panels
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Delivery Lead Selena</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Project management and delivery coordination</li>
          <li>Helps translate messy user intent into structured tasks</li>
          <li>Assists with timelines, priorities, and scope</li>
          <li>Coordinates follow up actions and status updates</li>
        </ul>

        <h3 className="text-lg font-semibold">Client Success Lead</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Focus on client relationships and goals</li>
          <li>Helps define objectives and success metrics</li>
          <li>Surfaces opportunities based on project and ticket data</li>
        </ul>

        <h3 className="text-lg font-semibold">Creative Lead Mak</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Owns brand voice, visual identity, and creative direction</li>
          <li>Helps define layout ideas and content frameworks</li>
          <li>
            Works together with Web Engineer and Growth on experiences that
            convert
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Growth Lead Dana</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Responsible for traffic, leads, and revenue growth</li>
          <li>SEO and E marketing strategy for each project</li>
          <li>
            Coordinates with analytics, campaigns, and reporting panels in the
            app
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Technical Lead</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Architecture, integrations, and technical decisions</li>
          <li>Hosting, performance, and security guidance</li>
          <li>
            Works closely with Web Engineer and Automation Agent for deep
            technical work
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Web Engineer Nico</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Execution agent for web and CMS tasks</li>
          <li>Creates and updates pages, posts, menus, and settings</li>
          <li>Works with WordPress, WooCommerce, Shopify, and other platforms</li>
          <li>
            Consumes project context instead of asking the user for basic site
            information
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Other Execution and Utility Agents</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Additional agents such as SEO Specialist, E commerce Specialist, and
          Notification Agent follow the same model. Each has a concise mandate,
          default tools, and expected task types. Their full definitions live in
          database configuration rather than being hard coded in the UI.
        </p>
      </section>

      {/* Assistant Chat and Agent Selection */}
      <section id="assistant-chat-and-agent-selection" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">
          Assistant Chat and Agent Selection
        </h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The right side assistant chat is always visible when the assistant
          panel is open. The user interacts through one text area, but the
          system can change which agent actually responds.
        </p>

        <h3 className="text-lg font-semibold">Conversation ownership</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>
            Every conversation in the database tracks a current agent field,
            such as chief or webEngineer
          </li>
          <li>
            The user can explicitly select an agent in the panel to change this
            field
          </li>
          <li>
            The Supervisor can override the selection when routing is clearly
            better handled elsewhere
          </li>
        </ul>

        <h3 className="text-lg font-semibold">UI behavior</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>
            Selecting an agent in the panel updates the agentId sent to the chat
            API
          </li>
          <li>
            The conversation history remains continuous, but message meta can
            record which agent authored each reply
          </li>
          <li>
            The panel can show the current active agent and any routing decisions
            taken by the Supervisor
          </li>
        </ul>
      </section>

      {/* Task Flow */}
      <section id="task-flow-from-user-request-to-execution" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">
          Task Flow from User Request to Execution
        </h2>

        <h3 className="text-lg font-semibold">Step 1, User submits request</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The user types a message in the assistant panel. This message, along
          with conversation history and optional project context, is sent to
          the chat API at the route for assistant chat.
        </p>

        <h3 className="text-lg font-semibold">
          Step 2, Active agent and Supervisor receive the message
        </h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The chat API receives the current agentId from the panel. The system
          then:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Normalizes the message and loads the conversation record</li>
          <li>Loads the current project context if projectId is available</li>
          <li>
            Invokes Supervisor logic to decide whether to keep the active agent,
            reroute the message, or answer directly
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Step 3, Project context loading</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          When the user is on a project page, the system:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Detects projectId from the URL using Next navigation</li>
          <li>Fetches project data from the projects table</li>
          <li>
            Collects key information such as name, domain, CMS platform, CMS
            URL, and custom settings
          </li>
          <li>Builds a system prompt segment that describes the project</li>
        </ul>
        <p className="text-sm leading-relaxed max-w-3xl">
          Agents are instructed to use this information and only ask for
          missing details that are strictly required for the current task.
        </p>

        <h3 className="text-lg font-semibold">Step 4, Routing and delegation</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The Supervisor decides which agent should be responsible for the
          current message. There are three basic outcomes:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>The supervisor answers directly and remains the active agent</li>
          <li>
            The request is delegated to a specific agent such as Web Engineer or
            Growth Lead
          </li>
          <li>
            The request is broken into multiple tasks that involve several
            agents, with the supervisor orchestrating the sequence
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Step 5, Agent processing</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          The chosen agent receives:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Conversation history, usually the last few messages</li>
          <li>Project context when available</li>
          <li>
            Additional agent specific instructions regarding tools and limits
          </li>
        </ul>
        <p className="text-sm leading-relaxed max-w-3xl">
          The agent then decides whether the task requires actual execution or
          only advisory work. For execution, the agent calls the execute API
          through a structured function call.
        </p>

        <h3 className="text-lg font-semibold">Step 6, Task execution</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          For tasks that require action on a site or system, the agent calls an
          execute function in its tool set. Conceptually it looks similar to
          this:
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`{
  "name": "execute_task",
  "arguments": {
    "task_type": "create_page",
    "parameters": {
      "title": "About Us",
      "content": "...",
      "cms": "wordpress"
    },
    "message": "Creating new WordPress page in the project CMS"
  }
}`}
        </pre>
        <p className="text-sm leading-relaxed max-w-3xl">
          The back end route that handles execution then uses Supabase and CMS
          integrations to perform the requested change or to queue a task for
          later execution.
        </p>

        <h3 className="text-lg font-semibold">Step 7, Response generation</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Once execution completes or is queued, the agent produces a human
          readable explanation. The Supervisor validates this response and sends
          the final message back to the user, optionally with a summary of
          actions taken and any next steps.
        </p>
      </section>

      {/* Supervisor Decision Process */}
      <section id="supervisor-decision-process" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">Supervisor Decision Process</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          For each user request, the Supervisor follows a repeatable process:
        </p>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>Receive the message and identify the conversation</li>
          <li>Analyze intent based on message content and history</li>
          <li>
            Load project data and any relevant tenant or business context
          </li>
          <li>
            Decide whether the request is strategic, execution focused, or mixed
          </li>
          <li>Route to the correct agent or handle directly</li>
          <li>Optionally break the work into a plan with multiple steps</li>
          <li>Validate any agent output before it reaches the user</li>
        </ol>
      </section>

      {/* Agent Routing Logic */}
      <section id="agent-routing-logic" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">Agent Routing Logic</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Routing is currently based on a combination of explicit selection in
          the panel and keyword based logic in the back end. The assistant chat
          route contains a helper that can adjust the routed agent based on the
          content of the latest message.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`function determineAgent(
  userMessage: string,
  currentAgent: string
): string {
  const message = userMessage.toLowerCase();

  // Explicit mentions of leads
  if (message.includes("delivery") || message.includes("selena")) {
    return "deliveryLead";
  }
  if (message.includes("client") || message.includes("account")) {
    return "clientSuccess";
  }
  if (message.includes("brand") || message.includes("creative") || message.includes("mak")) {
    return "creativeLead";
  }
  if (message.includes("seo") || message.includes("marketing") || message.includes("dana")) {
    return "growthLead";
  }
  if (message.includes("tech") || message.includes("system") || message.includes("hosting")) {
    return "technicalLead";
  }
  if (
    message.includes("web") ||
    message.includes("code") ||
    message.includes("build") ||
    message.includes("implement") ||
    message.includes("page") ||
    message.includes("post")
  ) {
    return "webEngineer";
  }

  // Default to current selection or supervisor
  return currentAgent || "chief";
}`}
        </pre>
        <p className="text-sm leading-relaxed max-w-3xl">
          In the future this routing can be enhanced with intent detection using
          the AI model itself, but the above approach keeps behavior predictable
          and debuggable.
        </p>
      </section>

      {/* Project Context and Information */}
      <section id="project-context-and-information" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">Project Context and Information</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          When a user opens the assistant while on a project page, the system
          automatically attaches project context to each request. This avoids
          repeated questions and keeps agent responses grounded in real data.
        </p>
        <h3 className="text-lg font-semibold">Included project data</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Project name</li>
          <li>Main domain and any secondary domains</li>
          <li>CMS platform and access URL</li>
          <li>Key configuration values in custom data fields</li>
          <li>Any important tags such as ecommerce, membership, or media site</li>
        </ul>
        <p className="text-sm leading-relaxed max-w-3xl">
          Agents receive a clear instruction: use this project information first
          and do not ask the user for details that the system already knows.
        </p>
      </section>

      {/* Task Execution */}
      <section id="task-execution" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">Task Execution</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          Execution agents use structured tasks to interact with external
          systems. Tasks are stored in the database so that they can be audited
          or replayed.
        </p>
        <h3 className="text-lg font-semibold">Supported task types</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Create or update pages and posts in CMS platforms</li>
          <li>Create or update products in ecommerce systems</li>
          <li>Update content or media metadata</li>
          <li>Create structured tasks and tickets in AISTEAM panels</li>
        </ul>
        <p className="text-sm leading-relaxed max-w-3xl">
          The execute API receives a taskType string, parameters object,
          projectId, and conversationId. This keeps the execution layer decoupled
          from the conversational logic while still traceable.
        </p>
      </section>

      {/* API Structure */}
      <section id="api-structure" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">API Structure</h2>

        <h3 className="text-lg font-semibold">Assistant chat route</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Main endpoint that handles chat interactions and coordinates routing.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`POST /api/assistant/chat

Request:

{
  "messages": [...],
  "agentId": "chief",
  "projectContext": {
    "projectId": "uuid",
    "projectName": "string",
    "projectDomain": "string"
  }
}

Response:

{
  "message": "AI response text",
  "routedAgent": "webEngineer",
  "executedTask": {...},
  "usage": {...}
}`}
        </pre>

        <h3 className="text-lg font-semibold">Execution route</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Endpoint used by agents to execute structured tasks.
        </p>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`POST /api/assistant/execute

Request:

{
  "taskType": "create_page",
  "parameters": {...},
  "projectId": "uuid",
  "conversationId": "uuid"
}`}
        </pre>
      </section>

      {/* Database Schema */}
      <section id="database-schema" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">Database Schema</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The assistant system uses dedicated tables to store conversations,
          messages, and tasks. Agent related configuration can live either in a
          specific agent definition table or inside JSON configuration for the
          tenant.
        </p>

        <h3 className="text-lg font-semibold">assistant_conversations</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`id             uuid primary key
tenant_id      uuid
user_id        uuid
started_at     timestamptz
closed_at      timestamptz
active_flag    boolean
metadata       jsonb
current_agent  text default 'chief'`}
        </pre>

        <h3 className="text-lg font-semibold">assistant_messages</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`id               uuid primary key
conversation_id uuid references assistant_conversations
author           text            -- 'user' or 'agent'
agent_id         text            -- which agent produced the message
kind             text            -- 'text' or 'status' or 'form'
text             text
created_at       timestamptz`}
        </pre>

        <h3 className="text-lg font-semibold">assistant_tasks</h3>
        <pre className="bg-slate-900 text-slate-100 text-xs rounded p-4 overflow-x-auto">
          {`id               uuid primary key
conversation_id  uuid references assistant_conversations
status           text            -- 'open', 'in_progress', 'completed', 'cancelled'
action           text
target           text
intent           text
priority         text            -- 'low', 'medium', 'high', 'urgent'
notes            text
created_at       timestamptz
updated_at       timestamptz`}
        </pre>

        <h3 className="text-lg font-semibold">Optional agent definitions</h3>
        <p className="text-sm leading-relaxed max-w-3xl">
          Agent definitions can be stored in a dedicated table such as
          assistant_agent_definitions or inside tenant configuration JSON. A
          typical record would include:
        </p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Agent identifier such as chief or webEngineer</li>
          <li>Display name and avatar configuration</li>
          <li>Role description and capabilities</li>
          <li>Default tools and allowed task types</li>
          <li>Ordering and visibility flags in the panel</li>
        </ul>
      </section>

      {/* Workflow Logic */}
      <section id="workflow-logic" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">Workflow Logic</h2>
        <p className="text-sm leading-relaxed max-w-3xl">
          The workflow logic for the AISTEAM assistant system is documented in detail in a separate comprehensive reference document. This document, called the "Assistant System Bible", covers the complete architecture, message lifecycle, routing decisions, validation rules, execution model, and implementation patterns.
        </p>
        <p className="text-sm leading-relaxed max-w-3xl">
          The workflow document is essential reading for developers working on the assistant system, as it provides the source of truth for how the system behaves at every level.
        </p>
        <div className="mt-4">
          <a 
            href="/kb/agents/workflow" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Read the Assistant System Bible →
          </a>
        </div>
        <h3 className="text-lg font-semibold mt-6">Key Topics Covered</h3>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>Message lifecycle and experience timeline</li>
          <li>Agent selection and routing logic</li>
          <li>Validation and escalation rules</li>
          <li>Project context and scoping</li>
          <li>Execution model and task contracts</li>
          <li>Logging and experience tracking</li>
          <li>UI behavior and error handling</li>
          <li>API contracts and database schema</li>
          <li>Implementation patterns and best practices</li>
        </ul>
      </section>

      {/* Related Files */}
      <section id="related-files" className="space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">Related Files</h2>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>app/api/assistant/chat/route.ts, main chat API and routing</li>
          <li>app/api/assistant/execute/route.ts, task execution API</li>
          <li>app/assistant/AssistantPanel.tsx, centralized agent panel UI</li>
          <li>app/assistant/AssistantProvider.tsx, assistant state management</li>
          <li>app/assistant/supervisor/ChiefAIOfficer.tsx, supervisor logic</li>
          <li>supabase/migrations/assistant_schema.sql, database schema</li>
          <li>
            Optional, supabase/migrations/assistant_agent_definitions.sql for
            agent catalog
          </li>
        </ul>
      </section>
    </div>
  );
}
