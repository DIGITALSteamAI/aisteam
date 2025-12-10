"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageWrapper from "../../../../components/PageWrapper";

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  is_primary: boolean;
};

export default function ClientContactsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id as string;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    is_primary: false,
  });

  useEffect(() => {
    if (!clientId) return;
    loadContacts();
  }, [clientId]);

  async function loadContacts() {
    try {
      const res = await fetch(`/api/clients/${clientId}/contacts`);
      const json = await res.json();
      setContacts(json.contacts || []);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          client_id: clientId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create contact");
      }

      setShowAddModal(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        is_primary: false,
      });
      loadContacts();
    } catch (err) {
      console.error("Failed to add contact:", err);
      alert("Failed to add contact. Please try again.");
    }
  }

  async function handleDelete(contactId: string) {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    setDeletingId(contactId);
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete contact");
      }

      loadContacts();
    } catch (err) {
      console.error("Failed to delete contact:", err);
      alert("Failed to delete contact. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <PageWrapper title="Loading contacts">
        <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
          Loading...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Client Contacts">
      <div className="mb-6 flex justify-between items-center">
        <Link
          href={`/crm/clients/${clientId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Client
        </Link>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          Add Contact
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Primary
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {contact.first_name} {contact.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">
                    {contact.email ? (
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">
                    {contact.phone ? (
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.phone}
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">{contact.role || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contact.is_primary ? (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Primary
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/crm/contacts/${contact.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={deletingId === contact.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deletingId === contact.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contacts.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No contacts found. Click "Add Contact" to create your first contact.
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
            <h2 className="text-lg font-semibold mb-4">Add Contact</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First Name *
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
                  Last Name *
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
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
                  <span className="text-sm text-slate-700">Primary Contact</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!formData.first_name || !formData.last_name}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

