'use client';

import dynamic from 'next/dynamic';

type HeatPoint = {
  zone_id: string;
  zone_name: string;
  city: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  heat_score: number;
  active_riders: number;
  active_policies: number;
  open_claims: number;
};

const ZoneMapClient = dynamic(
  () => import('./ZoneMapClient').then((m) => m.ZoneMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Zone Coverage Map (OSM)</h3>
        <p className="mt-2 text-sm text-slate-500">Loading interactive map...</p>
      </div>
    ),
  }
);

export function ZoneMap({ points }: { points: HeatPoint[] }) {
  return <ZoneMapClient points={points} />;
}
