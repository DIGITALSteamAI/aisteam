import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";
import { getTenantId } from "@/lib/getTenantId";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, metadata, currentAgent = "chief", clientId, projectId } = body;

    // Get tenant_id from request (not from body)
    const tenantId = getTenantId(request);

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Create conversation without requiring client_id or project_id
    // These are optional and can be null
    const { data: newSession, error } = await supabase
      .from("assistant_conversations")
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        active_flag: true,
        metadata: metadata || null,
        current_agent: currentAgent || "chief",
        // Optional fields - set to null if not provided
        client_id: clientId || null,
        project_id: projectId || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Assistant conversation creation error", error);
      return NextResponse.json(
        { error: "Failed to create conversation", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      ok: true, 
      sessionId: newSession.id,
      conversation: newSession 
    }, { status: 201 });
  } catch (err: any) {
    console.error("Assistant conversation creation error", err);
    return NextResponse.json(
      { error: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
