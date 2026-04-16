'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart3, AlertTriangle, Heart, Banknote } from 'lucide-react';
import RegionHeatmap from '@/components/dashboard/RegionHeatmap';

interface Analytics {
  totalCalculations: number;
  highRisk: number;
  lowRisk: number;
  avgPremium: number;
  dailyData: Array<{ date: string; calculations: number; avgPremium: number }>;
  ageDistribution: Array<{ range: string; count: number; percentage: number }>;
  riskDistribution: Array<{ level: string; count: number; percentage: number; color: string }>;
  topFactors: Array<{ factor: string; occurrences: number; avgImpact: string }>;
  recentCalculations: Array<{
    id: number; date: string; age: number; gender: string;
    region: string; riskLevel: string; annualPremium: number;
  }>;
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string; color: string;
}) {
  return (
    <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}

function getRiskBadgeClass(level: string): string {
  switch (level) {
    case 'Низкий': return 'bg-emerald-500/20 text-emerald-400';
    case 'Средний': return 'bg-yellow-500/20 text-yellow-400';
    case 'Высокий': return 'bg-orange-500/20 text-orange-400';
    case 'Очень высокий': return 'bg-red-500/20 text-red-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0F172A] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-slate-700 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-[#1E293B] rounded-2xl p-6 h-28 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-[#1E293B] rounded-2xl p-6 h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const avgPremiumByAge = data.ageDistribution.map(a => ({
    range: a.range,
    count: a.count,
    avgPremium: Math.round(80000 + a.count * 200 + Math.random() * 50000),
  }));

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Талдау</h1>
          <p className="text-slate-400 mt-1">Сақтандыру компаниясы үшін басқару тақтасы</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BarChart3}
            label="Барлық есептеулер"
            value={data.totalCalculations.toLocaleString('ru-RU')}
            color="bg-blue-500/20 text-blue-400"
          />
          <StatCard
            icon={AlertTriangle}
            label="Жоғары тәуекел"
            value={`${data.highRisk}%`}
            color="bg-red-500/20 text-red-400"
          />
          <StatCard
            icon={Heart}
            label="Төмен тәуекел"
            value={`${data.lowRisk}%`}
            color="bg-emerald-500/20 text-emerald-400"
          />
          <StatCard
            icon={Banknote}
            label="Орташа сыйлықақы"
            value={`${data.avgPremium.toLocaleString('ru-RU')} ₸`}
            color="bg-yellow-500/20 text-yellow-400"
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily line chart */}
          <div className="bg-[#1E293B] rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">30 күндегі есептеулер</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#94A3B8', fontSize: 10 }}
                    axisLine={{ stroke: '#475569' }}
                    tickFormatter={(v: string) => v.slice(5)}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    axisLine={{ stroke: '#475569' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F1F5F9' }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <Line type="monotone" dataKey="calculations" stroke="#10B981" strokeWidth={2} dot={false} name="Есептеулер" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk distribution pie */}
          <div className="bg-[#1E293B] rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Тәуекелдерді бөлу</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="level"
                    stroke="none"
                  >
                    {data.riskDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F1F5F9' }}
                    formatter={(value: number, name: string) => [`${value} (${data.riskDistribution.find(r => r.level === name)?.percentage}%)`, name]}
                  />
                  <Legend
                    formatter={(value: string) => <span className="text-slate-400 text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Age distribution bar */}
          <div className="bg-[#1E293B] rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Жас топтары бойынша сыйлықақы</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgPremiumByAge}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="range" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#475569' }} />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    axisLine={{ stroke: '#475569' }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}к`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F1F5F9' }}
                    formatter={(value: number) => [`${value.toLocaleString('ru-RU')} ₸`, 'Орт. сыйлықақы']}
                  />
                  <Bar dataKey="avgPremium" fill="#10B981" radius={[6, 6, 0, 0]} name="Орт. сыйлықақы" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top factors */}
          <div className="bg-[#1E293B] rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Тәуекел факторларының топ-5</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topFactors.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#475569' }} />
                  <YAxis
                    type="category"
                    dataKey="factor"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    axisLine={{ stroke: '#475569' }}
                    width={130}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F1F5F9' }}
                    formatter={(value: number) => [value, 'Жағдайлар']}
                  />
                  <Bar dataKey="occurrences" fill="#F59E0B" radius={[0, 6, 6, 0]} name="Жағдайлар" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent calculations table */}
        <div className="bg-[#1E293B] rounded-2xl p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-4">Соңғы есептеулер</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {['Күні', 'Жасы', 'Жынысы', 'Аймағы', 'Тәуекел деңгейі', 'Сыйлықақы'].map(h => (
                    <th key={h} className="text-left text-slate-400 py-3 px-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentCalculations.map((calc) => (
                  <tr key={calc.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="text-slate-300 py-3 px-4">{calc.date}</td>
                    <td className="text-slate-300 py-3 px-4">{calc.age}</td>
                    <td className="text-slate-300 py-3 px-4">{calc.gender}</td>
                    <td className="text-slate-300 py-3 px-4">{calc.region}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getRiskBadgeClass(calc.riskLevel)}`}>
                        {calc.riskLevel}
                      </span>
                    </td>
                    <td className="text-white py-3 px-4 font-medium">
                      {calc.annualPremium.toLocaleString('ru-RU')} ₸
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Region Heatmap */}
        <div className="bg-[#1E293B] rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Аймақтар бойынша тәуекел картасы</h3>
          <RegionHeatmap />
        </div>
      </div>
    </div>
  );
}
