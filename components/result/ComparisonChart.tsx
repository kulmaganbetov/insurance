'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ComparisonChartProps {
  traditional_premium: number;
  ai_adjusted_premium: number;
}

export default function ComparisonChart({
  traditional_premium,
  ai_adjusted_premium,
}: ComparisonChartProps) {
  const diff = traditional_premium > 0
    ? (((ai_adjusted_premium - traditional_premium) / traditional_premium) * 100).toFixed(1)
    : '0';

  const data = [
    {
      name: 'Премия',
      'Дәстүрлі актуарлық': traditional_premium,
      'AI-түзетілген': ai_adjusted_premium,
    },
  ];

  return (
    <div className="bg-[#1E293B] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">
          Есептеулерді салыстыру
        </h3>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            Number(diff) <= 0
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {Number(diff) > 0 ? '+' : ''}
          {diff}%
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}к` : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F1F5F9',
              }}
              formatter={(value: number) => [
                `${value.toLocaleString('ru-RU')} ₸`,
              ]}
              labelStyle={{ color: '#94A3B8' }}
            />
            <Bar
              dataKey="Дәстүрлі актуарлық"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
              maxBarSize={80}
            />
            <Bar
              dataKey="AI-түзетілген"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-slate-400">Дәстүрлі актуарлық</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-slate-400">AI-түзетілген</span>
        </div>
      </div>
    </div>
  );
}
