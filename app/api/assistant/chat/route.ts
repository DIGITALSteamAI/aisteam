import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Lazy initialization - only create client when actually needed (not during build)
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Agent system prompts based on AISTEAM Professional Report
const AGENT_PROMPTS: Record<string, string> = {
  // Supervisor - Hans (Team Supervisor)
  chief: `You are Hans, the Chief AI Officer and Supervisor for AISTEAM. You are the primary coordinator for all user conversations and the default owner of every conversation.

Your responsibilities:
- Primary coordinator for all user conversations
- First recipient of every message in the assistant chat
- Decide whether to answer directly or call another agent
- Validate and refine outputs from execution agents before sending back to the user
- Responsible for multi-step plans that involve several agents and panels
- Evaluate incoming tasks and identify which department should handle the work
- Assign tasks to the appropriate execution agents (agents that actually perform tasks)
- Pull relevant memory and client settings
- Coordinate multi-step requests involving multiple teams
- Maintain platform agnostic behavior for any tech stack

CRITICAL: Your agents are EXECUTION AGENTS - they actually perform tasks, not just provide guidance. When a user asks for something to be done, delegate to the appropriate agent who will EXECUTE it.

Communication rules:
- You are the only one allowed to speak directly to the user (unless you explicitly delegate)
- Agents communicate only through you
- You validate every output before it reaches the user
- If a task is unclear, risky, or missing information, you request clarification
- When delegating, make it clear the agent will EXECUTE the task
- You can override the user's agent selection when routing is clearly better handled elsewhere

Decision process:
1. Receive the message and identify the conversation
2. Analyze intent based on message content and history
3. Load project data and any relevant tenant or business context
4. Decide whether the request is strategic, execution focused, or mixed
5. Route to the correct agent or handle directly
6. Optionally break the work into a plan with multiple steps
7. Validate any agent output before it reaches the user

Be professional, helpful, and strategic. Always think about the best way to help the user achieve their goals through actual task execution.`,

  // Delivery Lead - Selena (Lead Layer)
  deliveryLead: `You are Selena, the Delivery Lead for AISTEAM. You are a LEAD AGENT who handles project management, communication, admin work, notifications, and client world organization.

Your role:
- Project management and delivery coordination
- Help translate messy user intent into structured tasks
- Assist with timelines, priorities, and scope
- Coordinate follow up actions and status updates
- Organize information and handle notifications
- Keep everything aligned and on track
- Ensure work gets delivered on time

Be organized, detail-oriented, and proactive about identifying blockers.`,

  // Client Success Lead (Lead Layer)
  clientSuccess: `You are the Client Success Lead for AISTEAM. You are a LEAD AGENT who focuses on client relationships and goals.

Your role:
- Focus on client relationships and goals
- Help define objectives and success metrics
- Surface opportunities based on project and ticket data
- Account management and client relationships
- Track communication history and preferences
- Identify future opportunities

Be empathetic, professional, and focused on delivering value to clients.`,

  // Creative Lead - Mak (Lead Layer)
  creativeLead: `You are Mak, the Creative Lead for AISTEAM. You are a LEAD AGENT who owns brand voice, visual identity, and creative direction.

Your role:
- Own brand voice, visual identity, and creative direction
- Help define layout ideas and content frameworks
- Work together with Web Engineer and Growth on experiences that convert
- Manage brand identity and visual consistency
- Create design rules and guidelines
- Generate media metadata
- Ensure brand assets are consistent across all projects

Be creative, inspiring, and focused on producing high-quality creative work that maintains brand integrity.`,

  // Growth Lead - Dana (Lead Layer)
  growthLead: `You are Dana, the Growth Lead for AISTEAM. You are a LEAD AGENT responsible for traffic, leads, and revenue growth.

Your role:
- Responsible for traffic, leads, and revenue growth
- SEO and E marketing strategy for each project
- Coordinates with analytics, campaigns, and reporting panels in the app
- Help with SEO optimization and marketing campaigns
- Analyze performance and provide growth strategies
- Plan newsletters and social content
- Integrate with marketing platforms

Be data-driven, strategic, and focused on measurable results.`,

  // Technical Lead (Lead Layer)
  technicalLead: `You are the Technical Lead for AISTEAM. You are a LEAD AGENT who handles architecture, integrations, and technical decisions.

Your role:
- Architecture, integrations, and technical decisions
- Hosting, performance, and security guidance
- Works closely with Web Engineer and Automation Agent for deep technical work
- Help with technical decisions and tool recommendations
- Manage system architecture and troubleshooting
- Handle hosting integration, platform connections, and domains
- Ensure core performance and stability

Be technical, precise, and focused on building robust solutions.`,

  // Web Engineer - Nico (Execution Agent)
  webEngineer: `You are Nico, the Web Engineer for AISTEAM. You are an EXECUTION AGENT - you actually perform tasks, not just provide guidance.

Your role:
- Execution agent for web and CMS tasks
- Creates and updates pages, posts, menus, and settings
- Works with WordPress, WooCommerce, Shopify, and other platforms
- Consumes project context instead of asking the user for basic site information
- EXECUTE development tasks and code implementation
- Actually create pages, posts, products, and content on the CMS
- Build features and implement web solutions directly

CRITICAL EXECUTION RULES:
1. You EXECUTE tasks, you don't just tell users how to do them
2. Before asking the user for any information, check the project information provided to you
3. You should already know: CMS/platform, project name, domain, and settings
4. Only ask for information that is truly missing and required to execute the task
5. When a user requests something (like "add a new page"), you should:
   - Use the project information to understand the CMS/platform
   - Create a structured task plan
   - Execute the task using available APIs/integrations
   - Report back what was actually done

EXECUTION WORKFLOW:
- User: "I would like to add a new page to my website"
- You: "I'll create a new page on your [CMS] site. What should the page title be and what content should it include?"
- After getting details: Execute the task via API, then report: "I've created the page '[title]' on your site. It's now live at [URL]."

You have access to task execution APIs. When you need to execute a task, use the execute_task function.

Be practical, execution-focused, and actually get things done.`,
};

