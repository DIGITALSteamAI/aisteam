"use client";

export default function AgencyPanel() {
  return (
    <div className="bg-white border rounded-xl p-6">

      <div className="flex items-start justify-between mb-6">

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24">
              <circle cx="8" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="16" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4.5 17a3.8 3.8 0 0 1 7 0m2 0a3.8 3.8 0 0 1 7 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800">Agency</h2>
            <p className="text-xs text-slate-500 mt-0.5">Operations and admin</p>
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
        <li>Tasks</li>
        <li>Communications</li>
        <li>Reporting</li>
        <li>Revisions</li>
        <li>Billing</li>
      </ul>

    </div>
  );
}
