import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export async function GET(request: Request, context: any) {
  const { id: projectId } = await context.params;

  // Definitions
  const { data: definitions, error: defError } = await supabase
    .from("project_panel_metric_definitions")
    .select("metric_key, label, description, unit, sort_order")
    .eq("panel_key", "web_design")
    .order("sort_order", { ascending: true });

  // Numeric metrics
  const { data: numeric, error: numError } = await supabase
    .from("project_panel_metrics")
    .select("metric_key, value, period_type, period_start")
    .eq("project_id", projectId)
    .eq("panel_key", "web_design");

  // Text metrics
  const { data: text, error: textError } = await supabase
    .from("project_panel_metric_texts")
    .select("metric_key, value_text, fetched_at")
    .eq("project_id", projectId)
    .eq("panel_key", "web_design");

  if (defError || numError || textError) {
    console.error("Web design definitions error:", defError);
    console.error("Web design numeric error:", numError);
    console.error("Web design text error:", textError);
    return NextResponse.json(
      {
        error: "Database query failed",
        defError: defError?.message,
        numError: numError?.message,
        textError: textError?.message
      },
      { status: 500 }
    );
  }

  const safeDefinitions = definitions ?? [];
  const safeNumeric = numeric ?? [];
  const safeText = text ?? [];

  const metrics = safeDefinitions.map(def => {
    const numericMatch = safeNumeric.find(
      n => n.metric_key === def.metric_key
    );
    const textMatch = safeText.find(t => t.metric_key === def.metric_key);

    const value =
      numericMatch?.value ??
      textMatch?.value_text ??
      null;

    const period_type = numericMatch?.period_type ?? "snapshot";
    const period_start =
      numericMatch?.period_start ?? textMatch?.fetched_at ?? null;

    return {
      key: def.metric_key,
      label: def.label,
      description: def.description,
      unit: def.unit,
      value,
      period_type,
      period_start
    };
  });

  return NextResponse.json({
    project_id: projectId,
    panel: "web_design",
    metrics
  });
}
