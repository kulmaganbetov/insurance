'use client';

import { useEffect, useState } from 'react';

interface RiskGaugeProps {
  risk_score: number;
  risk_level: string;
}

export default function RiskGauge({ risk_score, risk_level }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * risk_score;
      setAnimatedScore(start);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [risk_score]);

  const cx = 150;
  const cy = 140;
  const r = 110;

  // Needle angle: 0 score = -180deg (left), 100 score = 0deg (right)
  const needleAngle = -180 + (animatedScore / 100) * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLength = 90;
  const needleX = cx + needleLength * Math.cos(needleRad);
  const needleY = cy + needleLength * Math.sin(needleRad);

  // Arc helper: angle in degrees from -180 to 0
  const arcPoint = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const createArc = (startDeg: number, endDeg: number) => {
    const s = arcPoint(startDeg);
    const e = arcPoint(endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  const zones = [
    { start: -180, end: -135, color: '#10B981' },  // green 0-25
    { start: -135, end: -90, color: '#F59E0B' },    // yellow 25-50
    { start: -90, end: -45, color: '#F97316' },      // orange 50-75
    { start: -45, end: 0, color: '#EF4444' },        // red 75-100
  ];

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col items-center">
      <h3 className="text-slate-900 text-lg font-semibold mb-4">Тәуекелді бағалау</h3>
      <svg viewBox="0 0 300 170" className="w-full max-w-[300px]">
        {/* Background arc */}
        <path
          d={createArc(-180, 0)}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Colored zones */}
        {zones.map((zone, i) => (
          <path
            key={i}
            d={createArc(zone.start, zone.end)}
            fill="none"
            stroke={zone.color}
            strokeWidth="20"
            strokeLinecap="butt"
            opacity={0.85}
          />
        ))}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r="6" fill="#0F172A" />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 25}
          textAnchor="middle"
          fill="#0F172A"
          fontSize="36"
          fontWeight="bold"
        >
          {Math.round(animatedScore)}
        </text>
      </svg>
      <div className="mt-2 text-center">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            risk_score <= 25
              ? 'bg-emerald-500/20 text-emerald-600'
              : risk_score <= 50
              ? 'bg-yellow-500/20 text-yellow-600'
              : risk_score <= 75
              ? 'bg-orange-500/20 text-orange-600'
              : 'bg-red-500/20 text-red-600'
          }`}
        >
          {risk_level}
        </span>
      </div>
    </div>
  );
}
