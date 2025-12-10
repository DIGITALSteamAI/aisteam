"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidePanel() {
  const pathname = usePathname();

  const isActive = (route: string): boolean => {
    if (route === "/dashboard") {
      return pathname === "/" || pathname === route || pathname.startsWith(route + "/");
    }
    return pathname === route || pathname.startsWith(route + "/");
  };

  const linkClass = (active: boolean): string =>
    active
      ? "block px-3 py-2 rounded bg-slate-800 text-white transition"
      : "block px-3 py-2 rounded text-white hover:bg-slate-700 transition";

  const groupClass =
    "mb-4 p-3 rounded bg-slate-800 bg-opacity-30 border border-slate-700";

  const groupTitle =
    "text-xs uppercase tracking-wider text-slate-400 mb-2 px-1";

  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col px-5 py-8">

      <div className="mb-8 text-xl font-semibold tracking-wide">
        AISTEAM
      </div>

      <nav className="flex flex-col gap-4 text-sm">

        {/* WORK */}
        <div className={groupClass}>
          <div className={groupTitle}>Work</div>

          <Link href="/dashboard" className={linkClass(isActive("/dashboard"))}>
            Dashboard
          </Link>

          <Link href="/projects" className={linkClass(isActive("/projects"))}>
            Projects
          </Link>

          <Link href="/tasks" className={linkClass(isActive("/tasks"))}>
            Tasks
          </Link>
        </div>

        {/* CRM */}
        <div className={groupClass}>
          <div className={groupTitle}>CRM</div>

          <Link href="/crm/clients" className={linkClass(isActive("/crm/clients"))}>
            Clients
          </Link>

          <Link href="/crm/contacts" className={linkClass(isActive("/crm/contacts"))}>
            Contacts
          </Link>
        </div>

        {/* INTERACTIONS */}
        <div className={groupClass}>
          <div className={groupTitle}>Interactions</div>

          <Link href="/tickets" className={linkClass(isActive("/tickets"))}>
            Tickets
          </Link>

          <Link href="/profile" className={linkClass(isActive("/profile"))}>
            Profile
          </Link>
        </div>

        {/* SYSTEM */}
        <div className={groupClass}>
          <div className={groupTitle}>System</div>

          <Link href="/agents" className={linkClass(isActive("/agents"))}>
            Agents
          </Link>

          <Link href="/settings" className={linkClass(isActive("/settings"))}>
            Settings
          </Link>
        </div>

        {/* DOCUMENTATION - now last and styled identically */}
        <div className={groupClass}>
          <div className={groupTitle}>Documentation</div>

          <Link href="/kb" className={linkClass(isActive("/kb"))}>
            Dev Documentation
          </Link>
        </div>

      </nav>
    </aside>
  );
}
