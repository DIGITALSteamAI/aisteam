import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, author, agentId, kind = "text", text } = body;

    if (!conversationId || !author || !text) {
      return NextResponse.json(
        { error: "conversationId, author, and text are required" },
        { status: 400 }
      );
    }

    if (author !== "user" && author !== "agent") {
      return NextResponse.json(
        { error: "author must be 'user' or 'agent'" },
        { status: 400 }
      );
    }

    // Verify conversation exists and is active (optional security check)
    const { data: conversation } = await supabase
      .from("assistant_conversations")
      .select("id, active_flag")
      .eq("id", conversationId)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("assistant_messages")
      .insert({
        conversation_id: conversationId,
        author,
        agent_id: agentId || null,
        kind,
        text,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding message:", error);
      return NextResponse.json(
        { error: "Failed to add message", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (err: any) {
    console.error("Unexpected error adding message:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}

