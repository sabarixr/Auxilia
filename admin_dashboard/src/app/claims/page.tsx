'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  CloudRain,
  Car,
  TrendingUp,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { cn, formatCurrency, formatDateTime, getStatusBadgeClass } from '@/lib/utils';

const claims = [
  {
    id: 'CLM-2847',
    policyId: 'POL-1234',
    rider: 'Rahul Sharma',
    phone: '+91 98765 43210',
    type: 'rain',
    zone: 'Andheri',
    triggerValue: 85,
    threshold: 50,
    amount: 150,
    status: 'approved',
    fraudScore: 0.12,
    aiDecision: 'Auto-approved - Low fraud risk',
    createdAt: '2026-03-19T14:23:00',
    processedAt: '2026-03-19T14:25:00',
    txHash: '0x1234...abcd',
  },
  {
    id: 'CLM-2846',
    policyId: 'POL-1189',
    rider: 'Priya Patel',
    phone: '+91 98765 43211',
    type: 'traffic',
    zone: 'Dadar',
    triggerValue: 72,
    threshold: 60,
    amount: 100,
    status: 'processing',
    fraudScore: 0.28,
    aiDecision: 'Processing - Medium verification',
    createdAt: '2026-03-19T14:15:00',
  },
  {
    id: 'CLM-2845',
    policyId: 'POL-1156',
    rider: 'Amit Kumar',
    phone: '+91 98765 43212',
    type: 'surge',
    zone: 'Bandra',
    triggerValue: 2.8,
    threshold: 2.5,
    amount: 200,
    status: 'pending',
    fraudScore: 0.15,
    aiDecision: 'Pending review',
    createdAt: '2026-03-19T13:58:00',
  },
  {
    id: 'CLM-2844',
    policyId: 'POL-1098',
    rider: 'Sneha Desai',
    phone: '+91 98765 43213',
    type: 'rain',
    zone: 'Kurla',
    triggerValue: 78,
    threshold: 50,
    amount: 150,
    status: 'paid',
    fraudScore: 0.08,
    aiDecision: 'Auto-approved - Very low risk',
    createdAt: '2026-03-19T13:42:00',
    processedAt: '2026-03-19T13:44:00',
    txHash: '0x5678...efgh',
  },
  {
    id: 'CLM-2843',
    policyId: 'POL-1067',
    rider: 'Vikram Singh',
    phone: '+91 98765 43214',
    type: 'accident',
    zone: 'Powai',
    triggerValue: 1,
    threshold: 1,
    amount: 500,
    status: 'rejected',
    fraudScore: 0.78,
    aiDecision: 'Rejected - High fraud probability',
    createdAt: '2026-03-19T13:28:00',
    processedAt: '2026-03-19T13:35:00',
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

export default function ClaimsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClaims = claims.filter((claim) => {
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesSearch =
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.rider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Claims Management</h1>
          <p className="text-slate-500">Review and process insurance claims</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600">
          <Download className="h-4 w-4" />
          Export Claims
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {[
          { label: 'Total Claims', value: '2,847', color: 'text-slate-900' },
          { label: 'Pending', value: '47', color: 'text-yellow-600' },
          { label: 'Processing', value: '23', color: 'text-purple-600' },
          { label: 'Approved', value: '2,689', color: 'text-green-600' },
          { label: 'Rejected', value: '88', color: 'text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by claim ID or rider name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Claim ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rider
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Trigger
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Fraud Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClaims.map((claim) => {
                const Icon = iconMap[claim.type as keyof typeof iconMap];
                const iconColors = iconColorMap[claim.type as keyof typeof iconColorMap];

                return (
                  <tr key={claim.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono text-sm font-medium text-slate-900">
                          {claim.id}
                        </span>
                        <p className="text-xs text-slate-500">{claim.policyId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{claim.rider}</p>
                        <p className="text-xs text-slate-500">{claim.zone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn('rounded-lg p-1.5', iconColors.split(' ')[1])}>
                          <Icon className={cn('h-4 w-4', iconColors.split(' ')[0])} />
                        </div>
                        <div>
                          <span className="text-sm capitalize text-slate-700">{claim.type}</span>
                          <p className="text-xs text-slate-500">
                            {claim.triggerValue} / {claim.threshold}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(claim.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'h-2 w-16 rounded-full bg-slate-200',
                          )}
                        >
                          <div
                            className={cn(
                              'h-2 rounded-full',
                              claim.fraudScore < 0.3
                                ? 'bg-green-500'
                                : claim.fraudScore < 0.6
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            )}
                            style={{ width: `${claim.fraudScore * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {(claim.fraudScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize',
                          getStatusBadgeClass(claim.status)
                        )}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {formatDateTime(claim.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        {claim.status === 'pending' && (
                          <>
                            <button className="rounded-lg p-2 text-green-500 transition-colors hover:bg-green-50">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {claim.status === 'processing' && (
                          <button className="rounded-lg p-2 text-purple-500 transition-colors hover:bg-purple-50">
                            <Clock className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">1-5</span> of{' '}
            <span className="font-medium">2,847</span> claims
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Previous
            </button>
            <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white">
              1
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              2
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              3
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
