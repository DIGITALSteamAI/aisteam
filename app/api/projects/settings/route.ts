import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

// Default settings structure
const DEFAULT_SETTINGS = {
  general: {
    name: "",
    description: "",
    client: "",
    status: "active"
  },
  domains: {
    primary: "",
    staging: "",
    development: []
  },
  hosting: {
    provider: "",
    region: "",
    ssl_enabled: true
  },
  agent_defaults: {
    default_agent: "chief",
    allowed_task_types: [],
    auto_execute: false
  },
  feature_flags: {}
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId parameter" },
        { status: 400 }
      );
    }

    // Try to fetch existing settings
    const { data: existing, error: fetchError } = await supabase
      .from("project_settings")
      .select("*")
      .eq("project_id", projectId)
      .single();

    // If settings exist, return them
    if (existing && !fetchError) {
      return NextResponse.json({ settings: existing.settings || DEFAULT_SETTINGS });
    }

    // Check if error is because table doesn't exist (code 42P01) or row doesn't exist
    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows returned (expected when creating new)
      // Other errors might be table doesn't exist or other issues
      console.error("Error fetching project_settings:", fetchError);
      return NextResponse.json(
        { 
          error: "Database error", 
          details: fetchError.message,
          hint: "The project_settings table may not exist. Please create it first."
        },
        { status: 500 }
      );
    }

    // If not found (PGRST116), try to create default entry
    // If table doesn't exist, just return defaults without saving
    const { data: newSettings, error: createError } = await supabase
      .from("project_settings")
      .insert({
        project_id: projectId,
        settings: DEFAULT_SETTINGS
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating project_settings:", createError);
      // If table doesn't exist or other DB error, return defaults anyway
      // This allows the UI to work even if the table hasn't been created yet
      if (createError.code === "42P01" || createError.message?.includes("does not exist")) {
        console.warn("project_settings table does not exist, returning defaults without persistence");
        return NextResponse.json({ 
          settings: DEFAULT_SETTINGS,
          warning: "Settings table not found. Changes will not be saved until table is created."
        });
      }
      return NextResponse.json(
        { 
          error: "Failed to create default settings", 
          details: createError.message,
          hint: "The project_settings table may not exist. Please create it first."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ settings: newSettings.settings || DEFAULT_SETTINGS });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unhandled server error", details: String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, updates } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId in request body" },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid updates object" },
        { status: 400 }
      );
    }

    // Fetch current settings
    const { data: current, error: fetchError } = await supabase
      .from("project_settings")
      .select("settings")
      .eq("project_id", projectId)
      .single();

    // If no existing record, create one with defaults
    const currentSettings = current?.settings || DEFAULT_SETTINGS;

    // Deep merge updates into current settings
    const mergedSettings = {
      general: { ...currentSettings.general, ...(updates.general || {}) },
      domains: { ...currentSettings.domains, ...(updates.domains || {}) },
      hosting: { ...currentSettings.hosting, ...(updates.hosting || {}) },
      agent_defaults: { ...currentSettings.agent_defaults, ...(updates.agent_defaults || {}) },
      feature_flags: { ...currentSettings.feature_flags, ...(updates.feature_flags || {}) }
    };

    // Handle nested arrays (like development domains)
    if (updates.domains?.development !== undefined) {
      mergedSettings.domains.development = updates.domains.development;
    }

    // Upsert the settings
    const { data: updated, error: updateError } = await supabase
      .from("project_settings")
      .upsert({
        project_id: projectId,
        settings: mergedSettings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "project_id"
      })
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update settings", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      settings: updated.settings
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unhandled server error", details: String(err) },
      { status: 500 }
    );
  }
}

