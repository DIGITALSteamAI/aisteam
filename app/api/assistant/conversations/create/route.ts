import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, userId, metadata, currentAgent = "chief" } = body;

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: "tenantId and userId are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("assistant_conversations")
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        active_flag: true,
        metadata: metadata || null,
        current_agent: currentAgent,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return NextResponse.json(
        { error: "Failed to create conversation", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation: data }, { status: 201 });
  } catch (err: any) {
    console.error("Unexpected error creating conversation:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}

