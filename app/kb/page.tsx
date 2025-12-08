"use client";

import Link from "next/link";

export default function KBHomePage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-800 space-y-10">

      <h1 className="text-3xl font-bold">Knowledge Base</h1>

      <p className="text-sm max-w-3xl">
        This Knowledge Base contains developer documentation for all major sections
        of the AISTEAM system. Content is grouped in the same hierarchy as the application
        structure to keep navigation consistent and predictable.
      </p>

      {/* WORK GROUP */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Work</h2>
        <ul className="ml-4 list-disc text-sm space-y-1">

          <li>
            <Link href="/kb/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
          </li>

          <li>
            <Link href="/kb/projects" className="text-blue-600 hover:underline">
              Projects
            </Link>
            <ul className="ml-6 list-disc space-y-1 mt-1">
              <li>
                <Link href="/kb/projects/project-listings" className="text-blue-600 hover:underline">
                  Project Listings
                </Link>
              </li>
              <li>
                <Link href="/kb/projects/project-details" className="text-blue-600 hover:underline">
                  Project Details
                </Link>

                {/* SUB PANELS */}
                <ul className="ml-6 list-disc space-y-1 mt-1">
                  <li>
                    <Link href="/kb/projects/project-details/branding" className="text-blue-600 hover:underline">
                      Branding Panel
                    </Link>
                  </li>
                  <li>
                    <Link href="/kb/projects/project-details/web-design" className="text-blue-600 hover:underline">
                      Web Design Panel
                    </Link>
                  </li>
                  <li>
                    <Link href="/kb/projects/project-details/performances" className="text-blue-600 hover:underline">
                      Performances Panel
                    </Link>
                  </li>
                  <li>
                    <Link href="/kb/projects/project-details/hosting" className="text-blue-600 hover:underline">
                      Hosting Panel
                    </Link>
                  </li>
                  <li>
                    <Link href="/kb/projects/project-details/agency" className="text-blue-600 hover:underline">
                      Agency Panel
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li>
            <Link href="/kb/tasks" className="text-blue-600 hover:underline">Tasks</Link>
          </li>
        </ul>
      </section>

      {/* RELATIONSHIPS */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Relationships</h2>
        <ul className="ml-4 list-disc text-sm space-y-1">
          <li><Link href="/kb/businesses" className="text-blue-600 hover:underline">Businesses</Link></li>
          <li><Link href="/kb/contacts" className="text-blue-600 hover:underline">Contacts</Link></li>
          <li><Link href="/kb/clients" className="text-blue-600 hover:underline">Clients</Link></li>
        </ul>
      </section>

      {/* INTERACTIONS */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Interactions</h2>
        <ul className="ml-4 list-disc text-sm space-y-1">
          <li><Link href="/kb/tickets" className="text-blue-600 hover:underline">Tickets</Link></li>
          <li><Link href="/kb/profile" className="text-blue-600 hover:underline">Profile</Link></li>
        </ul>
      </section>

      {/* SYSTEM */}
      <section>
        <h2 className="text-xl font-semibold mb-3">System</h2>
        <ul className="ml-4 list-disc text-sm space-y-1">
          <li><Link href="/kb/agents" className="text-blue-600 hover:underline">Agents</Link></li>
          <li><Link href="/kb/settings" className="text-blue-600 hover:underline">Settings</Link></li>
          <li><Link href="/kb/assistant" className="text-blue-600 hover:underline">Assistant</Link></li>
        </ul>
      </section>

    </div>
  );
}
