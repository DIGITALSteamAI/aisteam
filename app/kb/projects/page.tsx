"use client";

import Link from "next/link";

export default function KBProjectsPage() {
  return (
    <div className="bg-white border rounded-xl p-8 text-slate-800 space-y-10">

      <h1 className="text-3xl font-bold">Projects Documentation</h1>

      <p className="text-sm max-w-3xl">
        This section documents all project related modules including the Listings view,
        the Project Details dashboard and every panel inside that dashboard.
      </p>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contents</h2>

        <ul className="ml-4 list-disc text-sm space-y-2">

          {/* LEVEL 1 */}
          <li>
            <Link href="/kb/projects/project-listings" className="text-blue-600 hover:underline">
              Project Listings
            </Link>
          </li>

          <li>
            <Link href="/kb/projects/project-details" className="text-blue-600 hover:underline">
              Project Details
            </Link>

            {/* LEVEL 2 under Project Details */}
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
      </section>

    </div>
  );
}
