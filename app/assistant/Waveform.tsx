"use client";

export default function Waveform({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="flex justify-center my-4">
      <div className="flex items-end gap-1 h-12">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-blue-500 animate-wave"
            style={{
              animationDelay: `${i * 0.12}s`,
              height: `${22 + Math.sin(i) * 14}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
