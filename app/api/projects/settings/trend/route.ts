import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* SERVICE CLIENT */
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const projectId = body.project_id;
    const trendMode = body.trend_mode;

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing project_id in request" },
        { status: 400 }
      );
    }

    if (!trendMode) {
      return NextResponse.json(
        { error: "Missing trend_mode in request" },
        { status: 400 }
      );
    }

    /* Load current custom_data */
    const { data: project, error: loadErr } = await supabase
      .from("projects")
      .select("custom_data")
      .eq("id", projectId)
      .single();

    if (loadErr) {
      return NextResponse.json(
        { error: "Failed loading project", details: loadErr },
        { status: 500 }
      );
    }

    const current = project?.custom_data || {};

    /* Update nested settings safely */
    const updated = {
      ...current,
      settings: {
        ...(current.settings || {}),
        performance_trend_mode: trendMode
      }
    };

    /* Save */
    const { error: updateErr } = await supabase
      .from("projects")
      .update({ custom_data: updated })
      .eq("id", projectId);

    if (updateErr) {
      return NextResponse.json(
        { error: "Failed updating trend mode", details: updateErr },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        project_id: projectId,
        saved_trend_mode: trendMode
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unhandled server error", details: String(err) },
      { status: 500 }
    );
  }
}
