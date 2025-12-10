import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";
import { getTenantId } from "@/lib/getTenantId";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get("client_id");
  
  try {
    const tenantId = getTenantId(request);

    // Build query - make clients join optional to avoid breaking if FK not set up
    let query = supabase
      .from("projects")
      .select(`
        id,
        name,
        tenant_id,
        created_at,
        updated_at,
        cms,
        domain,
        cms_url,
        client_id
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

    // If we have projects with client_id, fetch client names separately
    const clientIds = (projects || [])
      .map((p: any) => p.client_id)
      .filter((id: any) => id) as string[];
    
    const clientMap = new Map<string, string>();
    if (clientIds.length > 0) {
      try {
        const { data: clients } = await supabase
          .from("clients")
          .select("id, name")
          .in("id", clientIds);
        
        (clients || []).forEach((c: any) => {
          clientMap.set(c.id, c.name);
        });
      } catch (err) {
        console.warn("Could not fetch client names:", err);
        // Continue without client names
      }
    }

    const cmsMap: Record<string, string> = {
      wordpress: "/icon-wordpress.png",
      shopify: "/icon-shopify.png",
      webflow: "/icon-webflow.png",
      squarespace: "/icon-squarespace.png"
    };

    // Enrich projects with formatted data for frontend
    const enriched = (projects || []).map((p: any) => {
      const cmsKey = (p.cms || "").toLowerCase();
      const clientName = p.client_id ? clientMap.get(p.client_id) : null;
      
      // Format lastUpdate from updated_at or created_at
      const lastUpdate = p.updated_at 
        ? new Date(p.updated_at).toLocaleDateString()
        : p.created_at 
        ? new Date(p.created_at).toLocaleDateString()
        : "";

      return {
        id: p.id,
        name: p.name,
        domain: p.domain || null,
        client: clientName || null,
        status: "active", // Default status - can be enhanced later
        cms: p.cms || null,
        cmsType: p.cms || null,
        cms_icon: cmsMap[cmsKey] || "/icon-generic.png",
        lastUpdate: lastUpdate
      };
    });

    return NextResponse.json({ projects: enriched }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error in GET /api/projects:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}
