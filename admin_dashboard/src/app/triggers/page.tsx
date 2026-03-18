'use client';

import { CloudRain, Car, TrendingUp, AlertTriangle, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const triggers = [
  {
    id: 1,
    type: 'rain',
    name: 'Heavy Rain',
    icon: CloudRain,
    color: 'blue',
    zones: [
      { name: 'Andheri', current: 85, threshold: 50, isActive: true, affected: 127 },
      { name: 'Dadar', current: 42, threshold: 50, isActive: false, affected: 0 },
      { name: 'Kurla', current: 78, threshold: 50, isActive: true, affected: 89 },
      { name: 'Bandra', current: 35, threshold: 50, isActive: false, affected: 0 },
    ],
    description: 'Triggers when rainfall exceeds threshold in mm/hour',
    dataSource: 'OpenWeather API',
    lastUpdated: '2 min ago',
  },
  {
    id: 2,
    type: 'traffic',
    name: 'Traffic Congestion',
    icon: Car,
    color: 'orange',
    zones: [
      { name: 'Dadar', current: 72, threshold: 60, isActive: true, affected: 89 },
      { name: 'Andheri', current: 58, threshold: 60, isActive: false, affected: 0 },
      { name: 'Bandra', current: 45, threshold: 60, isActive: false, affected: 0 },
      { name: 'Kurla', current: 65, threshold: 60, isActive: true, affected: 67 },
    ],
    description: 'Triggers when traffic density exceeds threshold %',
    dataSource: 'Google Maps API',
    lastUpdated: '1 min ago',
  },
  {
    id: 3,
    type: 'surge',
    name: 'Surge Pricing',
    icon: TrendingUp,
    color: 'purple',
    zones: [
      { name: 'Bandra', current: 2.1, threshold: 2.5, isActive: false, affected: 0 },
      { name: 'Powai', current: 1.8, threshold: 2.5, isActive: false, affected: 0 },
      { name: 'Andheri', current: 2.3, threshold: 2.5, isActive: false, affected: 0 },
      { name: 'Malad', current: 1.5, threshold: 2.5, isActive: false, affected: 0 },
    ],
    description: 'Triggers when platform surge multiplier exceeds threshold',
    dataSource: 'Swiggy/Zepto API',
    lastUpdated: '30 sec ago',
  },
  {
    id: 4,
    type: 'accident',
    name: 'Accident Zone',
    icon: AlertTriangle,
    color: 'red',
    zones: [
      { name: 'Kurla', current: 3, threshold: 5, isActive: false, affected: 0 },
      { name: 'Thane', current: 2, threshold: 5, isActive: false, affected: 0 },
      { name: 'Andheri', current: 1, threshold: 5, isActive: false, affected: 0 },
      { name: 'Dadar', current: 4, threshold: 5, isActive: false, affected: 0 },
    ],
    description: 'Triggers when reported accidents in zone exceed threshold',
    dataSource: 'Traffic Police API',
    lastUpdated: '5 min ago',
  },
];

const colorMap = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'border-orange-200',
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    border: 'border-red-200',
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
  },
};

export default function TriggersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trigger Management</h1>
          <p className="text-slate-500">Monitor and configure parametric triggers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">All Systems Live</span>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </button>
        </div>
      </div>

      {/* Active Triggers Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {triggers.map((trigger) => {
          const colors = colorMap[trigger.color as keyof typeof colorMap];
          const activeZones = trigger.zones.filter((z) => z.isActive);
          const totalAffected = activeZones.reduce((sum, z) => sum + z.affected, 0);

          return (
            <div
              key={trigger.id}
              className={cn(
                'rounded-xl border-2 p-4 transition-all',
                activeZones.length > 0
                  ? `${colors.border} ${colors.light}`
                  : 'border-slate-200 bg-white'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('rounded-xl p-2.5', colors.bg)}>
                    <trigger.icon className={cn('h-5 w-5', colors.text)} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{trigger.name}</p>
                    <p className="text-xs text-slate-500">{trigger.lastUpdated}</p>
                  </div>
                </div>
                {activeZones.length > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {activeZones.length}
                  </span>
                )}
              </div>
              <div className="mt-3">
                {activeZones.length > 0 ? (
                  <p className={cn('text-sm font-medium', colors.text)}>
                    {totalAffected} policies affected
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">No active triggers</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trigger Details */}
      <div className="space-y-6">
        {triggers.map((trigger) => {
          const colors = colorMap[trigger.color as keyof typeof colorMap];

          return (
            <div
              key={trigger.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white',
                      colors.gradient
                    )}
                  >
                    <trigger.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{trigger.name}</h3>
                    <p className="text-sm text-slate-500">{trigger.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Data Source</p>
                    <p className="text-sm font-medium text-slate-700">{trigger.dataSource}</p>
                  </div>
                  <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Zone Grid */}
              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
                {trigger.zones.map((zone) => {
                  const percentage = Math.min(
                    (zone.current / zone.threshold) * 100,
                    100
                  );

                  return (
                    <div
                      key={zone.name}
                      className={cn(
                        'rounded-xl border p-4 transition-all',
                        zone.isActive
                          ? `${colors.border} ${colors.light}`
                          : 'border-slate-100 bg-slate-50/50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{zone.name}</p>
                        {zone.isActive && (
                          <span className="flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline justify-between">
                          <p
                            className={cn(
                              'text-2xl font-bold',
                              zone.isActive ? colors.text : 'text-slate-600'
                            )}
                          >
                            {zone.current}
                            <span className="text-sm font-normal text-slate-400">
                              /{zone.threshold}
                            </span>
                          </p>
                        </div>
                        <div className="mt-2">
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div
                              className={cn(
                                'h-2 rounded-full transition-all',
                                zone.isActive ? 'bg-red-500' : colors.text.replace('text', 'bg')
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        {zone.isActive && (
                          <p className="mt-2 text-xs text-red-600">
                            {zone.affected} policies affected
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
