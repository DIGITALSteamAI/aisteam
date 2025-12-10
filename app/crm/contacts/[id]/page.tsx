"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageWrapper from "../../../components/PageWrapper";

type Contact = {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

type Client = {
  id: string;
  name: string;
};

export default function ContactDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    is_primary: false,
  });

  useEffect(() => {
    if (!id) return;
    loadContact();
  }, [id]);

  async function loadContact() {
    try {
      const res = await fetch(`/api/contacts/${id}`);
      const json = await res.json();
      if (json.contact) {
        setContact(json.contact);
        setFormData({
          first_name: json.contact.first_name || "",
          last_name: json.contact.last_name || "",
          email: json.contact.email || "",
          phone: json.contact.phone || "",
          role: json.contact.role || "",
          is_primary: json.contact.is_primary || false,
        });

        // Load client info
        if (json.contact.client_id) {
          const clientRes = await fetch(`/api/clients/${json.contact.client_id}`);
          const clientJson = await clientRes.json();
          if (clientJson.client) {
            setClient(clientJson.client);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load contact:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      const json = await res.json();
      setContact(json.contact);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save contact:", err);
      alert("Failed to save contact. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      router.push(`/crm/clients/${contact?.client_id}`);
    } catch (err) {
      console.error("Failed to delete contact:", err);
      alert("Failed to delete contact. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <PageWrapper title="Loading contact">
        <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
          Loading...
        </div>
      </PageWrapper>
    );
  }

  if (!contact) {
    return (
      <PageWrapper title="Contact not found">
        <div className="bg-white border rounded-xl p-8">
          <h1 className="text-2xl font-semibold mb-2">Contact not found</h1>
          <p className="text-sm text-slate-600 mb-4">
            This contact does not exist or could not be loaded.
          </p>
          <Link href="/crm/clients" className="text-blue-600 hover:underline">
            ← Back to Clients
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`${contact.first_name} ${contact.last_name}`}>
      <div className="mb-6 flex justify-between items-center">
        <Link
          href={contact.client_id ? `/crm/clients/${contact.client_id}` : "/crm/clients"}
          className="text-blue-600 hover:underline"
        >
          ← Back to {client ? client.name : "Client"}
        </Link>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                Edit Contact
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    first_name: contact.first_name || "",
                    last_name: contact.last_name || "",
                    email: contact.email || "",
                    phone: contact.phone || "",
                    role: contact.role || "",
                    is_primary: contact.is_primary || false,
                  });
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              First Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            ) : (
              <p className="text-slate-900">{contact.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Last Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            ) : (
              <p className="text-slate-900">{contact.last_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            {editing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ) : (
              <p className="text-slate-900">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                ) : (
                  "-"
                )}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ) : (
              <p className="text-slate-900">
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                    {contact.phone}
                  </a>
                ) : (
                  "-"
                )}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ) : (
              <p className="text-slate-900">{contact.role || "-"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Primary Contact
            </label>
            {editing ? (
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
            ) : (
              <p className="text-slate-900">
                {contact.is_primary ? (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Primary Contact
                  </span>
                ) : (
                  "No"
                )}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Metadata</h3>
          <div className="space-y-1 text-sm text-slate-600">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(contact.created_at).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{" "}
              {new Date(contact.updated_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

