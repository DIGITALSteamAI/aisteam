"use client";

type PanelShimmerProps = {
  show: boolean;
};

export default function PanelShimmer({ show }: PanelShimmerProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 bg-white/95 flex flex-col p-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-slate-200 animate-pulse" />
          <div className="h-2 w-48 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>

      {/* Message skeletons */}
      <div className="flex-1 space-y-3 overflow-hidden">
        <div className="flex justify-start">
          <div className="w-3/4 max-w-[260px] rounded-lg bg-slate-100 p-3 space-y-2 animate-pulse">
            <div className="h-2.5 w-24 rounded bg-slate-200" />
            <div className="h-2.5 w-40 rounded bg-slate-200" />
            <div className="h-2.5 w-32 rounded bg-slate-200" />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-2/3 max-w-[220px] rounded-lg bg-slate-200 p-3 space-y-2 animate-pulse">
            <div className="h-2.5 w-32 rounded bg-slate-300" />
            <div className="h-2.5 w-20 rounded bg-slate-300" />
          </div>
        </div>

        <div className="flex justify-start">
          <div className="w-4/5 max-w-[280px] rounded-lg bg-slate-100 p-3 space-y-2 animate-pulse">
            <div className="h-2.5 w-28 rounded bg-slate-200" />
            <div className="h-2.5 w-44 rounded bg-slate-200" />
            <div className="h-2.5 w-36 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-9 rounded-lg bg-slate-100 animate-pulse" />
        <div className="w-16 h-9 rounded-lg bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
