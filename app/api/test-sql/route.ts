import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    // Use Supabase RPC to call a PostgreSQL function that lists tables
    // This queries pg_catalog.pg_tables which is accessible via RPC
    const { data, error } = await supabaseServer.rpc('exec_sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `
    });

    // If RPC doesn't exist, try direct query to pg_tables via a simpler approach
    // Actually, let's query a known table first to verify connection
    const { data: testData, error: testError } = await supabaseServer
      .from('projects')
      .select('id')
      .limit(1);

    if (testError) {
      return NextResponse.json({
        error: "Database connection test failed",
        details: testError.message,
        hint: "This confirms Supabase connection works, but we need a different method to list tables"
      }, { status: 500 });
    }

    // For listing tables, we'd typically need:
    // 1. A database function created in Supabase SQL editor, OR
    // 2. Supabase CLI with `supabase db execute`, OR  
    // 3. Direct PostgreSQL connection
    
    return NextResponse.json({
      success: true,
      message: "Supabase connection verified!",
      connectionTest: "Connected to 'projects' table successfully",
      note: "To list all tables, you would need to either:",
      options: [
        "1. Create a PostgreSQL function in Supabase SQL editor",
        "2. Use Supabase CLI: supabase db execute 'SELECT table_name FROM information_schema.tables WHERE table_schema = \\'public\\';'",
        "3. Use direct PostgreSQL connection with psql"
      ]
    });
  } catch (err: any) {
    return NextResponse.json({
      error: "SQL execution failed",
      details: err.message
    }, { status: 500 });
  }
}

