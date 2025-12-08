import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

// Performance panel API route

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await context.params;
    const { searchParams } = new URL(request.url);
    const trendOverride = searchParams.get("trend_mode");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing project_id in route params" },
        { status: 400 }
      );
    }

    // Load project settings
    const { data: project } = await supabase
      .from("projects")
      .select("custom_data")
      .eq("id", projectId)
      .single();

    const trendMode =
      trendOverride ||
      project?.custom_data?.settings?.performance_trend_mode ||
      "yesterday";

    // Load metric definitions
    const { data: definitions } = await supabase
      .from("project_panel_metric_definitions")
      .select("*")
      .eq("panel_key", "performance")
      .order("sort_order", { ascending: true });

    // Ensure definitions is never null - explicit type assertion for TypeScript
    const safeDefinitions: NonNullable<typeof definitions> = definitions ?? [];

    // Load metric values
    const { data: rows } = await supabase
      .from("project_panel_metrics")
      .select("*")
      .eq("project_id", projectId)
      .eq("panel_key", "performance");

    // Ensure rows is never null - explicit type assertion for TypeScript
    const safeRows: NonNullable<typeof rows> = rows ?? [];

    // Period selector
    function pickPeriods(metricKey: string) {
      const items = safeRows.filter(r => r.metric_key === metricKey);

      const table = {
        yesterday: ["daily", "daily_prev"],
        weekly: ["weekly", "weekly_prev"],
        monthly: ["monthly", "monthly_prev"],
        yearly: ["yearly", "yearly_prev"]
      };

      const [curType, prevType] = table[trendMode as keyof typeof table] || [];

      return {
        current: items.find(r => r.period_type === curType) || null,
        prev: items.find(r => r.period_type === prevType) || null
      };
    }

    // Group logic
    function detectGroup(metricKey: string) {
      if (metricKey === "visitors" || metricKey === "top_pages") return "traffic";

      if (
        metricKey === "facebook_followers" ||
        metricKey === "instagram_followers" ||
        metricKey === "tiktok_followers" ||
        metricKey === "youtube_subscribers"
      ) {
        return "followers";
      }

      return "performance";
    }

    // Build output
    const metrics = safeDefinitions.map(def => {
      const key = def.metric_key;
      const isTopPages = key === "top_pages";

      const { current, prev } = pickPeriods(key);

      const curVal = isTopPages
        ? current?.value || ""
        : Number(current?.value ?? 0);

      const prevVal = isTopPages
        ? prev?.value || ""
        : Number(prev?.value ?? 0);

      let trend: "up" | "down" | "same" | "na" = "na";

      if (!isTopPages && current && prev) {
        if (curVal > prevVal) trend = "up";
        else if (curVal < prevVal) trend = "down";
        else trend = "same";
      }

      return {
        key,
        label: def.label,
        group: detectGroup(key),
        display_value: isTopPages ? curVal : String(curVal),
        compare_value: isTopPages ? prevVal : String(prevVal),
        trend
      };
    });

    return NextResponse.json(
      {
        project_id: projectId,
        trend_mode: trendMode,
        metrics
      },
      { status: 200 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { error: "Unhandled error", details: String(err) },
      { status: 500 }
    );
  }
}
