import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "00000000-0000-0000-0000-000000000000";

export async function POST(request: NextRequest) {
  try {
    const tenantId = DEFAULT_TENANT_ID; // TODO: Get from session/auth
    const body = await request.json();

    const { client_id, first_name, last_name, email, phone, role, is_primary } = body;

    if (!client_id || !first_name || !last_name) {
      return NextResponse.json(
        { error: "client_id, first_name, and last_name are required" },
        { status: 400 }
      );
    }

    // If setting as primary, unset other primary contacts for this client
    if (is_primary) {
      await supabaseServer
        .from("contacts")
        .update({ is_primary: false })
        .eq("client_id", client_id)
        .eq("tenant_id", tenantId);
    }

    const { data, error } = await supabaseServer
      .from("contacts")
      .insert({
        tenant_id: tenantId,
        client_id,
        first_name,
        last_name,
        email: email || null,
        phone: phone || null,
        role: role || null,
        is_primary: is_primary || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating contact:", error);
      return NextResponse.json(
        { error: "Failed to create contact", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ contact: data }, { status: 201 });
  } catch (err: any) {
    console.error("Unexpected error in POST /api/contacts:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

