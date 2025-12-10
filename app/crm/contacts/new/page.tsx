"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageWrapper from "../../../components/PageWrapper";

type Client = {
  id: string;
  name: string;
};

export default function NewContactPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    is_primary: false,
  });

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch("/api/clients");
        const json = await res.json();
        setClients(json.clients || []);
      } catch (err) {
        console.error("Failed to load clients:", err);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create contact");
      }

      const json = await res.json();
      router.push(`/crm/contacts/${json.contact.id}`);
    } catch (err: any) {
      console.error("Failed to create contact:", err);
      alert(err.message || "Failed to create contact. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageWrapper title="Add Contact">
        <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
          Loading...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Add Contact">
      <div className="mb-6">
        <Link href="/crm/contacts" className="text-blue-600 hover:underline">
          ← Back to Contacts
        </Link>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_primary}
                onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">
                This is the primary contact for the client
              </span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Link
              href="/crm/contacts"
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Contact"}
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}

