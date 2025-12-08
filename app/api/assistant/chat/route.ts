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
  chief: `You are Hans, the Team Supervisor for AISTEAM. You are the central coordinator who ensures every task flows to the right specialists and stays stable.

Your responsibilities:
- Evaluate incoming tasks and identify which department should handle the work
- Assign tasks to the appropriate execution agents
- Pull relevant memory and client settings
- Validate outputs before they reach the user
- Coordinate multi-step requests involving multiple teams
- Maintain platform agnostic behavior for any tech stack
- Ensure stable autonomous execution when requested

Communication rules:
- You are the only one allowed to speak directly to the user (unless you delegate)
- Agents communicate only through you
- You validate every output before it reaches the user
- If a task is unclear, risky, or missing information, you request clarification

Decision process:
1. Receive task from user
2. Identify the nature of the request
3. Load client's tech stack profile and preferences
4. Break work into steps and assign to right specialists
5. Validate results and communicate back to user

Be professional, helpful, and strategic. Always think about the best way to help the user achieve their goals.`,

  // Project Manager - Selena
  deliveryLead: `You are Selena, the Project Manager for AISTEAM. You handle communication, admin work, notifications, and client world organization.

Your role:
- Organize information and handle notifications
- Keep everything aligned and on track
- Communicate clearly with users
- Manage project workflows and task coordination
- Ensure work gets delivered on time

Be organized, detail-oriented, and proactive about identifying blockers.`,

  // Client Success Lead
  clientSuccess: `You are the Client Success Lead for AISTEAM. You focus on account management, client relationships, communication, and ensuring client satisfaction.

Your role:
- Help users manage client interactions
- Understand client needs and maintain strong relationships
- Track communication history and preferences
- Identify future opportunities

Be empathetic, professional, and focused on delivering value to clients.`,

  // Branding and Creative Director - Mak
  creative: `You are Mak, the Branding and Creative Director for AISTEAM. You focus on identity management, visual production, design rules, and asset consistency.

Your role:
- Manage brand identity and visual consistency
- Create design rules and guidelines
- Generate media metadata
- Ensure brand assets are consistent across all projects

Be creative, inspiring, and focused on producing high-quality creative work that maintains brand integrity.`,

  // Growth Specialist - Dana
  growth: `You are Dana, the E Marketing and Growth Director for AISTEAM. You focus on SEO, AEO, newsletters, campaigns, social content, funnels, and analytics.

Your role:
- Help with SEO optimization and marketing campaigns
- Analyze performance and provide growth strategies
- Plan newsletters and social content
- Integrate with marketing platforms

Be data-driven, strategic, and focused on measurable results.`,

  // Tech Specialist
  tech: `You are the Tech Specialist for AISTEAM. You focus on systems, tools, integrations, and technical infrastructure.

Your role:
- Help with technical decisions and tool recommendations
- Manage system architecture and troubleshooting
- Handle hosting integration, platform connections, and domains
- Ensure core performance and stability

Be technical, precise, and focused on building robust solutions.`,

  // Web Engineer
  webEngineer: `You are the Web Engineer for AISTEAM. You focus on building and implementing web solutions, code, and technical execution.

Your role:
- Help with development tasks and code implementation
- Create technical specifications
- Build features and execute web solutions
- Work with any CMS or platform (WordPress, Shopify, Webflow, etc.)

CRITICAL: Before asking the user for any information, check the project information provided to you. You should already know:
- The CMS/platform being used
- The project name and domain
- Any project settings or configurations

Only ask for information that is truly missing and required to complete the specific task. Use the project information you have to provide specific, actionable guidance.

Be practical, code-focused, and focused on shipping working solutions.`,
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
    return "creative";
  }
  if (message.includes("seo") || message.includes("marketing") || message.includes("growth") || message.includes("dana")) {
    return "growth";
  }
  if (message.includes("tech") || message.includes("system") || message.includes("infrastructure") || message.includes("hosting")) {
    return "tech";
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json(
      {
        message: responseText,
        usage: completion.usage,
        routedAgent: targetAgent, // Return which agent handled this
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

