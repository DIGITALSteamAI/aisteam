"use client";

import { useEffect, useState } from "react";

export default function WebDesignPanel({ projectId }: { projectId: string }) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects/${projectId}/panels/web_design`);
        const json: any = await res.json();
        setMetrics(json.metrics || []);
      } catch (e) {
        setError("Could not load web design metrics");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  const find = (k: string) => metrics.find(m => m.key === k)?.value ?? "Not set";

  return (
    <div className="bg-white border rounded-xl p-6">

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="8" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 12h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800">Web Design</h2>
            <p className="text-xs text-slate-500 mt-0.5">Site structure and content updates</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 6v12m6-6H6"/></svg>
          </button>

          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.5" d="M9 4l7 8-7 8"/></svg>
          </button>
        </div>
      </div>

      {loading && <p className="text-xs text-slate-500 mb-3">Loading...</p>}
      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

      <div className="space-y-6">

        <section>
          <h3 className="text-[11px] font-semibold uppercase text-slate-500 mb-2">
            Project status
          </h3>
          <Metric label="Completion" value={find("completion_percent")} />
          <Metric label="Pages completed" value={find("pages_completed")} />
          <Metric label="Pages approved" value={find("pages_approved")} />
          <Metric label="UI issues" value={find("ui_issues")} />
        </section>

        <section>
          <h3 className="text-[11px] font-semibold uppercase text-slate-500 mb-2">
            CMS and plugins
          </h3>
          <Metric label="CMS" value={find("cms_version")} />
          <Metric label="Theme" value={find("theme_name")} />
          <Metric label="Builder" value={find("builder_name")} />
          <Metric label="Plugins" value={find("plugin_count")} />
        </section>

        <section>
          <h3 className="text-[11px] font-semibold uppercase text-slate-500 mb-2">
            Content
          </h3>
          <Metric label="Pages" value={find("page_count")} />
          <Metric label="Posts" value={find("post_count")} />
          <Metric label="Products" value={find("product_count")} />
        </section>

      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center h-4 mb-2">
      <span className="text-xs text-slate-700 font-medium">{label}</span>
      <span className="flex-1 mx-2 border-b border-dotted border-slate-300 opacity-70 translate-y-[1px]" />
      <span className="text-xs font-semibold text-slate-900">{value}</span>
    </div>
  );
}
