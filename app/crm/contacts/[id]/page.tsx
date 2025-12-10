"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageWrapper from "../../../components/PageWrapper";

export default function ContactDetailPage() {
  const params = useParams();
  const contact_id = params?.id as string;
  const [contact, setContact] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    is_primary: false
  });

  useEffect(() => {
    if (!contact_id) return;
    
    async function load() {
      try {
        const res = await fetch(`/api/contacts/${contact_id}`);
        const json = await res.json();
        const data = json.contact || json;
        setContact(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "",
          is_primary: data.is_primary || false
        });
      } catch (err) {
        console.error("Failed to load contact:", err);
      }
    }
    load();
  }, [contact_id]);

  async function save() {
    if (!contact_id) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/contacts/${contact_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      
      const json = await res.json();
      setContact(json.contact || json);
    } catch (err) {
      console.error("Failed to save contact:", err);
      alert("Failed to save contact. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!contact) return (
    <PageWrapper title="Contact Profile" infoPage="contact-details">
      <div className="p-8 text-center text-slate-600">Loading contact profile...</div>
    </PageWrapper>
  );

  return (
    <PageWrapper title="Contact Profile" infoPage="contact-details">
      <div className="bg-white p-8 rounded-lg text-slate-800 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Profile</h1>
        <Link href="/crm/contacts" className="text-blue-600 hover:underline">
          ← Back to Contacts
        </Link>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">First Name</label>
        <input
          className="border p-2 rounded w-full"
          value={form.first_name}
          onChange={e => setForm({ ...form, first_name: e.target.value })}
        />

        <label className="block text-sm font-medium">Last Name</label>
        <input
          className="border p-2 rounded w-full"
          value={form.last_name}
          onChange={e => setForm({ ...form, last_name: e.target.value })}
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

        <label className="block text-sm font-medium">Role</label>
        <input
          className="border p-2 rounded w-full"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        />

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.is_primary}
            onChange={e => setForm({ ...form, is_primary: e.target.checked })}
          />
          <span className="text-sm">Primary Contact</span>
        </label>

        <button
          onClick={save}
          disabled={saving}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Contact"}
        </button>
      </div>
      </div>
    </PageWrapper>
  );
}
