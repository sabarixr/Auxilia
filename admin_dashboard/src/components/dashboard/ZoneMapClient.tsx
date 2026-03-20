'use client';

import { useEffect, useMemo, useState } from 'react';

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

type Cluster = {
  centerLat: number;
  centerLon: number;
  points: HeatPoint[];
};

type MapLib = typeof import('react-leaflet');

function ViewportEvents({ useMapEventsHook, onZoom }: { useMapEventsHook: MapLib['useMapEvents']; onZoom: (value: number) => void }) {
  useMapEventsHook({
    zoomend(e) {
      onZoom(e.target.getZoom());
    },
  });
  return null;
}

function FitBounds({ useMapHook, points, onZoom }: { useMapHook: MapLib['useMap']; points: HeatPoint[]; onZoom: (value: number) => void }) {
  const map = useMapHook();
  useEffect(() => {
    if (points.length === 1) {
      const p = points[0];
      map.fitBounds(
        [
          [p.latitude - 0.05, p.longitude - 0.05],
          [p.latitude + 0.05, p.longitude + 0.05],
        ],
        { padding: [24, 24] }
      );
    } else {
      map.fitBounds(points.map((p) => [p.latitude, p.longitude] as [number, number]), { padding: [24, 24] });
    }
    onZoom(map.getZoom());
    // Fit only when point set changes, not on every zoom update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, points]);
  return null;
}

function heatColor(score: number): string {
  if (score >= 0.75) return '#ef4444';
  if (score >= 0.5) return '#f59e0b';
  if (score >= 0.25) return '#10b981';
  return '#3b82f6';
}

function bucketByZoom(zoom: number): number {
  if (zoom <= 5) return 1.6;
  if (zoom <= 6) return 1.0;
  if (zoom <= 7) return 0.55;
  if (zoom <= 8) return 0.32;
  if (zoom <= 10) return 0.15;
  return 0.07;
}

export function ZoneMapClient({ points }: { points: HeatPoint[] }) {
  const [zoom, setZoom] = useState(5);
  const [MapLib, setMapLib] = useState<MapLib | null>(null);

  useEffect(() => {
    let active = true;
    import('react-leaflet').then((mod) => {
      if (active) setMapLib(mod);
    });
    return () => {
      active = false;
    };
  }, []);

  const clusters = useMemo<Cluster[]>(() => {
    const bucket = bucketByZoom(zoom);
    const map = new Map<string, Cluster>();

    for (const point of points) {
      const key = `${Math.round(point.latitude / bucket)}:${Math.round(point.longitude / bucket)}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, { centerLat: point.latitude, centerLon: point.longitude, points: [point] });
        continue;
      }
      const count = existing.points.length;
      existing.points.push(point);
      existing.centerLat = (existing.centerLat * count + point.latitude) / (count + 1);
      existing.centerLon = (existing.centerLon * count + point.longitude) / (count + 1);
    }

    return [...map.values()];
  }, [points, zoom]);

  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Zone Coverage Map</h3>
        <p className="mt-2 text-sm text-slate-500">No zone data available yet.</p>
      </div>
    );
  }

  if (!MapLib) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Zone Coverage Map (OSM)</h3>
        <p className="mt-2 text-sm text-slate-500">Loading interactive map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Circle, CircleMarker, Tooltip, Popup, useMap, useMapEvents } = MapLib;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Zone Coverage Map (OSM)</h3>
        <p className="text-sm text-slate-500">Drag and zoom freely. Dense points merge while zoomed out.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <MapContainer className="h-[430px] w-full" center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ViewportEvents useMapEventsHook={useMapEvents} onZoom={setZoom} />
          <FitBounds useMapHook={useMap} points={points} onZoom={setZoom} />

          {clusters.map((cluster, idx) => {
            if (cluster.points.length > 1) {
              const avgHeat = cluster.points.reduce((sum, p) => sum + p.heat_score, 0) / cluster.points.length;
              const color = heatColor(avgHeat);
              return (
                <CircleMarker
                  key={`cluster-${idx}`}
                  center={[cluster.centerLat, cluster.centerLon]}
                  radius={Math.min(24, 10 + cluster.points.length * 1.8)}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.45, weight: 2 }}
                >
                  <Tooltip direction="top" opacity={0.95}>
                    {cluster.points.length} zones combined
                  </Tooltip>
                  <Popup>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-slate-900">Combined zones ({cluster.points.length})</p>
                      {cluster.points.slice(0, 10).map((p) => (
                        <p key={p.zone_id} className="text-slate-700">
                          {p.zone_name} ({p.city}) - {(p.heat_score * 100).toFixed(0)}%
                        </p>
                      ))}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            }

            const point = cluster.points[0];
            const color = heatColor(point.heat_score);
            return (
              <Circle
                key={point.zone_id}
                center={[point.latitude, point.longitude]}
                radius={Math.max(600, (point.radius_km || 5) * 1000)}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.16, weight: 2 }}
              >
                <Tooltip direction="top" opacity={0.95}>
                  {point.zone_name} - {(point.heat_score * 100).toFixed(0)}%
                </Tooltip>
                <Popup>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-slate-900">{point.zone_name}</p>
                    <p className="text-slate-700">{point.city}</p>
                    <p className="text-slate-700">Heat: {(point.heat_score * 100).toFixed(0)}%</p>
                    <p className="text-slate-700">Riders: {point.active_riders}</p>
                    <p className="text-slate-700">Policies: {point.active_policies}</p>
                    <p className="text-slate-700">Open claims: {point.open_claims}</p>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
