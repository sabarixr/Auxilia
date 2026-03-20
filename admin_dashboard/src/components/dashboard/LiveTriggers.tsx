'use client';

import { CloudRain, Car, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Trigger = {
  zone: string;
  type: string;
  current: number;
  threshold: number;
  affectedPolicies?: number;
  isActive: boolean;
};

const iconMap = {
  rain: CloudRain,
  traffic: Car,
  surge: TrendingUp,
  road_disruption: AlertTriangle,
};

const colorMap = {
  rain: {
    bg: 'bg-blue-100', text: 'text-blue-600', progress: 'bg-blue-500', progressBg: 'bg-blue-100',
  },
  traffic: {
    bg: 'bg-orange-100', text: 'text-orange-600', progress: 'bg-orange-500', progressBg: 'bg-orange-100',
  },
  surge: {
    bg: 'bg-purple-100', text: 'text-purple-600', progress: 'bg-purple-500', progressBg: 'bg-purple-100',
  },
  road_disruption: {
    bg: 'bg-red-100', text: 'text-red-600', progress: 'bg-red-500', progressBg: 'bg-red-100',
  },
};

export function LiveTriggers({ triggers }: { triggers: Trigger[] }) {
  const hasTriggers = triggers.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Live Triggers</h3>
          <p className="text-sm text-slate-500">Real-time parametric trigger monitoring</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-700">Live</span>
        </div>
      </div>

      {hasTriggers ? (
        <div className="space-y-4">
          {triggers.map((trigger, index) => {
          const Icon = iconMap[trigger.type as keyof typeof iconMap] ?? AlertTriangle;
          const colors = colorMap[trigger.type as keyof typeof colorMap] ?? colorMap.road_disruption;
          const percentage = Math.min((trigger.current / Math.max(trigger.threshold, 1)) * 100, 100);

            return (
              <div
                key={`${trigger.zone}-${trigger.type}-${index}`}
                className={cn(
                  'rounded-xl border p-4 transition-all',
                  trigger.isActive ? 'border-orange-200 bg-orange-50/50' : 'border-slate-100 bg-slate-50/50'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={cn('rounded-lg p-2', colors.bg)}>
                      <Icon className={cn('h-5 w-5', colors.text)} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900 capitalize">{trigger.type} - {trigger.zone}</p>
                      <p className="text-sm text-slate-500">Threshold: {trigger.threshold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-lg font-bold', trigger.isActive ? 'text-orange-600' : 'text-slate-600')}>
                      {trigger.current}
                    </p>
                    <p className={cn('text-xs', trigger.isActive ? 'text-orange-600' : 'text-slate-500')}>
                      {trigger.affectedPolicies ?? 0} policies
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className={cn('h-2 w-full rounded-full', colors.progressBg)}>
                    <div className={cn('h-2 rounded-full transition-all', colors.progress)} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No trigger feeds are available yet.
        </div>
      )}
    </div>
  );
}
