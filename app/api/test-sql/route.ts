import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    // Use Supabase REST API directly with service role key to query pg_catalog
    const supabaseUrl = process.env.SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Method 1: Try to query pg_tables via REST API
    // Supabase exposes some system tables through PostgREST
    const response = await fetch(
      `${supabaseUrl}/rest/v1/pg_tables?schema=eq.public&select=tablename`,
      {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json({
          success: true,
          method: "Direct REST API query (pg_tables)",
          tables: data.map((t: any) => t.tablename).sort()
        });
      }
    }

    // Method 2: Try RPC function (if it exists)
    const { data: rpcData, error: rpcError } = await supabaseServer.rpc('list_tables');
    
    if (!rpcError && rpcData) {
      return NextResponse.json({
        success: true,
        method: "RPC function",
        tables: rpcData
      });
    }

    // Method 3: Query known tables by trying to access them
    // Based on codebase analysis, these are the tables we know about
    const knownTables = [
      'projects', 
      'project_settings', 
      'assistant_conversations',
      'assistant_messages', 
      'assistant_tasks',
      'assistant_workflows'
    ];
    
    const existingTables: { name: string; accessible: boolean; error?: string }[] = [];
    
    for (const tableName of knownTables) {
      const { error } = await supabaseServer
        .from(tableName)
        .select('*')
        .limit(0);
      
      existingTables.push({
        name: tableName,
        accessible: !error,
        error: error?.message
      });
    }

    return NextResponse.json({
      success: true,
      method: "Table discovery (known tables from codebase)",
      totalChecked: knownTables.length,
      tables: existingTables.filter(t => t.accessible).map(t => t.name),
      allTables: existingTables,
      note: "To get a complete list of ALL tables, run this SQL in Supabase SQL Editor:",
      sqlQuery: `
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
      `
    });
  } catch (err: any) {
    return NextResponse.json({
      error: "Failed to list tables",
      details: err.message
    }, { status: 500 });
  }
}

