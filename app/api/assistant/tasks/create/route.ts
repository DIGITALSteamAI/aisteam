import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      conversationId,
      action,
      target,
      intent,
      priority,
      notes,
      status = "open",
    } = body;

    if (!action || !target || !intent || !priority) {
      return NextResponse.json(
        { error: "action, target, intent, and priority are required" },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `priority must be one of: ${validPriorities.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["open", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // If conversationId provided, verify it exists
    if (conversationId) {
      const { data: conversation } = await supabase
        .from("assistant_conversations")
        .select("id")
        .eq("id", conversationId)
        .single();

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    }

    const { data, error } = await supabase
      .from("assistant_tasks")
      .insert({
        conversation_id: conversationId || null,
        action,
        target,
        intent,
        priority,
        notes: notes || null,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      return NextResponse.json(
        { error: "Failed to create task", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ task: data }, { status: 201 });
  } catch (err: any) {
    console.error("Unexpected error creating task:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}

