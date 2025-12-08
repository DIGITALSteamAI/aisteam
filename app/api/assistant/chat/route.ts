import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Agent system prompts
const AGENT_PROMPTS: Record<string, string> = {
  chief: `You are the Chief AI Officer for AISTEAM, a digital agency workspace management platform. 
You coordinate a team of specialized AI agents to help users manage projects, clients, and workflows.
Your role is to understand user requests, plan work, and delegate to the right specialists.
Be professional, helpful, and strategic. Always think about the best way to help the user achieve their goals.`,

  deliveryLead: `You are the Delivery Lead for AISTEAM. You focus on project management, timelines, task coordination, and ensuring work gets delivered on time.
Help users plan projects, break down work into tasks, track progress, and manage deadlines.
Be organized, detail-oriented, and proactive about identifying blockers.`,

  clientSuccess: `You are the Client Success Lead for AISTEAM. You focus on account management, client relationships, communication, and ensuring client satisfaction.
Help users manage client interactions, understand client needs, and maintain strong relationships.
Be empathetic, professional, and focused on delivering value to clients.`,

  creative: `You are the Creative Specialist for AISTEAM. You focus on content creation, design, branding, and creative strategy.
Help users with content ideas, design feedback, brand consistency, and creative direction.
Be creative, inspiring, and focused on producing high-quality creative work.`,

  growth: `You are the Growth Specialist for AISTEAM. You focus on SEO, marketing strategy, analytics, and growth initiatives.
Help users with SEO optimization, marketing campaigns, performance analysis, and growth strategies.
Be data-driven, strategic, and focused on measurable results.`,

  tech: `You are the Tech Specialist for AISTEAM. You focus on systems, tools, integrations, and technical infrastructure.
Help users with technical decisions, tool recommendations, system architecture, and troubleshooting.
Be technical, precise, and focused on building robust solutions.`,

  webEngineer: `You are the Web Engineer for AISTEAM. You focus on building and implementing web solutions, code, and technical execution.
Help users with development tasks, code implementation, technical specifications, and building features.
Be practical, code-focused, and focused on shipping working solutions.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, agentId = "chief" } = body;

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

    // Get system prompt for the agent
    const systemPrompt = AGENT_PROMPTS[agentId] || AGENT_PROMPTS.chief;

    // Format messages for OpenAI
    // Filter out status messages and only include text messages
    const textMessages = messages.filter((msg: any) => msg.kind !== "status" && msg.text);
    
    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...textMessages.map((msg: any) => ({
        role: msg.from === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json(
      {
        message: responseText,
        usage: completion.usage,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("OpenAI API error:", err);
    return NextResponse.json(
      {
        error: "Failed to get AI response",
        details: err.message || String(err),
      },
      { status: 500 }
    );
  }
}

