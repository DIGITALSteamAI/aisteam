"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageWrapper from "../../../components/PageWrapper";

type Client = {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  is_primary: boolean;
};

type Project = {
  id: string;
  name: string;
  domain: string | null;
};

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    phone: "",
    industry: "",
    status: "active",
  });

  useEffect(() => {
    if (!id) return;
    loadClient();
    loadContacts();
    loadProjects();
  }, [id]);

  async function loadClient() {
    try {
      const res = await fetch(`/api/clients/${id}`);
      const json = await res.json();
      if (json.client) {
        setClient(json.client);
        setFormData({
          name: json.client.name || "",
          website: json.client.website || "",
          email: json.client.email || "",
          phone: json.client.phone || "",
          industry: json.client.industry || "",
          status: json.client.status || "active",
        });
      }
    } catch (err) {
      console.error("Failed to load client:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadContacts() {
    try {
      const res = await fetch(`/api/clients/${id}/contacts`);
      const json = await res.json();
      setContacts(json.contacts || []);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    }
  }

  async function loadProjects() {
    try {
      const res = await fetch(`/api/projects?client_id=${id}`);
      const json = await res.json();
      setProjects(json.projects || []);
    } catch (err) {
      // Projects API might not support client_id filter yet
      console.error("Failed to load projects:", err);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      const json = await res.json();
      setClient(json.client);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save client:", err);
      alert("Failed to save client. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageWrapper title="Loading client">
        <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
          Loading...
        </div>
      </PageWrapper>
    );
  }

  if (!client) {
    return (
      <PageWrapper title="Client not found">
        <div className="bg-white border rounded-xl p-8">
          <h1 className="text-2xl font-semibold mb-2">Client not found</h1>
          <p className="text-sm text-slate-600 mb-4">
            This client does not exist or could not be loaded.
          </p>
          <Link
            href="/crm/clients"
            className="text-blue-600 hover:underline"
          >
            ← Back to Clients
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={client.name}>
      <div className="mb-6 flex justify-between items-center">
        <Link
          href="/crm/clients"
          className="text-blue-600 hover:underline"
        >
          ← Back to Clients
        </Link>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Edit Client
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditing(false);
                setFormData({
                  name: client.name || "",
                  website: client.website || "",
                  email: client.email || "",
                  phone: client.phone || "",
                  industry: client.industry || "",
                  status: client.status || "active",
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
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Client Info */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-slate-900">{client.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Website
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-slate-900">
                  {client.website ? (
                    <a
                      href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {client.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
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
                  {client.email ? (
                    <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                      {client.email}
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
                  {client.phone ? (
                    <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                      {client.phone}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Industry
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-slate-900">{client.industry || "-"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              {editing ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              ) : (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    client.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {client.status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contacts Panel */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Contacts</h2>
            <Link
              href={`/crm/clients/${id}/contacts`}
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {contacts.length === 0 ? (
            <p className="text-sm text-slate-500 mb-4">No contacts yet.</p>
          ) : (
            <div className="space-y-3">
              {contacts.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium text-slate-900">
                      {contact.first_name} {contact.last_name}
                      {contact.is_primary && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      {contact.email || contact.phone || contact.role || ""}
                    </div>
                  </div>
                  <Link
                    href={`/crm/contacts/${contact.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}

          <Link
            href={`/crm/clients/${id}/contacts?add=true`}
            className="mt-4 block text-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
          >
            Add Contact
          </Link>
        </div>

        {/* Projects Panel */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Projects</h2>

          {projects.length === 0 ? (
            <p className="text-sm text-slate-500">No projects yet.</p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block py-2 text-blue-600 hover:underline"
                >
                  {project.name} {project.domain && `(${project.domain})`}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Meta Panel */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Metadata</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-500">Created:</span>{" "}
              <span className="text-slate-900">
                {new Date(client.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Updated:</span>{" "}
              <span className="text-slate-900">
                {new Date(client.updated_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Slug:</span>{" "}
              <span className="text-slate-900">{client.slug}</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

