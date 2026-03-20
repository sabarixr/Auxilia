'use client';

type HeatPoint = {
  zone_id: string;
  zone_name: string;
  city: string;
  heat_score: number;
  active_riders: number;
  active_policies: number;
  open_claims: number;
};

function heatToColor(score: number) {
  if (score >= 0.75) return 'rgba(239,68,68,0.35)';
  if (score >= 0.5) return 'rgba(245,158,11,0.32)';
  if (score >= 0.25) return 'rgba(16,185,129,0.3)';
  return 'rgba(59,130,246,0.25)';
}

export function ZoneHeatmap({ points }: { points: HeatPoint[] }) {
  const sorted = [...points].sort((a, b) => b.heat_score - a.heat_score).slice(0, 8);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Zone Heatmap</h3>
        <p className="text-sm text-slate-500">Aggregated zone intensity by rider/policy/risk signals</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {sorted.map((point) => (
          <div key={point.zone_id} className="rounded-xl border border-slate-100 p-4" style={{ background: `radial-gradient(circle at top right, ${heatToColor(point.heat_score)}, rgba(255,255,255,0.95) 65%)` }}>
            <p className="text-sm font-semibold text-slate-900">{point.zone_name}</p>
            <p className="text-xs text-slate-500">{point.city}</p>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-orange-500" style={{ width: `${Math.min(point.heat_score * 100, 100)}%` }} />
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-600">
              <p>Riders: {point.active_riders}</p>
              <p>Policies: {point.active_policies}</p>
              <p>Open claims: {point.open_claims}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
