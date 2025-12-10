import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "00000000-0000-0000-0000-000000000000";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const tenantId = DEFAULT_TENANT_ID; // TODO: Get from session/auth

    const { data, error } = await supabaseServer
      .from("clients")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching client:", error);
      return NextResponse.json(
        { error: "Failed to fetch client", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ client: data });
  } catch (err: any) {
    console.error("Unexpected error in GET /api/clients/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const tenantId = DEFAULT_TENANT_ID; // TODO: Get from session/auth
    const body = await request.json();

    // Build update object from body
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updates.name = body.name;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.email !== undefined) updates.email = body.email;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.website !== undefined) updates.website = body.website;
    if (body.industry !== undefined) updates.industry = body.industry;
    if (body.status !== undefined) updates.status = body.status;
    if (body.contact_person !== undefined) updates.contact_person = body.contact_person;
    if (body.custom_data !== undefined) updates.custom_data = body.custom_data;

    const { data, error } = await supabaseServer
      .from("clients")
      .update(updates)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error);
      return NextResponse.json(
        { error: "Failed to update client", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ client: data });
  } catch (err: any) {
    console.error("Unexpected error in PATCH /api/clients/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

