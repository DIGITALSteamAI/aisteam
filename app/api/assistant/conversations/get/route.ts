import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("id");
    const tenantId = searchParams.get("tenantId");
    const userId = searchParams.get("userId");
    const activeOnly = searchParams.get("activeOnly") === "true";

    if (conversationId) {
      // Get single conversation
      let query = supabase
        .from("assistant_conversations")
        .select("*")
        .eq("id", conversationId);

      if (tenantId) {
        query = query.eq("tenant_id", tenantId);
      }
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error("Error fetching conversation:", error);
        return NextResponse.json(
          { error: "Failed to fetch conversation", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ conversation: data }, { status: 200 });
    } else {
      // Get list of conversations
      if (!tenantId || !userId) {
        return NextResponse.json(
          { error: "tenantId and userId are required for listing conversations" },
          { status: 400 }
        );
      }

      let query = supabase
        .from("assistant_conversations")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("user_id", userId)
        .order("started_at", { ascending: false });

      if (activeOnly) {
        query = query.eq("active_flag", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json(
          { error: "Failed to fetch conversations", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ conversations: data || [] }, { status: 200 });
    }
  } catch (err: any) {
    console.error("Unexpected error fetching conversation(s):", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}

