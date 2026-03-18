'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const monthlyData = [
  { month: 'Oct', claims: 245, premiums: 180000, payouts: 125000 },
  { month: 'Nov', claims: 312, premiums: 210000, payouts: 156000 },
  { month: 'Dec', claims: 428, premiums: 265000, payouts: 198000 },
  { month: 'Jan', claims: 387, premiums: 245000, payouts: 178000 },
  { month: 'Feb', claims: 356, premiums: 232000, payouts: 167000 },
  { month: 'Mar', claims: 298, premiums: 215000, payouts: 145000 },
];

const triggerDistribution = [
  { name: 'Rain', value: 42, color: '#3B82F6' },
  { name: 'Traffic', value: 28, color: '#F97316' },
  { name: 'Surge', value: 18, color: '#8B5CF6' },
  { name: 'Accident', value: 12, color: '#EF4444' },
];

const zonePerformance = [
  { zone: 'Andheri', claims: 456, premiums: 89000, lossRatio: 0.82 },
  { zone: 'Dadar', claims: 389, premiums: 76000, lossRatio: 0.78 },
  { zone: 'Bandra', claims: 298, premiums: 65000, lossRatio: 0.65 },
  { zone: 'Kurla', claims: 345, premiums: 58000, lossRatio: 0.88 },
  { zone: 'Powai', claims: 187, premiums: 45000, lossRatio: 0.52 },
];

const kpis = [
  {
    label: 'Total Premium',
    value: formatCurrency(2450000),
    change: '+18.2%',
    trend: 'up',
  },
  {
    label: 'Total Payouts',
    value: formatCurrency(1875000),
    change: '+12.5%',
    trend: 'up',
  },
  {
    label: 'Loss Ratio',
    value: '76.5%',
    change: '-2.3%',
    trend: 'down',
  },
  {
    label: 'Avg Claim Time',
    value: '2.3 hrs',
    change: '-15.4%',
    trend: 'down',
  },
  {
    label: 'Fraud Detection',
    value: '94.2%',
    change: '+3.1%',
    trend: 'up',
  },
  {
    label: 'Auto-Approval',
    value: '78.6%',
    change: '+5.8%',
    trend: 'up',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500">Performance metrics and insights</p>
        </div>
        <select className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-orange-500">
          <option>Last 6 Months</option>
          <option>Last 3 Months</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{kpi.value}</p>
            <div className="mt-2 flex items-center gap-1">
              {kpi.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : kpi.trend === 'down' ? (
                <TrendingDown className="h-3 w-3 text-green-500" />
              ) : (
                <Minus className="h-3 w-3 text-slate-400" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  kpi.trend === 'up' || kpi.trend === 'down'
                    ? 'text-green-600'
                    : 'text-slate-500'
                )}
              >
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Trends */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Monthly Trends</h3>
          <p className="text-sm text-slate-500">Claims, premiums, and payouts over time</p>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="premiums"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="payouts"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm text-slate-600">Premiums</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-600">Payouts</span>
            </div>
          </div>
        </div>

        {/* Trigger Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">Trigger Distribution</h3>
          <p className="text-sm text-slate-500">Claims by trigger type</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={triggerDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {triggerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                  }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {triggerDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Zone Performance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">Zone Performance</h3>
          <p className="text-sm text-slate-500">Claims and premiums by zone</p>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zonePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                <YAxis dataKey="zone" type="category" stroke="#94A3B8" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="claims" fill="#FF6B35" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loss Ratio by Zone */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">Loss Ratio by Zone</h3>
          <p className="text-sm text-slate-500">Payouts vs premiums ratio</p>
          <div className="mt-6 space-y-4">
            {zonePerformance.map((zone) => (
              <div key={zone.zone}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{zone.zone}</span>
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      zone.lossRatio > 0.8
                        ? 'text-red-600'
                        : zone.lossRatio > 0.6
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    )}
                  >
                    {(zone.lossRatio * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      'h-3 rounded-full transition-all',
                      zone.lossRatio > 0.8
                        ? 'bg-red-500'
                        : zone.lossRatio > 0.6
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    )}
                    style={{ width: `${zone.lossRatio * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Insight:</span> Kurla zone has the highest loss
              ratio (88%). Consider reviewing trigger thresholds or premium adjustments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
