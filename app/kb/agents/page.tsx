"use client";

export default function AgentsDocPage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-800 space-y-10">

      <h1 className="text-3xl font-bold mb-4">
        AI Agents System Documentation
      </h1>

      <p className="text-sm leading-relaxed max-w-3xl">
        This document describes the AISTEAM agent system architecture, focusing on how the Supervisor (Hans) 
        receives tasks, understands them, and assigns them to the appropriate execution agents. The system 
        uses a Supervisor pattern where all user requests flow through the Chief AI Officer who coordinates 
        task execution across specialized agents.
      </p>

      {/* TABLE OF CONTENTS */}
      <section id="contents">
        <h2 className="text-xl font-semibold mb-3">Contents</h2>

        <ul className="ml-4 list-disc text-sm space-y-2">
          <li><a href="#overview" className="text-blue-600 hover:underline">Overview</a></li>
          <li><a href="#supervisor-pattern" className="text-blue-600 hover:underline">Supervisor Pattern</a></li>
          <li><a href="#task-flow" className="text-blue-600 hover:underline">Task Flow: From User Request to Execution</a></li>
          <li><a href="#supervisor-process" className="text-blue-600 hover:underline">Supervisor Decision Process</a></li>
          <li><a href="#agent-routing" className="text-blue-600 hover:underline">Agent Routing Logic</a></li>
          <li><a href="#agent-types" className="text-blue-600 hover:underline">Agent Types and Responsibilities</a></li>
          <li><a href="#project-context" className="text-blue-600 hover:underline">Project Context and Information</a></li>
          <li><a href="#task-execution" className="text-blue-600 hover:underline">Task Execution</a></li>
          <li><a href="#api-structure" className="text-blue-600 hover:underline">API Structure</a></li>
          <li><a href="#database" className="text-blue-600 hover:underline">Database Schema</a></li>
          <li><a href="#related" className="text-blue-600 hover:underline">Related Files</a></li>
        </ul>
      </section>

      {/* OVERVIEW */}
      <section id="overview">
        <h2 className="text-xl font-semibold mb-3">Overview</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-4">
          The AISTEAM agent system is built on a Supervisor pattern where the Chief AI Officer (Hans) acts as 
          the central coordinator. All user requests are first processed by the Supervisor, who:
        </p>

        <ul className="ml-6 list-disc text-sm space-y-2 max-w-3xl">
          <li>Evaluates the nature and requirements of the task</li>
          <li>Loads relevant project information and client settings</li>
          <li>Identifies which specialized agent should handle the work</li>
          <li>Routes the task to the appropriate execution agent</li>
          <li>Validates results before they reach the user</li>
          <li>Coordinates multi-step workflows involving multiple agents</li>
        </ul>

        <p className="text-sm leading-relaxed max-w-3xl mt-4">
          <strong>Critical Principle:</strong> All agents are EXECUTION AGENTS. They actually perform tasks 
          (create pages, update content, execute workflows), not just provide guidance or instructions.
        </p>
      </section>

      {/* SUPERVISOR PATTERN */}
      <section id="supervisor-pattern">
        <h2 className="text-xl font-semibold mb-3">Supervisor Pattern</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-4">
          The system uses a hierarchical Supervisor pattern where:
        </p>

        <div className="bg-slate-50 p-4 rounded-lg mb-4 max-w-3xl">
          <pre className="text-xs text-slate-800 whitespace-pre-wrap">
{`User Request
    ↓
Chief AI Officer (Hans) - Supervisor
    ├─ Evaluates task
    ├─ Loads project context
    ├─ Determines routing
    └─ Assigns to agent
         ↓
    Specialized Agent
    ├─ Web Engineer (Nico)
    ├─ Delivery Lead (Selena)
    ├─ Client Success Lead
    ├─ Creative Specialist (Mak)
    ├─ Growth Specialist (Dana)
    └─ Tech Specialist
         ↓
    Task Execution
    ├─ API calls
    ├─ CMS integration
    └─ Database updates
         ↓
    Results validated by Supervisor
         ↓
    Response to User`}
          </pre>
        </div>

        <p className="text-sm leading-relaxed max-w-3xl">
          The Supervisor is the only agent that communicates directly with the user (unless explicitly delegated). 
          All other agents communicate through the Supervisor, ensuring consistent validation and coordination.
        </p>
      </section>

      {/* TASK FLOW */}
      <section id="task-flow">
        <h2 className="text-xl font-semibold mb-3">Task Flow: From User Request to Execution</h2>

        <div className="space-y-4 max-w-3xl">
          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="font-semibold text-sm mb-2">Step 1: User Submits Request</h3>
            <p className="text-sm text-slate-700">
              User types a message in the assistant panel (e.g., "I would like to add a new page to my website").
              The request is sent to <code className="bg-slate-100 px-1 rounded">/api/assistant/chat</code> with 
              the conversation history and project context.
            </p>
          </div>

          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="font-semibold text-sm mb-2">Step 2: Supervisor Receives and Analyzes</h3>
            <p className="text-sm text-slate-700 mb-2">
              The Chief AI Officer (Hans) receives the request and:
            </p>
            <ul className="ml-4 list-disc text-sm text-slate-700 space-y-1">
              <li>Analyzes the intent and nature of the task</li>
              <li>Extracts key information from the user message</li>
              <li>Checks if project context is available (projectId from URL)</li>
              <li>Fetches full project information from database if projectId exists</li>
            </ul>
          </div>

          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="font-semibold text-sm mb-2">Step 3: Project Context Loading</h3>
            <p className="text-sm text-slate-700 mb-2">
              If a projectId is detected (user is on a project page), the system automatically:
            </p>
            <ul className="ml-4 list-disc text-sm text-slate-700 space-y-1">
              <li>Fetches project data from <code className="bg-slate-100 px-1 rounded">projects</code> table</li>
              <li>Retrieves: CMS type, domain, CMS URL, project name, custom settings</li>
              <li>Includes this information in the agent's system prompt</li>
              <li>Agents are instructed to use this information and NOT ask for it</li>
            </ul>
          </div>

          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="font-semibold text-sm mb-2">Step 4: Agent Routing Decision</h3>
            <p className="text-sm text-slate-700 mb-2">
              The Supervisor uses keyword-based routing logic to determine which agent should handle the task:
            </p>
            <ul className="ml-4 list-disc text-sm text-slate-700 space-y-1">
              <li><strong>Web Engineer:</strong> "web", "code", "build", "implement", "page", "post"</li>
              <li><strong>Delivery Lead:</strong> "delivery", "project management", "selena"</li>
              <li><strong>Client Success:</strong> "client", "account", "relationship"</li>
              <li><strong>Creative Specialist:</strong> "brand", "creative", "design", "mak"</li>
              <li><strong>Growth Specialist:</strong> "seo", "marketing", "growth", "dana"</li>
              <li><strong>Tech Specialist:</strong> "tech", "system", "infrastructure", "hosting"</li>
            </ul>
            <p className="text-sm text-slate-700 mt-2">
              If no match is found, the Supervisor handles the request directly.
            </p>
          </div>

          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="font-semibold text-sm mb-2">Step 5: Task Delegation</h3>
            <p className="text-sm text-slate-700 mb-2">
              The Supervisor routes the request to the selected agent with:
            </p>
            <ul className="ml-4 list-disc text-sm text-slate-700 space-y-1">
              <li>Full conversation history (last 15 messages)</li>
              <li>Complete project context (if available)</li>
              <li>Enhanced system prompt with project information</li>
              <li>Instructions to execute tasks, not just provide guidance</li>
            </ul>
          </div>

          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="font-semibold text-sm mb-2">Step 6: Agent Processing</h3>
            <p className="text-sm text-slate-700 mb-2">
              The specialized agent:
            </p>
            <ul className="ml-4 list-disc text-sm text-slate-700 space-y-1">
              <li>Reviews the project information provided</li>
              <li>Only asks for information that is truly missing</li>
              <li>Uses project context (CMS, domain, settings) automatically</li>
              <li>Determines if task execution is needed</li>
              <li>If execution is required, calls the <code className="bg-slate-100 px-1 rounded">execute_task</code> function</li>
            </ul>
          </div>

          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="font-semibold text-sm mb-2">Step 7: Task Execution</h3>
            <p className="text-sm text-slate-700 mb-2">
              If the agent determines a task should be executed:
            </p>
            <ul className="ml-4 list-disc text-sm text-slate-700 space-y-1">
              <li>Agent calls OpenAI function <code className="bg-slate-100 px-1 rounded">execute_task</code></li>
              <li>System calls <code className="bg-slate-100 px-1 rounded">/api/assistant/execute</code></li>
              <li>Execution API fetches project data and CMS information</li>
              <li>Task is executed (or queued for execution with CMS APIs)</li>
              <li>Structured task is created in <code className="bg-slate-100 px-1 rounded">assistant_tasks</code> table</li>
              <li>Result is returned to the agent</li>
            </ul>
          </div>

          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="font-semibold text-sm mb-2">Step 8: Response Generation</h3>
            <p className="text-sm text-slate-700 mb-2">
              After task execution (or if no execution is needed):
            </p>
            <ul className="ml-4 list-disc text-sm text-slate-700 space-y-1">
              <li>Agent generates a response explaining what was done</li>
              <li>If task was executed, response includes execution results</li>
              <li>Response is returned to the Supervisor</li>
              <li>Supervisor validates the response</li>
              <li>Final response is sent to the user</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SUPERVISOR PROCESS */}
      <section id="supervisor-process">
        <h2 className="text-xl font-semibold mb-3">Supervisor Decision Process</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-4">
          The Supervisor (Hans) follows a structured decision process for every user request:
        </p>

        <ol className="ml-6 list-decimal text-sm space-y-3 max-w-3xl">
          <li>
            <strong>Receive task from user</strong>
            <p className="text-slate-700 mt-1">User message arrives with conversation history and project context.</p>
          </li>
          <li>
            <strong>Identify the nature of the request</strong>
            <p className="text-slate-700 mt-1">Analyze keywords, intent, and context to understand what the user wants.</p>
          </li>
          <li>
            <strong>Load client's tech stack profile and preferences</strong>
            <p className="text-slate-700 mt-1">If projectId is available, fetch full project data including CMS, domain, and settings.</p>
          </li>
          <li>
            <strong>Break work into steps and assign to right specialists</strong>
            <p className="text-slate-700 mt-1">Use routing logic to determine which agent should handle the task. For complex tasks, may involve multiple agents.</p>
          </li>
          <li>
            <strong>Agents execute the tasks</strong>
            <p className="text-slate-700 mt-1">Specialized agents actually perform the work (create pages, update content, etc.) using APIs and integrations.</p>
          </li>
          <li>
            <strong>Validate results and communicate back to user</strong>
            <p className="text-slate-700 mt-1">Supervisor reviews agent output, ensures quality, and presents results to the user in a clear, professional manner.</p>
          </li>
        </ol>
      </section>

      {/* AGENT ROUTING */}
      <section id="agent-routing">
        <h2 className="text-xl font-semibold mb-3">Agent Routing Logic</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-4">
          The routing logic is implemented in the <code className="bg-slate-100 px-1 rounded">determineAgent()</code> function 
          in <code className="bg-slate-100 px-1 rounded">app/api/assistant/chat/route.ts</code>.
        </p>

        <div className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-4 overflow-x-auto max-w-3xl">
          <pre>{`function determineAgent(userMessage: string, currentAgent: string): string {
  const message = userMessage.toLowerCase();
  
  // Explicit agent mentions take priority
  if (message.includes("delivery") || message.includes("selena")) {
    return "deliveryLead";
  }
  if (message.includes("client") || message.includes("account")) {
    return "clientSuccess";
  }
  if (message.includes("brand") || message.includes("creative") || message.includes("mak")) {
    return "creative";
  }
  if (message.includes("seo") || message.includes("marketing") || message.includes("dana")) {
    return "growth";
  }
  if (message.includes("tech") || message.includes("system") || message.includes("hosting")) {
    return "tech";
  }
  if (message.includes("web") || message.includes("code") || message.includes("build") || 
      message.includes("implement") || message.includes("page") || message.includes("post")) {
    return "webEngineer";
  }
  
  // Default to Supervisor
  return currentAgent || "chief";
}`}</pre>
        </div>

        <p className="text-sm leading-relaxed max-w-3xl">
          <strong>Note:</strong> The routing is keyword-based and can be enhanced with more sophisticated 
          intent detection using the AI model itself. Currently, it provides fast, predictable routing 
          for common task types.
        </p>
      </section>

      {/* AGENT TYPES */}
      <section id="agent-types">
        <h2 className="text-xl font-semibold mb-3">Agent Types and Responsibilities</h2>

        <div className="space-y-4 max-w-3xl">
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2 text-indigo-600">Chief AI Officer (Hans) - Supervisor</h3>
            <p className="text-xs text-slate-700 mb-2">
              Central coordinator and the only agent that speaks directly to users.
            </p>
            <ul className="ml-4 list-disc text-xs text-slate-700 space-y-1">
              <li>Evaluates and routes all incoming tasks</li>
              <li>Loads project context and client settings</li>
              <li>Validates all outputs before they reach users</li>
              <li>Coordinates multi-agent workflows</li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2 text-emerald-600">Delivery Lead (Selena)</h3>
            <p className="text-xs text-slate-700 mb-2">
              Project Manager handling communication, admin work, and workflow coordination.
            </p>
            <ul className="ml-4 list-disc text-xs text-slate-700 space-y-1">
              <li>Organizes information and handles notifications</li>
              <li>Manages project workflows and task coordination</li>
              <li>Ensures work gets delivered on time</li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2 text-fuchsia-600">Web Engineer (Nico)</h3>
            <p className="text-xs text-slate-700 mb-2">
              <strong>EXECUTION AGENT</strong> - Actually performs web development tasks.
            </p>
            <ul className="ml-4 list-disc text-xs text-slate-700 space-y-1">
              <li>Creates pages, posts, and content on CMS platforms</li>
              <li>Executes development tasks via API calls</li>
              <li>Works with WordPress, Shopify, Webflow, etc.</li>
              <li>Uses project information automatically (CMS, domain, settings)</li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2 text-pink-600">Creative Specialist (Mak)</h3>
            <p className="text-xs text-slate-700 mb-2">
              Branding and Creative Director focusing on visual production and asset consistency.
            </p>
            <ul className="ml-4 list-disc text-xs text-slate-700 space-y-1">
              <li>Manages brand identity and visual consistency</li>
              <li>Creates design rules and guidelines</li>
              <li>Generates media metadata</li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2 text-sky-600">Growth Specialist (Dana)</h3>
            <p className="text-xs text-slate-700 mb-2">
              E Marketing and Growth Director focusing on SEO, campaigns, and analytics.
            </p>
            <ul className="ml-4 list-disc text-xs text-slate-700 space-y-1">
              <li>SEO optimization and marketing campaigns</li>
              <li>Performance analysis and growth strategies</li>
              <li>Newsletter and social content planning</li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2 text-slate-700">Tech Specialist</h3>
            <p className="text-xs text-slate-700 mb-2">
              Systems and infrastructure specialist.
            </p>
            <ul className="ml-4 list-disc text-xs text-slate-700 space-y-1">
              <li>Technical decisions and tool recommendations</li>
              <li>System architecture and troubleshooting</li>
              <li>Hosting integration and platform connections</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECT CONTEXT */}
      <section id="project-context">
        <h2 className="text-xl font-semibold mb-3">Project Context and Information</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-4">
          When a user is on a project page (URL contains <code className="bg-slate-100 px-1 rounded">/projects/[id]</code>), 
          the system automatically:
        </p>

        <ol className="ml-6 list-decimal text-sm space-y-2 max-w-3xl">
          <li>Detects the projectId from the URL using Next.js <code className="bg-slate-100 px-1 rounded">useParams()</code></li>
          <li>Passes projectId to the API in the <code className="bg-slate-100 px-1 rounded">projectContext</code> object</li>
          <li>API fetches full project data from the <code className="bg-slate-100 px-1 rounded">projects</code> table</li>
          <li>Project information is included in the agent's system prompt</li>
        </ol>

        <div className="bg-slate-50 p-4 rounded-lg mt-4 max-w-3xl">
          <h4 className="font-semibold text-xs mb-2">Project Information Included:</h4>
          <ul className="ml-4 list-disc text-xs text-slate-700 space-y-1">
            <li>Project Name</li>
            <li>Domain</li>
            <li>CMS Platform (WordPress, Shopify, Webflow, etc.)</li>
            <li>CMS URL</li>
            <li>Custom Settings (from <code className="bg-slate-200 px-1 rounded">custom_data</code> JSONB field)</li>
          </ul>
        </div>

        <p className="text-sm leading-relaxed max-w-3xl mt-4">
          <strong>Critical Instruction to Agents:</strong> Agents are explicitly told to use the project information 
          provided and NOT ask the user for information they already have. They should only ask for information that 
          is truly missing and required to execute the specific task.
        </p>
      </section>

      {/* TASK EXECUTION */}
      <section id="task-execution">
        <h2 className="text-xl font-semibold mb-3">Task Execution</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-4">
          Agents are EXECUTION AGENTS - they actually perform tasks, not just provide guidance. When an agent 
          determines a task should be executed:
        </p>

        <div className="bg-slate-900 text-slate-100 text-xs p-4 rounded mb-4 overflow-x-auto max-w-3xl">
          <pre>{`// Agent calls OpenAI function
{
  "name": "execute_task",
  "arguments": {
    "task_type": "create_page",
    "parameters": {
      "title": "About Us",
      "content": "...",
      "cms": "wordpress"
    },
    "message": "Creating new page on WordPress site"
  }
}`}</pre>
        </div>

        <p className="text-sm leading-relaxed max-w-3xl mb-4">
          The system then:
        </p>

        <ol className="ml-6 list-decimal text-sm space-y-2 max-w-3xl">
          <li>Calls <code className="bg-slate-100 px-1 rounded">/api/assistant/execute</code> with task details</li>
          <li>Execution API fetches project data and CMS information</li>
          <li>Task is executed (or structured for execution with CMS APIs)</li>
          <li>Structured task is saved to <code className="bg-slate-100 px-1 rounded">assistant_tasks</code> table</li>
          <li>Result is returned to the agent</li>
          <li>Agent generates a follow-up message explaining what was done</li>
        </ol>

        <div className="bg-slate-50 p-4 rounded-lg mt-4 max-w-3xl">
          <h4 className="font-semibold text-xs mb-2">Supported Task Types:</h4>
          <ul className="ml-4 list-disc text-xs text-slate-700 space-y-1">
            <li><code className="bg-slate-200 px-1 rounded">create_page</code> - Create a new page on the CMS</li>
            <li><code className="bg-slate-200 px-1 rounded">create_post</code> - Create a new post/article</li>
            <li><code className="bg-slate-200 px-1 rounded">update_content</code> - Update existing content</li>
            <li><code className="bg-slate-200 px-1 rounded">create_task</code> - Create a structured task in the database</li>
          </ul>
        </div>
      </section>

      {/* API STRUCTURE */}
      <section id="api-structure">
        <h2 className="text-xl font-semibold mb-3">API Structure</h2>

        <div className="space-y-4 max-w-3xl">
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">
              <code className="bg-slate-100 px-2 py-1 rounded text-xs">POST /api/assistant/chat</code>
            </h3>
            <p className="text-xs text-slate-700 mb-2">Main chat endpoint that handles all agent interactions.</p>
            <div className="bg-slate-50 p-3 rounded text-xs">
              <strong>Request:</strong>
              <pre className="mt-1">{`{
  "messages": [...],
  "agentId": "chief",
  "projectContext": {
    "projectId": "uuid",
    "projectName": "string",
    "projectDomain": "string"
  }
}`}</pre>
            </div>
            <div className="bg-slate-50 p-3 rounded text-xs mt-2">
              <strong>Response:</strong>
              <pre className="mt-1">{`{
  "message": "agent response text",
  "routedAgent": "webEngineer",
  "executedTask": {...},
  "usage": {...}
}`}</pre>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">
              <code className="bg-slate-100 px-2 py-1 rounded text-xs">POST /api/assistant/execute</code>
            </h3>
            <p className="text-xs text-slate-700 mb-2">Task execution endpoint called by agents to perform actions.</p>
            <div className="bg-slate-50 p-3 rounded text-xs">
              <strong>Request:</strong>
              <pre className="mt-1">{`{
  "taskType": "create_page",
  "parameters": {...},
  "projectId": "uuid",
  "conversationId": "uuid"
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* DATABASE */}
      <section id="database">
        <h2 className="text-xl font-semibold mb-3">Database Schema</h2>

        <p className="text-sm leading-relaxed max-w-3xl mb-4">
          The agent system uses several database tables to track conversations, messages, and tasks:
        </p>

        <div className="space-y-4 max-w-3xl">
          <div>
            <h3 className="text-lg font-semibold mb-1">assistant_conversations</h3>
            <p className="text-sm text-slate-700 mb-2">Stores assistant sessions for users.</p>
            <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded overflow-x-auto">
{`Columns:
  id            uuid primary key
  tenant_id     uuid
  user_id       uuid
  started_at    timestamptz
  closed_at     timestamptz
  active_flag   boolean
  metadata      jsonb
  current_agent text (default 'chief')`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">assistant_messages</h3>
            <p className="text-sm text-slate-700 mb-2">Stores every message in a conversation.</p>
            <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded overflow-x-auto">
{`Columns:
  id              uuid primary key
  conversation_id uuid (references assistant_conversations)
  author          text ('user' | 'agent')
  agent_id        text (agent identifier)
  kind            text ('text' | 'status' | 'form')
  text            text
  created_at      timestamptz`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">assistant_tasks</h3>
            <p className="text-sm text-slate-700 mb-2">Stores structured tasks created from conversations.</p>
            <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded overflow-x-auto">
{`Columns:
  id              uuid primary key
  conversation_id uuid (references assistant_conversations)
  status          text ('open' | 'in_progress' | 'completed' | 'cancelled')
  action          text
  target          text
  intent          text
  priority        text ('low' | 'medium' | 'high' | 'urgent')
  notes           text
  created_at      timestamptz
  updated_at      timestamptz`}
            </pre>
          </div>
        </div>
      </section>

      {/* RELATED FILES */}
      <section id="related">
        <h2 className="text-xl font-semibold mb-3">Related Files</h2>

        <ul className="ml-4 list-disc text-sm space-y-2 max-w-3xl">
          <li>
            <code className="bg-slate-100 px-1 rounded">app/api/assistant/chat/route.ts</code> - Main chat API with agent routing and OpenAI integration
          </li>
          <li>
            <code className="bg-slate-100 px-1 rounded">app/api/assistant/execute/route.ts</code> - Task execution API
          </li>
          <li>
            <code className="bg-slate-100 px-1 rounded">app/assistant/supervisor/ChiefAIOfficer.tsx</code> - Supervisor UI component
          </li>
          <li>
            <code className="bg-slate-100 px-1 rounded">app/assistant/AssistantProvider.tsx</code> - Assistant state management
          </li>
          <li>
            <code className="bg-slate-100 px-1 rounded">supabase/migrations/assistant_schema.sql</code> - Database schema
          </li>
        </ul>
      </section>

    </div>
  );
}
