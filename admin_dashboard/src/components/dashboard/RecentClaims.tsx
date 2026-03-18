'use client';

import { formatCurrency, formatDateTime, getStatusBadgeClass, cn } from '@/lib/utils';
import { CloudRain, Car, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';

const recentClaims = [
  {
    id: 'CLM-2847',
    rider: 'Rahul Sharma',
    type: 'rain',
    amount: 150,
    status: 'approved',
    time: '2026-03-19T14:23:00',
    zone: 'Andheri',
  },
  {
    id: 'CLM-2846',
    rider: 'Priya Patel',
    type: 'traffic',
    amount: 100,
    status: 'processing',
    time: '2026-03-19T14:15:00',
    zone: 'Dadar',
  },
  {
    id: 'CLM-2845',
    rider: 'Amit Kumar',
    type: 'surge',
    amount: 200,
    status: 'pending',
    time: '2026-03-19T13:58:00',
    zone: 'Bandra',
  },
  {
    id: 'CLM-2844',
    rider: 'Sneha Desai',
    type: 'rain',
    amount: 150,
    status: 'paid',
    time: '2026-03-19T13:42:00',
    zone: 'Kurla',
  },
  {
    id: 'CLM-2843',
    rider: 'Vikram Singh',
    type: 'accident',
    amount: 500,
    status: 'rejected',
    time: '2026-03-19T13:28:00',
    zone: 'Powai',
  },
];

const iconMap = {
  rain: CloudRain,
  traffic: Car,
  surge: TrendingUp,
  accident: AlertTriangle,
};

const iconColorMap = {
  rain: 'text-blue-600 bg-blue-100',
  traffic: 'text-orange-600 bg-orange-100',
  surge: 'text-purple-600 bg-purple-100',
  accident: 'text-red-600 bg-red-100',
};

export function RecentClaims() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Claims</h3>
          <p className="text-sm text-slate-500">Latest claim submissions and updates</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700">
          View All
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Claim ID
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rider
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Type
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Amount
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentClaims.map((claim) => {
              const Icon = iconMap[claim.type as keyof typeof iconMap];
              const iconColors = iconColorMap[claim.type as keyof typeof iconColorMap];

              return (
                <tr key={claim.id} className="transition-colors hover:bg-slate-50">
                  <td className="py-4">
                    <span className="font-mono text-sm font-medium text-slate-900">
                      {claim.id}
                    </span>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{claim.rider}</p>
                      <p className="text-xs text-slate-500">{claim.zone}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn('rounded-lg p-1.5', iconColors.split(' ')[1])}>
                        <Icon className={cn('h-4 w-4', iconColors.split(' ')[0])} />
                      </div>
                      <span className="text-sm capitalize text-slate-600">{claim.type}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(claim.amount)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize',
                        getStatusBadgeClass(claim.status)
                      )}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-slate-500">
                      {formatDateTime(claim.time)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
