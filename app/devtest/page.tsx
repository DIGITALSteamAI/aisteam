import { supabase } from "@/lib/supabaseClient";

export default async function DevTestPage() {
  const { data, error } = await supabase
    .from("projects")
    .select("*");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Supabase Connection Test</h1>

      {error && (
        <pre style={{ color: "red" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      {data && (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
