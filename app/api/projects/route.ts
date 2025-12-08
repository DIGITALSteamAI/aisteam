import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const tenantId = "56d1b96b-3e49-48c0-a6de-bab91b8f1864";

    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        id,
        name,
        tenant_id,
        created_at,
        cms
      `)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to load projects", details: error.message },
        { status: 500 }
      );
    }

    const cmsMap: Record<string, string> = {
      wordpress: "/icon-wordpress.png",
      shopify: "/icon-shopify.png",
      webflow: "/icon-webflow.png",
      squarespace: "/icon-squarespace.png"
    };

    const enriched = projects.map((p) => {
      const cmsKey = (p.cms || "").toLowerCase();
      return {
        ...p,
        cms_icon: cmsMap[cmsKey] || "/icon-generic.png"
      };
    });

    return NextResponse.json({ projects: enriched }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}
