'use client';

import { CloudRain, Car, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const triggers = [
  {
    id: 1,
    type: 'rain',
    zone: 'Andheri',
    current: 85,
    threshold: 50,
    icon: CloudRain,
    color: 'blue',
    affectedPolicies: 127,
    isActive: true,
  },
  {
    id: 2,
    type: 'traffic',
    zone: 'Dadar',
    current: 72,
    threshold: 60,
    icon: Car,
    color: 'orange',
    affectedPolicies: 89,
    isActive: true,
  },
  {
    id: 3,
    type: 'surge',
    zone: 'Bandra',
    current: 2.1,
    threshold: 2.5,
    icon: TrendingUp,
    color: 'purple',
    affectedPolicies: 0,
    isActive: false,
  },
  {
    id: 4,
    type: 'accident',
    zone: 'Kurla',
    current: 3,
    threshold: 5,
    icon: AlertTriangle,
    color: 'red',
    affectedPolicies: 0,
    isActive: false,
  },
];

const colorMap = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    progress: 'bg-blue-500',
    progressBg: 'bg-blue-100',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    progress: 'bg-orange-500',
    progressBg: 'bg-orange-100',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    progress: 'bg-purple-500',
    progressBg: 'bg-purple-100',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    progress: 'bg-red-500',
    progressBg: 'bg-red-100',
  },
};

export function LiveTriggers() {
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

      <div className="space-y-4">
        {triggers.map((trigger) => {
          const colors = colorMap[trigger.color as keyof typeof colorMap];
          const percentage = Math.min((trigger.current / trigger.threshold) * 100, 100);

          return (
            <div
              key={trigger.id}
              className={cn(
                'rounded-xl border p-4 transition-all',
                trigger.isActive
                  ? 'border-orange-200 bg-orange-50/50'
                  : 'border-slate-100 bg-slate-50/50'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('rounded-lg p-2', colors.bg)}>
                    <trigger.icon className={cn('h-5 w-5', colors.text)} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 capitalize">
                      {trigger.type} - {trigger.zone}
                    </p>
                    <p className="text-sm text-slate-500">
                      Threshold: {trigger.threshold}
                      {trigger.type === 'surge' ? 'x' : trigger.type === 'rain' ? 'mm' : '%'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-lg font-bold', trigger.isActive ? 'text-orange-600' : 'text-slate-600')}>
                    {trigger.current}
                    {trigger.type === 'surge' ? 'x' : trigger.type === 'rain' ? 'mm' : '%'}
                  </p>
                  {trigger.isActive && (
                    <p className="text-xs text-orange-600">
                      {trigger.affectedPolicies} policies affected
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className={cn('h-2 w-full rounded-full', colors.progressBg)}>
                  <div
                    className={cn('h-2 rounded-full transition-all', colors.progress)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
