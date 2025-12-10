"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ListingLayout from "../../components/listing/ListingLayout";

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

type FilterMode = "all" | "primary" | "by-client";
type SortMode = "name-asc" | "name-desc" | "recent";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<(Contact & { client?: Client })[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortMode>("name-asc");
  const router = useRouter();

  useEffect(() => {
    loadContacts();
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const res = await fetch("/api/clients");
      const json = await res.json();
      setClients(json.clients || []);
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
  }

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

  const visibleContacts = useMemo(() => {
    let list = [...contacts];

    // Apply filter
    if (filter === "primary") {
      list = list.filter(c => c.is_primary);
    } else if (filter === "by-client" && selectedClientId) {
      list = list.filter(c => c.client_id === selectedClientId);
    }

    // Apply sort
    list.sort((a, b) => {
      if (sortBy === "name-asc") {
        const aName = `${a.last_name} ${a.first_name}`.toLowerCase();
        const bName = `${b.last_name} ${b.first_name}`.toLowerCase();
        return aName.localeCompare(bName);
      }
      if (sortBy === "name-desc") {
        const aName = `${a.last_name} ${a.first_name}`.toLowerCase();
        const bName = `${b.last_name} ${b.first_name}`.toLowerCase();
        return bName.localeCompare(aName);
      }
      // For recent, we'd need updated_at - using name as fallback
      const aName = `${a.last_name} ${a.first_name}`.toLowerCase();
      const bName = `${b.last_name} ${b.first_name}`.toLowerCase();
      return aName.localeCompare(bName);
    });

    return list;
  }, [contacts, filter, selectedClientId, sortBy]);

  if (loading) {
    return (
      <ListingLayout
        title="Contacts"
        infoPageKey="contacts-listing"
        filters={<div />}
        sorts={<div />}
        cardView={<div className="p-6 text-center text-slate-500">Loading contacts...</div>}
        listView={<div className="p-6 text-center text-slate-500">Loading contacts...</div>}
      />
    );
  }

  const filters = (
    <div className="flex items-center gap-2">
      <div className="flex items-center px-2 py-1 bg-white border rounded">
        <select
          className="bg-transparent text-sm outline-none text-slate-700 cursor-pointer"
          value={filter}
          onChange={e => {
            setFilter(e.target.value as FilterMode);
            if (e.target.value !== "by-client") {
              setSelectedClientId("");
            }
          }}
        >
          <option value="all">All contacts</option>
          <option value="primary">Primary only</option>
          <option value="by-client">By client</option>
        </select>
      </div>
      {filter === "by-client" && (
        <div className="flex items-center px-2 py-1 bg-white border rounded">
          <select
            className="bg-transparent text-sm outline-none text-slate-700 cursor-pointer"
            value={selectedClientId}
            onChange={e => setSelectedClientId(e.target.value)}
          >
            <option value="">Select client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const sorts = (
    <div className="flex items-center px-2 py-1 bg-white border rounded">
      <select
        className="bg-transparent text-sm outline-none text-slate-700 cursor-pointer"
        value={sortBy}
        onChange={e => setSortBy(e.target.value as SortMode)}
      >
        <option value="name-asc">Name A to Z</option>
        <option value="name-desc">Name Z to A</option>
        <option value="recent">Recently edited</option>
      </select>
    </div>
  );

  const actionButton = (
    <button
      onClick={() => router.push("/crm/contacts/new")}
      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
    >
      Add Contact
    </button>
  );

  return (
    <ListingLayout
      title="Contacts"
      infoPageKey="contacts-listing"
      storageKey="contactsView"
      filters={filters}
      sorts={sorts}
      cardView={<ContactsCardsView contacts={visibleContacts} router={router} />}
      listView={<ContactsListView contacts={visibleContacts} router={router} />}
      actionButton={actionButton}
    />
  );
}

function ContactsCardsView({ contacts, router }: { contacts: (Contact & { client?: Client })[]; router: any }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {contacts.map(contact => (
        <div key={contact.id} className="relative bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
          <div className="pr-12">
            <h3 className="text-lg font-semibold text-slate-900">
              {contact.first_name} {contact.last_name}
              {contact.is_primary && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Primary
                </span>
              )}
            </h3>
            {contact.client && (
              <p className="text-sm text-slate-600">
                <Link
                  href={`/crm/clients/${contact.client.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.client.name}
                </Link>
              </p>
            )}
            {contact.email && (
              <p className="text-sm text-slate-600">
                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                  {contact.email}
                </a>
              </p>
            )}
            {contact.phone && (
              <p className="text-sm text-slate-600">
                <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                  {contact.phone}
                </a>
              </p>
            )}
            {contact.role && <p className="text-sm text-slate-600">{contact.role}</p>}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/crm/contacts/${contact.id}`)}
              className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-200 text-slate-700 rounded-full text-xs hover:bg-slate-300 transition cursor-pointer"
            >
              View Contact
            </button>
          </div>
        </div>
      ))}

      {contacts.length === 0 && (
        <div className="col-span-full p-8 text-center text-slate-500">
          No contacts found. Create clients and add contacts to see them here.
        </div>
      )}
    </section>
  );
}

function ContactsListView({ contacts, router }: { contacts: (Contact & { client?: Client })[]; router: any }) {
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
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
                  <button
                    onClick={() => router.push(`/crm/contacts/${contact.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Contact
                  </button>
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
    </section>
  );
}
