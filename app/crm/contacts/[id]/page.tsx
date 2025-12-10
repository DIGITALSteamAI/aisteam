"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ContactDetailPage() {
  const params = useParams();
  const contact_id = params?.id as string;
  const [contact, setContact] = useState(null);
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

  if (!contact) return <div>Loading contact profile</div>;

  return (
    <div className="bg_white p_8 rounded text_slate_800 max_w_4xl mx_auto space_y_8">

      <h1 className="text_3xl font_bold">Contact Profile</h1>

      <div className="space_y_4">
        <label className="block text_sm">First Name</label>
        <input
          className="border p_2 rounded w_full"
          value={form.first_name}
          onChange={e => setForm({ ...form, first_name: e.target.value })}
        />

        <label className="block text_sm">Last Name</label>
        <input
          className="border p_2 rounded w_full"
          value={form.last_name}
          onChange={e => setForm({ ...form, last_name: e.target.value })}
        />

        <label className="block text_sm">Email</label>
        <input
          className="border p_2 rounded w_full"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label className="block text_sm">Phone</label>
        <input
          className="border p_2 rounded w_full"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <label className="block text_sm">Role</label>
        <input
          className="border p_2 rounded w_full"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        />

        <label className="flex items_center gap_2 mt_2">
          <input
            type="checkbox"
            checked={form.is_primary}
            onChange={e => setForm({ ...form, is_primary: e.target.checked })}
          />
          <span className="text_sm">Primary Contact</span>
        </label>

        <button
          onClick={save}
          disabled={saving}
          className="mt_4 px_4 py_2 bg_slate_800 text_white rounded"
        >
          {saving ? "Saving" : "Save Contact"}
        </button>
      </div>
    </div>
  );
}
