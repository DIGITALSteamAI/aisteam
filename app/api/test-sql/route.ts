import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    // Simple approach: Check which tables from the codebase actually exist
    const knownTables = [
      'projects', 
      'project_settings', 
      'assistant_conversations',
      'assistant_messages', 
      'assistant_tasks',
      'assistant_workflows'
    ];
    
    const existingTables: string[] = [];
    
    for (const tableName of knownTables) {
      const { error } = await supabaseServer
        .from(tableName)
        .select('*')
        .limit(0);
      
      if (!error) {
        existingTables.push(tableName);
      }
    }

    return NextResponse.json({
      success: true,
      tables: existingTables,
      total: existingTables.length
    });
  } catch (err: any) {
    return NextResponse.json({
      error: "Failed to list tables",
      details: err.message
    }, { status: 500 });
  }
}

