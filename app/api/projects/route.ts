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

    // Fetch projects first (without joins to avoid syntax issues)
    let query = supabase
      .from("projects")
      .select(`
        id,
        name,
        project_key,
        status,
        project_type,
        created_at,
        client_id,
        primary_contact_id,
        cms
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

    if (!projects || projects.length === 0) {
      return NextResponse.json({ projects: [] }, { status: 200 });
    }

    // Fetch clients separately
    const clientIds = projects
      .map((p: any) => p.client_id)
      .filter((id: any) => id) as string[];
    
    const clientMap = new Map<string, any>();
    if (clientIds.length > 0) {
      try {
        const { data: clients } = await supabase
          .from("clients")
          .select("id, client_name")
          .in("id", clientIds)
          .eq("tenant_id", tenantId);
        
        (clients || []).forEach((c: any) => {
          clientMap.set(c.id, c);
        });
      } catch (err) {
        console.warn("Could not fetch client names:", err);
        // Continue without client names
      }
    }

    // Fetch contacts separately
    const contactIds = projects
      .map((p: any) => p.primary_contact_id)
      .filter((id: any) => id) as string[];
    
    const contactMap = new Map<string, any>();
    if (contactIds.length > 0) {
      try {
        const { data: contacts } = await supabase
          .from("contacts")
          .select("id, first_name, last_name, email, phone")
          .in("id", contactIds)
          .eq("tenant_id", tenantId);
        
        (contacts || []).forEach((c: any) => {
          contactMap.set(c.id, c);
        });
      } catch (err) {
        console.warn("Could not fetch contact info:", err);
        // Continue without contact info
      }
    }

    // Map CMS types to icons
    const cmsMap: Record<string, string> = {
      wordpress: "/icon-wordpress.png",
      shopify: "/icon-shopify.png",
      webflow: "/icon-webflow.png",
      squarespace: "/icon-squarespace.png"
    };

    // Enrich projects with formatted data for frontend
    const enriched = projects.map((p: any) => {
      const cmsKey = (p.cms || "").toLowerCase();
      const client = p.client_id ? clientMap.get(p.client_id) : null;
      const primaryContact = p.primary_contact_id ? contactMap.get(p.primary_contact_id) : null;
      
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
        client: client?.client_name || null,
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
