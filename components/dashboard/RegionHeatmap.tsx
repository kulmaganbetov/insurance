'use client';

import { useState } from 'react';

const REGIONS_DATA = [
  { id: 'almaty', name: 'Алматы', risk: 32, x: 320, y: 280 },
  { id: 'astana', name: 'Астана', risk: 28, x: 260, y: 140 },
  { id: 'shymkent', name: 'Шымкент', risk: 25, x: 230, y: 310 },
  { id: 'karaganda', name: 'Караганда', risk: 35, x: 260, y: 180 },
  { id: 'aktobe', name: 'Актобе', risk: 38, x: 100, y: 170 },
  { id: 'atyrau', name: 'Атырау', risk: 40, x: 50, y: 200 },
  { id: 'pavlodar', name: 'Павлодар', risk: 42, x: 310, y: 110 },
  { id: 'sko', name: 'СКО', risk: 44, x: 240, y: 70 },
  { id: 'kostanay', name: 'Костанай', risk: 36, x: 170, y: 90 },
  { id: 'vko', name: 'ВКО', risk: 41, x: 370, y: 140 },
  { id: 'zhambyl', name: 'Жамбыл', risk: 30, x: 240, y: 290 },
  { id: 'turkestan', name: 'Туркестан', risk: 27, x: 190, y: 310 },
  { id: 'kyzylorda', name: 'Кызылорда', risk: 33, x: 150, y: 270 },
  { id: 'mangystau', name: 'Мангистау', risk: 37, x: 30, y: 270 },
  { id: 'wko', name: 'ЗКО', risk: 39, x: 60, y: 140 },
  { id: 'akmola', name: 'Акмола', risk: 31, x: 230, y: 120 },
  { id: 'ulytau', name: 'Ұлытау', risk: 45, x: 190, y: 200 },
];

function getRiskColor(risk: number): string {
  if (risk <= 30) return '#10B981';
  if (risk <= 35) return '#F59E0B';
  if (risk <= 40) return '#F97316';
  return '#EF4444';
}

export default function RegionHeatmap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const hovered = REGIONS_DATA.find(r => r.id === hoveredRegion);

  return (
    <div className="relative">
      <svg viewBox="0 0 430 360" className="w-full max-w-2xl mx-auto">
        {/* Simplified Kazakhstan outline */}
        <path
          d="M 20 80 L 60 40 L 120 30 L 180 40 L 240 25 L 300 35 L 360 50 L 400 80 L 410 130 L 400 160 L 380 180 L 390 220 L 370 260 L 340 290 L 300 310 L 260 320 L 220 330 L 180 330 L 140 310 L 100 290 L 60 280 L 30 260 L 15 220 L 10 170 L 15 120 Z"
          fill="#1a2744"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Region dots */}
        {REGIONS_DATA.map((region) => (
          <g
            key={region.id}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer"
          >
            <circle
              cx={region.x}
              cy={region.y}
              r={hoveredRegion === region.id ? 14 : 10}
              fill={getRiskColor(region.risk)}
              opacity={hoveredRegion === region.id ? 0.9 : 0.7}
              className="transition-all duration-200"
            />
            <circle
              cx={region.x}
              cy={region.y}
              r={hoveredRegion === region.id ? 18 : 0}
              fill="none"
              stroke={getRiskColor(region.risk)}
              strokeWidth="2"
              opacity={0.3}
              className="transition-all duration-200"
            />
            <text
              x={region.x}
              y={region.y - 16}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="8"
              fontWeight="500"
            >
              {region.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute top-4 right-4 bg-[#0F172A] border border-slate-700 rounded-xl p-4 shadow-xl">
          <p className="text-white font-semibold">{hovered.name}</p>
          <p className="text-slate-400 text-sm">
            Орташа тәуекел:{' '}
            <span style={{ color: getRiskColor(hovered.risk) }} className="font-medium">
              {hovered.risk}%
            </span>
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        {[
          { color: '#10B981', label: 'Төмен (< 30%)' },
          { color: '#F59E0B', label: 'Орташа (30-35%)' },
          { color: '#F97316', label: 'Көтеріңкі (35-40%)' },
          { color: '#EF4444', label: 'Жоғары (> 40%)' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
