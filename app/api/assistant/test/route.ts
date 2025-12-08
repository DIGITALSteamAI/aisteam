import { NextResponse } from "next/server";

export async function GET() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  const apiKeyLength = process.env.OPENAI_API_KEY?.length || 0;
  const apiKeyPrefix = process.env.OPENAI_API_KEY?.substring(0, 7) || "missing";

  return NextResponse.json({
    hasApiKey,
    apiKeyLength,
    apiKeyPrefix: hasApiKey ? `${apiKeyPrefix}...` : "N/A",
    message: hasApiKey 
      ? "OpenAI API key is configured" 
      : "OpenAI API key is NOT configured - please add OPENAI_API_KEY to Vercel environment variables",
  });
}

