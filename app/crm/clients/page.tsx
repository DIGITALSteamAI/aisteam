"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ListingLayout from "../../components/listing/ListingLayout";

type Client = {
  id: string;
  name: string;
  website: string | null;
  phone: string | null;
  industry: string | null;
  status: string;
};

type FilterMode = "all" | "active" | "inactive" | "paused" | "closed";
type SortMode = "name-asc" | "name-desc" | "newest" | "oldest";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sortBy, setSortBy] = useState<SortMode>("name-asc");
  const router = useRouter();

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

  const visibleClients = useMemo(() => {
    let list = [...clients];

    // Apply filter
    if (filter !== "all") {
      list = list.filter(c => c.status.toLowerCase() === filter);
    }

    // Apply sort
    list.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      // For newest/oldest, we'd need created_at field - using name as fallback
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [clients, filter, sortBy]);

  if (loading) {
    return (
      <ListingLayout
        title="Clients"
        infoPageKey="clients-listing"
        filters={<div />}
        sorts={<div />}
        cardView={<div className="p-6 text-center text-slate-500">Loading clients...</div>}
        listView={<div className="p-6 text-center text-slate-500">Loading clients...</div>}
      />
    );
  }

  const filters = (
    <div className="flex items-center px-2 py-1 bg-white border rounded">
      <select
        className="bg-transparent text-sm outline-none text-slate-700 cursor-pointer"
        value={filter}
        onChange={e => setFilter(e.target.value as FilterMode)}
      >
        <option value="all">All clients</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="paused">Paused</option>
        <option value="closed">Closed</option>
      </select>
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
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );

  return (
    <ListingLayout
      title="Clients"
      infoPageKey="clients-listing"
      storageKey="clientsView"
      filters={filters}
      sorts={sorts}
      cardView={<ClientsCardsView clients={visibleClients} router={router} />}
      listView={<ClientsListView clients={visibleClients} router={router} />}
    />
  );
}

function ClientsCardsView({ clients, router }: { clients: Client[]; router: any }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {clients.map(client => (
        <div key={client.id} className="relative bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
          <div className="pr-12">
            <h3 className="text-lg font-semibold text-slate-900">{client.name}</h3>
            {client.website && (
              <p className="text-sm text-slate-600">
                <a
                  href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {client.website}
                </a>
              </p>
            )}
            {client.phone && <p className="text-sm text-slate-600">{client.phone}</p>}
            {client.industry && <p className="text-sm text-slate-600">{client.industry}</p>}
            <span
              className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                client.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {client.status}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/crm/clients/${client.id}`)}
              className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-200 text-slate-700 rounded-full text-xs hover:bg-slate-300 transition cursor-pointer"
            >
              View Client
            </button>
            <button
              onClick={() => router.push(`/crm/clients/${client.id}/contacts`)}
              className="px-3 py-1.5 bg-slate-200 text-xs rounded-full hover:bg-slate-300"
            >
              Contacts
            </button>
          </div>
        </div>
      ))}

      {clients.length === 0 && (
        <div className="col-span-full p-8 text-center text-slate-500">
          No clients found. Click "Add Client" to create your first client.
        </div>
      )}
    </section>
  );
}

function ClientsListView({ clients, router }: { clients: Client[]; router: any }) {
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
                Website
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">
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
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">{client.phone || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">{client.industry || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => router.push(`/crm/clients/${client.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Client
                    </button>
                    <button
                      onClick={() => router.push(`/crm/clients/${client.id}/contacts`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Contacts
                    </button>
                    <Link
                      href={`/projects?client=${client.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Projects
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clients.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No clients found. Click "Add Client" to create your first client.
          </div>
        )}
      </div>
    </section>
  );
}
