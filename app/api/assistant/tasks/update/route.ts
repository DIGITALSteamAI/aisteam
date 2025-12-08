import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, status, action, target, intent, priority, notes } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) {
      const validStatuses = ["open", "in_progress", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `status must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (action !== undefined) {
      updates.action = action;
    }
    if (target !== undefined) {
      updates.target = target;
    }
    if (intent !== undefined) {
      updates.intent = intent;
    }
    if (priority !== undefined) {
      const validPriorities = ["low", "medium", "high", "urgent"];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { error: `priority must be one of: ${validPriorities.join(", ")}` },
          { status: 400 }
        );
      }
      updates.priority = priority;
    }
    if (notes !== undefined) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from("assistant_tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      return NextResponse.json(
        { error: "Failed to update task", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ task: data }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error updating task:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}

