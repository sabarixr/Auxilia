'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const zoneData = [
  { name: 'Andheri', value: 245, risk: 'high' },
  { name: 'Bandra', value: 189, risk: 'medium' },
  { name: 'Dadar', value: 167, risk: 'high' },
  { name: 'Kurla', value: 143, risk: 'medium' },
  { name: 'Powai', value: 98, risk: 'low' },
  { name: 'Others', value: 156, risk: 'mixed' },
];

const COLORS = ['#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#9B59B6', '#718096'];

export function ZoneDistribution() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Zone Distribution</h3>
        <p className="text-sm text-slate-500">Active policies by zone</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={zoneData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
            >
              {zoneData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-sm text-slate-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Zone Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-red-50 p-3 text-center">
          <p className="text-lg font-bold text-red-600">412</p>
          <p className="text-xs text-red-600">High Risk</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-3 text-center">
          <p className="text-lg font-bold text-yellow-600">332</p>
          <p className="text-xs text-yellow-600">Medium Risk</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-lg font-bold text-green-600">254</p>
          <p className="text-xs text-green-600">Low Risk</p>
        </div>
      </div>
    </div>
  );
}
