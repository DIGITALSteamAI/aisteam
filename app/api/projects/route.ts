import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";
import { getTenantId } from "@/lib/getTenantId";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("client_id");
    const tenantId = getTenantId(request);

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    // Build query with proper joins to clients and contacts tables
    let query = supabase
      .from("projects")
      .select(`
        id,
        name,
        project_key,
        status,
        project_type,
        created_at,
        client:clients (
          id,
          client_name
        ),
        primary_contact:contacts (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq("tenant_id", tenantId);

    // Filter by client_id if provided
    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    const { data: projects, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json(
        { error: "Failed to load projects", details: error.message },
        { status: 500 }
      );
    }

    // Map CMS types to icons
    const cmsMap: Record<string, string> = {
      wordpress: "/icon-wordpress.png",
      shopify: "/icon-shopify.png",
      webflow: "/icon-webflow.png",
      squarespace: "/icon-squarespace.png"
    };

    // Enrich projects with formatted data for frontend
    const enriched = (projects || []).map((p: any) => {
      const cmsKey = (p.cms || "").toLowerCase();
      
      // Extract client info (handle both array and object formats from Supabase join)
      const client = Array.isArray(p.client) ? p.client[0] : p.client;
      const clientName = client?.client_name || null;
      
      // Extract primary contact info (handle both array and object formats)
      const primaryContact = Array.isArray(p.primary_contact) 
        ? p.primary_contact[0] 
        : p.primary_contact;
      
      // Format lastUpdate from created_at
      const lastUpdate = p.created_at 
        ? new Date(p.created_at).toLocaleDateString()
        : "";

      return {
        id: p.id,
        name: p.name,
        project_key: p.project_key || null,
        status: p.status || "active",
        project_type: p.project_type || null,
        domain: null, // Not in new schema, set to null
        client: clientName,
        cms: p.cms || null,
        cmsType: p.cms || null,
        cms_icon: cmsMap[cmsKey] || "/icon-generic.png",
        lastUpdate: lastUpdate,
        // Include primary contact info if available
        primary_contact: primaryContact ? {
          id: primaryContact.id,
          first_name: primaryContact.first_name || null,
          last_name: primaryContact.last_name || null,
          email: primaryContact.email || null,
          phone: primaryContact.phone || null
        } : null
      };
    });

    return NextResponse.json({ projects: enriched }, { status: 200 });
  } catch (err: any) {
    console.error("API route error", err);
    return NextResponse.json(
      { error: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
