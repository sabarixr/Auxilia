'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type ZoneDatum = {
  name: string;
  value: number;
  risk?: string;
};

const COLORS = ['#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#9B59B6', '#718096'];

export function ZoneDistribution({ data }: { data: ZoneDatum[] }) {
  const totals = data.reduce(
    (acc, item) => {
      const risk = item.risk ?? 'medium';
      acc[risk] = (acc[risk] ?? 0) + item.value;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Zone Distribution</h3>
        <p className="text-sm text-slate-500">Active policies by zone</p>
      </div>

      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884d8" paddingAngle={3} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value) => [`${value} policies`, 'Count']}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" iconSize={8} formatter={(value) => <span className="text-sm text-slate-600">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80">
          <p className="text-sm text-slate-500">No active zone distribution data yet.</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-red-50 p-3 text-center">
          <p className="text-lg font-bold text-red-600">{totals.high ?? 0}</p>
          <p className="text-xs text-red-600">High Risk</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-3 text-center">
          <p className="text-lg font-bold text-yellow-600">{totals.medium ?? 0}</p>
          <p className="text-xs text-yellow-600">Medium Risk</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-lg font-bold text-green-600">{totals.low ?? 0}</p>
          <p className="text-xs text-green-600">Low Risk</p>
        </div>
      </div>
    </div>
  );
}
