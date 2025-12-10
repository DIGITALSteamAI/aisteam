import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getTenantId } from "@/lib/getTenantId";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const tenantId = getTenantId(request);

    const { data, error } = await supabaseServer
      .from("contacts")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching contact:", error);
      return NextResponse.json(
        { error: "Failed to fetch contact", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ contact: data });
  } catch (err: any) {
    console.error("Unexpected error in GET /api/contacts/[id]:", err);
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
    const tenantId = getTenantId(request);
    const body = await request.json();

    // If setting as primary, unset other primary contacts for the same client
    if (body.is_primary === true) {
      // First get the contact to find client_id
      const { data: contact } = await supabaseServer
        .from("contacts")
        .select("client_id")
        .eq("id", id)
        .eq("tenant_id", tenantId)
        .single();

      if (contact?.client_id) {
        await supabaseServer
          .from("contacts")
          .update({ is_primary: false })
          .eq("client_id", contact.client_id)
          .eq("tenant_id", tenantId)
          .neq("id", id);
      }
    }

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.first_name !== undefined) updates.first_name = body.first_name;
    if (body.last_name !== undefined) updates.last_name = body.last_name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.role !== undefined) updates.role = body.role;
    if (body.is_primary !== undefined) updates.is_primary = body.is_primary;

    const { data, error } = await supabaseServer
      .from("contacts")
      .update(updates)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();

    if (error) {
      console.error("Error updating contact:", error);
      return NextResponse.json(
        { error: "Failed to update contact", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ contact: data });
  } catch (err: any) {
    console.error("Unexpected error in PATCH /api/contacts/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const tenantId = getTenantId(request);

    const { error } = await supabaseServer
      .from("contacts")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);

    if (error) {
      console.error("Error deleting contact:", error);
      return NextResponse.json(
        { error: "Failed to delete contact", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error in DELETE /api/contacts/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

