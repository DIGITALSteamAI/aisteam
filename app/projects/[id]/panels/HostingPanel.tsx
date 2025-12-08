"use client";

export default function HostingPanel() {
  return (
    <div className="bg-white border rounded-xl p-6">

      <div className="flex items-start justify-between mb-6">

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="6" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="4" y="10" width="16" height="6" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="4" y="16" width="16" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="8" cy="7" r="0.8" fill="currentColor" />
              <circle cx="8" cy="13" r="0.8" fill="currentColor" />
            </svg>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800">Hosting</h2>
            <p className="text-xs text-slate-500 mt-0.5">Infrastructure and uptime</p>
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

      <ul className="text-sm text-slate-700 space-y-2">
        <li>DNS</li>
        <li>SSL</li>
        <li>Backups</li>
        <li>Staging</li>
        <li>Email hosting</li>
      </ul>

    </div>
  );
}
