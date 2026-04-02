'use client';

interface RiskFactor {
  factor: string;
  adjustment: number;
}

interface RiskFactorsDisplayProps {
  risk_factors: RiskFactor[];
}

function getBarColor(adjustment: number): string {
  const abs = Math.abs(adjustment);
  if (abs <= 5) return 'bg-emerald-500';
  if (abs <= 15) return 'bg-yellow-500';
  if (abs <= 25) return 'bg-orange-500';
  return 'bg-red-500';
}

function getTextColor(adjustment: number): string {
  const abs = Math.abs(adjustment);
  if (abs <= 5) return 'text-emerald-400';
  if (abs <= 15) return 'text-yellow-400';
  if (abs <= 25) return 'text-orange-400';
  return 'text-red-400';
}

export default function RiskFactorsDisplay({
  risk_factors,
}: RiskFactorsDisplayProps) {
  // Normalize: find max absolute adjustment for scaling
  const maxAdjustment = Math.max(
    ...risk_factors.map((f) => Math.abs(f.adjustment)),
    1
  );

  return (
    <div className="bg-[#1E293B] rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">
        Тәуекел факторлары
      </h3>

      <div className="space-y-4">
        {risk_factors.map((factor, i) => {
          const widthPercent = (Math.abs(factor.adjustment) / maxAdjustment) * 100;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 text-sm">{factor.factor}</span>
                <span
                  className={`text-sm font-medium ${getTextColor(factor.adjustment)}`}
                >
                  {factor.adjustment > 0 ? '+' : ''}
                  {factor.adjustment}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getBarColor(factor.adjustment)} transition-all duration-700 ease-out`}
                  style={{ width: `${Math.max(widthPercent, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
