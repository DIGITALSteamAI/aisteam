"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageWrapper from "../../components/PageWrapper";

type Client = {
  id: string;
  name: string;
  website: string | null;
  phone: string | null;
  industry: string | null;
  status: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <PageWrapper title="Clients">
        <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
          Loading clients...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Clients">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => router.push("/crm/clients/new")}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          Add Client
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
                    <Link
                      href={`/crm/clients/${client.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Client
                    </Link>
                    <Link
                      href={`/crm/clients/${client.id}/contacts`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Contacts
                    </Link>
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
    </PageWrapper>
  );
}

