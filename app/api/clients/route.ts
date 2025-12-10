import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// Default tenant_id - in production, get from session/auth
const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || "00000000-0000-0000-0000-000000000000";

export async function GET(request: NextRequest) {
  try {
    const tenantId = DEFAULT_TENANT_ID; // TODO: Get from session/auth

    const { data, error } = await supabaseServer
      .from("clients")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching clients:", error);
      return NextResponse.json(
        { error: "Failed to fetch clients", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ clients: data || [] });
  } catch (err: any) {
    console.error("Unexpected error in GET /api/clients:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = DEFAULT_TENANT_ID; // TODO: Get from session/auth
    const body = await request.json();

    const { name, slug, email, phone, website, industry, status } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("clients")
      .insert({
        tenant_id: tenantId,
        name,
        slug,
        email: email || null,
        phone: phone || null,
        website: website || null,
        industry: industry || null,
        status: status || "active",
        contact_person: null,
        custom_data: null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      return NextResponse.json(
        { error: "Failed to create client", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ client: data }, { status: 201 });
  } catch (err: any) {
    console.error("Unexpected error in POST /api/clients:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

