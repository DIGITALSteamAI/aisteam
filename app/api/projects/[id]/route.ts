import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Next 16 requires awaiting params
  const { id: projectId } = await context.params;

  if (!projectId) {
    return NextResponse.json(
      { error: "Project id missing" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!data || error) {
    return NextResponse.json(
      { error: "Project not found", projectId, details: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ data });
}
