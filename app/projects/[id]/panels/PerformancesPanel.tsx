"use client";

import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

/* MAIN COMPONENT */
export default function PerformancesPanel({ projectId }: { projectId: string }) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [trendMode, setTrendMode] = useState("yesterday");
  const [loading, setLoading] = useState(true);
  const [showTrendModal, setShowTrendModal] = useState(false);

  async function load(mode = trendMode) {
    const res = await fetch(
      `/api/projects/${projectId}/panels/performance?trend_mode=${mode}`
    );
    const json: any = await res.json();
    setMetrics(json.metrics || []);
    setTrendMode(json.trend_mode);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [projectId]);

  const subtitles: Record<string, string> = {
    yesterday: "Today vs Yesterday",
    weekly: "This Week vs Last Week",
    monthly: "This Month vs Last Month",
    yearly: "This Year vs Last Year"
  };

  const grouped = {
    performance: metrics.filter(m => m.group === "performance"),
    traffic: metrics.filter(m => m.group === "traffic"),
    followers: metrics.filter(m => m.group === "followers")
  };

  return (
    <div className="bg-white border rounded-xl p-6">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24">
              <path
                d="M5 15.5 10 11l3 3 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 19h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <circle
                cx="7"
                cy="8"
                r="1.3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Performances
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{subtitles[trendMode]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">

          {/* COG FIRST */}
          <button
            onClick={() => setShowTrendModal(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>

          {/* REFRESH LAST */}
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-xs text-slate-500 mb-3">Loading...</p>
      )}

      {!loading && (
        <div className="space-y-6">

          <MetricGroup
            title="Performances"
            items={grouped.performance}
          />

          <MetricGroup
            title="Website traffic"
            items={grouped.traffic}
          />

          <MetricGroup
            title="Followers"
            items={grouped.followers}
          />
        </div>
      )}

      {showTrendModal && (
        <TrendModal
          currentMode={trendMode}
          onClose={() => setShowTrendModal(false)}
          onChange={async mode => {
            // Update DB
            await fetch("/api/projects/settings/trend", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                project_id: projectId,
                trend_mode: mode
              })
            });

            setTrendMode(mode);
            setShowTrendModal(false);
            await load(mode);
          }}
        />
      )}
    </div>
  );
}

/* METRIC GROUP LIST */
function MetricGroup({ title, items }: { title: string; items: any[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase text-slate-500 mb-2">
        {title}
      </h3>

      <div className="space-y-1">
        {items.map(m => (
          <MetricRow
            key={m.key}
            label={m.label}
            value={m.display_value}
            prev={m.compare_value}
            trend={m.trend}
          />
        ))}
      </div>
    </div>
  );
}

/* ONE ROW */
function MetricRow({
  label,
  value,
  prev,
  trend
}: {
  label: string;
  value: string;
  prev: string;
  trend: "up" | "down" | "same" | "na";
}) {
  const TrendIcon = () => {
    if (trend === "up")
      return <span className="text-green-600 text-[10px] font-bold">▲</span>;
    if (trend === "down")
      return <span className="text-red-600 text-[10px] font-bold">▼</span>;
    if (trend === "same")
      return <span className="text-slate-400 text-[10px] font-bold">■</span>;
    return <span className="opacity-0 text-[10px]">■</span>;
  };

  return (
    <div className="flex items-center h-4 mb-2">
      <span className="text-xs text-slate-700 font-medium">{label}</span>

      <span className="flex-1 mx-2 border-b border-dotted border-slate-300 opacity-60 translate-y-[1px]" />

      <div className="flex items-center gap-0.5 text-xs font-semibold text-slate-900">
        {prev
          ? `${value} (${prev}`
          : `${value}`}
        {prev && <TrendIcon />}
        {prev && ")"}
      </div>
    </div>
  );
}

/* TREND MODAL */
function TrendModal({
  currentMode,
  onClose,
  onChange
}: {
  currentMode: string;
  onClose: () => void;
  onChange: (m: string) => void;
}) {
  const [selected, setSelected] = useState(currentMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">

        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Trend settings
        </h2>

        <p className="text-sm text-slate-600 mb-5">
          Control how performance metrics are compared across time periods.
        </p>

        {[
          {
            key: "yesterday",
            label: "Yesterday",
            desc: "Compares today's values with yesterday's values."
          },
          {
            key: "weekly",
            label: "Last seven days",
            desc: "Compares this week's average with last week's average."
          },
          {
            key: "monthly",
            label: "Last thirty days",
            desc: "Compares this month's average with last month's average."
          },
          {
            key: "yearly",
            label: "Last year",
            desc: "Compares today's values with the same day last year."
          }
        ].map(opt => (
          <label
            key={opt.key}
            className="flex items-start gap-3 cursor-pointer mb-4"
          >
            <input
              type="radio"
              name="trendMethod"
              className="mt-1"
              checked={selected === opt.key}
              onChange={() => setSelected(opt.key)}
            />
            <div>
              <div className="text-sm font-medium text-slate-800">
                {opt.label}
              </div>
              <div className="text-xs text-slate-500">{opt.desc}</div>
            </div>
          </label>
        ))}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onChange(selected)}
            className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800"
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
