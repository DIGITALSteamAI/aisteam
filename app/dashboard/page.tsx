"use client";

import PageWrapper from "../components/PageWrapper";

export default function Page() {
  return (
    <PageWrapper title="Dashboard" infoPage="dashboard">

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-600">Active Projects</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">3</p>
          <span className="text-xs text-slate-400">Ongoing</span>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-600">Tasks Today</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">7</p>
          <span className="text-xs text-slate-400">Tasks</span>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-600">Pending Tickets</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
          <span className="text-xs text-slate-400">Open</span>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-600">Agent Status</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">OK</p>
          <span className="text-xs text-slate-400">All running</span>
        </div>

      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-800">Quick Actions</h2>

          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-full bg-aisteam text-white text-xs font-medium hover:bg-aisteam-dark transition">
              Create Project
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-200 text-xs font-medium hover:bg-slate-300 transition">
              Add Task
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-200 text-xs font-medium hover:bg-slate-300 transition">
              New Ticket
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-200 text-xs font-medium hover:bg-slate-300 transition">
              Open Agent Panel
            </button>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-base font-semibold mb-3 text-slate-800">Recent Activity</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>User submitted a new ticket</li>
          <li>Task assigned to Agent Alpha</li>
          <li>Project Omega updated</li>
        </ul>
      </section>

    </PageWrapper>
  );
}
