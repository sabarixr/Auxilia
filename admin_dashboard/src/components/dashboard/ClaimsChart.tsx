'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Mon', claims: 12, premiums: 45000 },
  { name: 'Tue', claims: 19, premiums: 52000 },
  { name: 'Wed', claims: 8, premiums: 38000 },
  { name: 'Thu', claims: 24, premiums: 61000 },
  { name: 'Fri', claims: 15, premiums: 48000 },
  { name: 'Sat', claims: 31, premiums: 72000 },
  { name: 'Sun', claims: 22, premiums: 55000 },
];

export function ClaimsChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Claims Overview</h3>
          <p className="text-sm text-slate-500">Weekly claims and premium collection</p>
        </div>
        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPremiums" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="claims"
              stroke="#FF6B35"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorClaims)"
            />
            <Area
              type="monotone"
              dataKey="premiums"
              stroke="#4ECDC4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPremiums)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="text-sm text-slate-600">Claims</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-teal-500" />
          <span className="text-sm text-slate-600">Premiums (INR)</span>
        </div>
      </div>
    </div>
  );
}
