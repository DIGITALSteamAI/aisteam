"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageWrapper from "../../components/PageWrapper";

type Contact = {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  is_primary: boolean;
};

type Client = {
  id: string;
  name: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<(Contact & { client?: Client })[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      // Fetch all clients first to get client names
      const clientsRes = await fetch("/api/clients");
      const clientsJson = await clientsRes.json();
      const clientsMap = new Map<string, Client>();
      (clientsJson.clients || []).forEach((c: Client) => {
        clientsMap.set(c.id, c);
      });

      // Fetch contacts from all clients
      const allContacts: (Contact & { client?: Client })[] = [];
      
      for (const client of clientsMap.values()) {
        try {
          const contactsRes = await fetch(`/api/clients/${client.id}/contacts`);
          const contactsJson = await contactsRes.json();
          const clientContacts = (contactsJson.contacts || []).map((contact: Contact) => ({
            ...contact,
            client: client,
          }));
          allContacts.push(...clientContacts);
        } catch (err) {
          console.error(`Failed to load contacts for client ${client.id}:`, err);
        }
      }

      // Sort by last name
      allContacts.sort((a, b) => {
        const aName = `${a.last_name} ${a.first_name}`.toLowerCase();
        const bName = `${b.last_name} ${b.first_name}`.toLowerCase();
        return aName.localeCompare(bName);
      });

      setContacts(allContacts);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <PageWrapper title="Contacts">
        <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
          Loading contacts...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Contacts" infoPage="contacts-listing">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => router.push("/crm/contacts/new")}
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
                Client
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
                    {contact.client ? (
                      <Link
                        href={`/crm/clients/${contact.client.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.client.name}
                      </Link>
                    ) : (
                      "-"
                    )}
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
                  <Link
                    href={`/crm/contacts/${contact.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Contact
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contacts.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No contacts found. Create clients and add contacts to see them here.
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

