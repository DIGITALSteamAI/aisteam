import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getTenantId } from "@/lib/getTenantId";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await context.params;
    const tenantId = getTenantId(request);

    const { data, error } = await supabaseServer
      .from("contacts")
      .select("*")
      .eq("client_id", clientId)
      .eq("tenant_id", tenantId)
      .order("is_primary", { ascending: false })
      .order("last_name", { ascending: true });

    if (error) {
      console.error("Error fetching contacts:", error);
      return NextResponse.json(
        { error: "Failed to fetch contacts", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ contacts: data || [] });
  } catch (err: any) {
    console.error("Unexpected error in GET /api/clients/[id]/contacts:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

