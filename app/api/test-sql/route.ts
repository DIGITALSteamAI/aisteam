import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    // Try to use Supabase REST API to query information_schema via RPC
    // First, let's try calling a function if it exists, otherwise use direct HTTP request
    
    // Method 1: Try RPC function (if it exists)
    const { data: rpcData, error: rpcError } = await supabaseServer.rpc('list_tables');
    
    if (!rpcError && rpcData) {
      return NextResponse.json({
        success: true,
        method: "RPC function",
        tables: rpcData
      });
    }

    // Method 2: Use Supabase REST API directly to query pg_catalog
    // We'll make a direct HTTP request to Supabase's REST API
    const supabaseUrl = process.env.SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Query information_schema via REST API
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/list_tables`,
      {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      }
    );

    if (response.ok) {
      const tables = await response.json();
      return NextResponse.json({
        success: true,
        method: "REST API RPC",
        tables: tables
      });
    }

    // Method 3: Query known tables by trying to access them
    // This is a workaround - we'll try common table names
    const knownTables = [
      'projects', 'project_settings', 'assistant_runs', 'assistant_tasks',
      'assistant_messages', 'assistant_conversations'
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
      method: "Table discovery (known tables)",
      tables: existingTables,
      note: "This only shows tables we tried. For complete list, create a PostgreSQL function in Supabase SQL editor:",
      sqlFunction: `
CREATE OR REPLACE FUNCTION list_tables()
RETURNS TABLE(table_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT t.table_name::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
  ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
  } catch (err: any) {
    return NextResponse.json({
      error: "Failed to list tables",
      details: err.message
    }, { status: 500 });
  }
}

