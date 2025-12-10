"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ClientDetailPage() {
  const params = useParams();
  const client_id = params?.id as string;
  const [client, setClient] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    website: "",
    email: "",
    phone: "",
    industry: "",
    status: "active"
  });

  useEffect(() => {
    if (!client_id) return;
    
    async function load() {
      try {
        const res = await fetch(`/api/clients/${client_id}`);
        const json = await res.json();
        const data = json.client || json;
        setClient(data);
        setForm({
          name: data.name || "",
          website: data.website || "",
          email: data.email || "",
          phone: data.phone || "",
          industry: data.industry || "",
          status: data.status || "active"
        });
      } catch (err) {
        console.error("Failed to load client:", err);
      }
    }
    load();
  }, [client_id]);

  async function saveClient() {
    if (!client_id) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${client_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      
      const json = await res.json();
      setClient(json.client || json);
    } catch (err) {
      console.error("Failed to save client:", err);
      alert("Failed to save client. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!client) return <div className="p-8 text-center text-slate-600">Loading client profile...</div>;

  return (
    <div className="bg-white p-8 rounded-lg text-slate-800 space-y-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client Profile</h1>
        <Link href="/crm/clients" className="text-blue-600 hover:underline">
          ← Back to Clients
        </Link>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Client Name</label>
        <input
          className="border p-2 rounded w-full"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <label className="block text-sm font-medium">Website</label>
        <input
          className="border p-2 rounded w-full"
          value={form.website}
          onChange={e => setForm({ ...form, website: e.target.value })}
        />

        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="border p-2 rounded w-full"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label className="block text-sm font-medium">Phone</label>
        <input
          className="border p-2 rounded w-full"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <label className="block text-sm font-medium">Industry</label>
        <input
          className="border p-2 rounded w-full"
          value={form.industry}
          onChange={e => setForm({ ...form, industry: e.target.value })}
        />

        <label className="block text-sm font-medium">Status</label>
        <select
          className="border p-2 rounded w-full"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>

        <button
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition"
          onClick={saveClient}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Client"}
        </button>
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-2">Credentials Panel</h2>
        <p className="text-sm text-slate-600">
          This section will display encrypted credentials for CMS, hosting, domain, and database.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-2">Contacts</h2>
        <Link
          className="text-blue-600 underline hover:text-blue-800"
          href={`/crm/clients/${client_id}/contacts`}
        >
          Manage all contacts →
        </Link>
      </div>
    </div>
  );
}