// Type for incoming messages from the API
type IncomingMessage = {
  from: "user" | "agent";
  text: string;
  kind?: "text" | "status" | "form";
  agentId?: string;
};

// Supervisor routing logic - determines which agent should handle the request
function determineAgent(userMessage: string, currentAgent: string): string {
  const message = userMessage.toLowerCase();
  
  // If user explicitly mentions an agent, route to them
  if (message.includes("delivery") || message.includes("project management") || message.includes("selena")) {
    return "deliveryLead";
  }
  if (message.includes("client") || message.includes("account") || message.includes("relationship")) {
    return "clientSuccess";
  }
  if (message.includes("brand") || message.includes("creative") || message.includes("design") || message.includes("mak")) {
    return "creativeLead";
  }
  if (message.includes("seo") || message.includes("marketing") || message.includes("growth") || message.includes("dana")) {
    return "growthLead";
  }
  if (message.includes("tech") || message.includes("system") || message.includes("infrastructure") || message.includes("hosting")) {
    return "technicalLead";
  }
  if (message.includes("web") || message.includes("code") || message.includes("build") || message.includes("implement")) {
    return "webEngineer";
  }
  
  // Default to Supervisor (chief) who will coordinate
  return currentAgent || "chief";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, agentId = "chief", projectContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Get the last user message to determine routing
    const lastUserMessage = (messages as IncomingMessage[])
      .filter((msg) => msg.from === "user")
      .pop()?.text || "";

    // Supervisor (chief) determines routing, other agents respond directly
    const targetAgent = agentId === "chief" 
      ? determineAgent(lastUserMessage, agentId)
      : agentId;

    // Get system prompt for the target agent
    let systemPrompt = AGENT_PROMPTS[targetAgent] || AGENT_PROMPTS.chief;

    // Fetch full project information if projectId is provided
    let projectData: any = null;
    if (projectContext?.projectId) {
      try {
        const { supabaseServer } = await import("@/lib/supabaseServer");
        const { data, error } = await supabaseServer
          .from("projects")
          .select("*")
          .eq("id", projectContext.projectId)
          .single();
        
        if (!error && data) {
          projectData = data;
        }
      } catch (err) {
        console.warn("Failed to fetch project data:", err);
        // Continue without project data
      }
    }

    // Build comprehensive project context
    let projectContextText = "";
    if (projectData) {
      const projectInfo = {
        name: projectData.name || projectContext?.projectName,
        domain: projectData.domain || projectData.cms_url || projectContext?.projectDomain,
        cms: projectData.cms || projectContext?.cms,
        cmsUrl: projectData.cms_url,
        customData: projectData.custom_data || {},
      };

      projectContextText = `\n\n=== CURRENT PROJECT INFORMATION ===
You have access to the following project information. USE THIS INFORMATION - do not ask the user for information you already have:

Project Name: ${projectInfo.name || "Not available"}
Domain: ${projectInfo.domain || "Not available"}
CMS Platform: ${projectInfo.cms || "Not available"}
CMS URL: ${projectInfo.cmsUrl || "Not available"}`;

      // Add custom settings if available
      if (projectInfo.customData && Object.keys(projectInfo.customData).length > 0) {
        projectContextText += `\n\nProject Settings (custom_data):\n${JSON.stringify(projectInfo.customData, null, 2)}`;
      }

      projectContextText += `\n\n=== IMPORTANT INSTRUCTIONS ===
- DO NOT ask the user for information that is already provided above
- Use the project information you have to provide specific, relevant assistance
- Only ask for information that is truly missing and required to complete the task
- Be proactive: use what you know to make suggestions and proceed with the task
- If the user asks about something related to the project, reference the project information you have`;
    } else if (projectContext) {
      // Fallback to basic context if project data fetch failed
      const { projectName, projectDomain, cms } = projectContext;
      if (projectName || projectDomain) {
        projectContextText = `\n\nCurrent Project Context:
- Project Name: ${projectName || "Not specified"}
- Domain: ${projectDomain || "Not specified"}
- CMS: ${cms || "Not specified"}

Use this context to provide relevant, project-specific assistance. Only ask for information that is not already provided.`;
      }
    }

    if (projectContextText) {
      systemPrompt += projectContextText;
    }

    // Format messages for OpenAI
    // Filter out status messages and only include text messages
    const textMessages = (messages as IncomingMessage[]).filter(
      (msg) => msg.kind !== "status" && msg.text && msg.text.trim().length > 0
    );
    
    // Ensure we have at least one user message
    const hasUserMessage = textMessages.some(msg => msg.from === "user");
    if (!hasUserMessage) {
      return NextResponse.json(
        { error: "At least one user message is required" },
        { status: 400 }
      );
    }
    
    // Add context about agent routing if Supervisor is coordinating
    let enhancedSystemPrompt = systemPrompt;
    if (agentId === "chief" && targetAgent !== "chief") {
      enhancedSystemPrompt += `\n\nIMPORTANT: The user's request has been routed to you by the Supervisor (Hans). Respond directly to help the user with their request.`;
    }

    // Map messages with explicit types to avoid TypeScript union type issues
    const mappedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = textMessages.map((msg: IncomingMessage) => {
      if (msg.from === "user") {
        return {
          role: "user" as const,
          content: msg.text,
        } as OpenAI.Chat.Completions.ChatCompletionUserMessageParam;
      } else {
        return {
          role: "assistant" as const,
          content: msg.text,
        } as OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam;
      }
    });

    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: enhancedSystemPrompt,
      },
      ...mappedMessages,
    ];

    // Call OpenAI (lazy initialization)
    const openai = getOpenAIClient();
    
    // Add function definitions for task execution
    const functions = [
      {
        name: "execute_task",
        description: "Execute a task on the CMS/platform. Use this when the user wants you to actually perform an action like creating a page, post, or updating content.",
        parameters: {
          type: "object",
          properties: {
            task_type: {
              type: "string",
              enum: ["create_page", "create_post", "update_content", "create_task"],
              description: "The type of task to execute"
            },
            parameters: {
              type: "object",
              description: "Task-specific parameters (title, content, target, etc.)"
            },
            message: {
              type: "string",
              description: "Brief message explaining what you're executing"
            }
          },
          required: ["task_type", "parameters", "message"]
        }
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      functions: functions,
      function_call: "auto", // Let the model decide when to call functions
      temperature: 0.7,
      max_tokens: 1500,
    });

    const message = completion.choices[0]?.message;
    let responseText = message?.content || "";
    let executedTask = null;
    let functionArgs: any = null;

    // Check if the model wants to execute a task
    if (message?.function_call?.name === "execute_task") {
      try {
        functionArgs = JSON.parse(message.function_call.arguments);
        
        // Execute the task
        const executeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/assistant/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskType: functionArgs.task_type,
            parameters: functionArgs.parameters,
            projectId: projectContext?.projectId,
            conversationId: null, // Could be passed from request if available
          }),
        });

        const executeResult = await executeResponse.json();
        executedTask = executeResult;

        // Generate a follow-up message about what was executed
        const followUpCompletion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            ...openaiMessages,
            message,
            {
              role: "function" as const,
              name: "execute_task",
              content: JSON.stringify(executeResult),
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        responseText = followUpCompletion.choices[0]?.message?.content || functionArgs.message;
      } catch (err: any) {
        console.error("Task execution error:", err);
        responseText = `I attempted to execute the task but encountered an error: ${err.message}. ${functionArgs?.message || ""}`;
      }
    }

    return NextResponse.json(
      {
        message: responseText,
        usage: completion.usage,
        routedAgent: targetAgent,
        executedTask, // Include task execution result if any
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("OpenAI API error:", err);
    console.error("Error stack:", err.stack);
    console.error("Error details:", {
      message: err.message,
      name: err.name,
      cause: err.cause,
    });
    
    // Return more detailed error information
    const errorMessage = err.message || String(err);
    const errorDetails = err.details || err.cause || undefined;
    
    return NextResponse.json(
      {
        error: "Failed to get AI response",
        details: errorMessage,
        ...(errorDetails && { cause: errorDetails }),
      },
      { status: 500 }
    );
  }
}

