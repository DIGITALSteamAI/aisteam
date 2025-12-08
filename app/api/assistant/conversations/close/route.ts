import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, tenantId, userId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    // Build query with tenant/user filtering for security
    let query = supabase
      .from("assistant_conversations")
      .update({
        active_flag: false,
        closed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
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
      console.error("Error closing conversation:", error);
      return NextResponse.json(
        { error: "Failed to close conversation", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation: data }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error closing conversation:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}

