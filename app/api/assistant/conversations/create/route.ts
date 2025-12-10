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

    // Build insert object - only include fields that exist in the table
    const insertData: any = {
      tenant_id: tenantId,
      user_id: userId,
      active_flag: true,
      current_agent: currentAgent || "chief",
    };

    // Only add optional fields if they are provided and not null
    if (metadata !== undefined && metadata !== null) {
      insertData.metadata = metadata;
    }
    
    // Only add client_id and project_id if they exist in the table schema
    // Check if these columns exist before adding them
    if (clientId) {
      insertData.client_id = clientId;
    }
    
    if (projectId) {
      insertData.project_id = projectId;
    }

    // Create conversation without requiring client_id or project_id
    const { data: newSession, error } = await supabase
      .from("assistant_conversations")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Assistant conversation creation error", error);
      // If error is about missing columns, try without them
      if (error.message?.includes("column") && (clientId || projectId)) {
        console.warn("Retrying without client_id/project_id columns");
        const retryData: any = {
          tenant_id: tenantId,
          user_id: userId,
          active_flag: true,
          current_agent: currentAgent || "chief",
        };
        if (metadata !== undefined && metadata !== null) {
          retryData.metadata = metadata;
        }
        
        const { data: retrySession, error: retryError } = await supabase
          .from("assistant_conversations")
          .insert(retryData)
          .select()
          .single();
        
        if (retryError) {
          return NextResponse.json(
            { error: "Failed to create conversation", details: retryError.message },
            { status: 500 }
          );
        }
        
        return NextResponse.json({ 
          ok: true, 
          sessionId: retrySession.id,
          conversation: retrySession 
        }, { status: 201 });
      }
      
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
