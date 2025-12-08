import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, tenantId, userId, metadata, currentAgent, activeFlag } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    // Build update object
    const updates: {
      updated_at: string;
      metadata?: any;
      current_agent?: string;
      active_flag?: boolean;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (metadata !== undefined) {
      updates.metadata = metadata;
    }
    if (currentAgent !== undefined) {
      updates.current_agent = currentAgent;
    }
    if (activeFlag !== undefined) {
      updates.active_flag = activeFlag;
    }

    // Build query with tenant/user filtering for security
    let query = supabase
      .from("assistant_conversations")
      .update(updates)
      .eq("id", conversationId);

    // Add tenant/user filters if provided for security
    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.select().single();

    if (error) {
      console.error("Error updating conversation:", error);
      return NextResponse.json(
        { error: "Failed to update conversation", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation: data }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error updating conversation:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}

