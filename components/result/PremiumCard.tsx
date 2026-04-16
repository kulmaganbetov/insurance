'use client';

interface PremiumCardProps {
  annual_premium: number;
  monthly_premium: number;
  one_time_premium: number;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₸';
}

export default function PremiumCard({
  annual_premium,
  monthly_premium,
  one_time_premium,
}: PremiumCardProps) {
  return (
    <div className="bg-[#1E293B] rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-6">Сақтандыру сыйлықақысы</h3>

      <div className="space-y-5">
        {/* Annual */}
        <div className="border border-emerald-500/30 rounded-xl p-4 bg-emerald-500/5">
          <p className="text-slate-400 text-sm mb-1">Жылдық сыйлықақы</p>
          <p className="text-emerald-400 text-3xl font-bold">
            {formatCurrency(annual_premium)}
          </p>
        </div>

        {/* Monthly */}
        <div className="flex items-center justify-between border border-slate-600/50 rounded-xl p-4">
          <div>
            <p className="text-slate-400 text-sm">Айлық сыйлықақы</p>
            <p className="text-white text-xl font-semibold">
              {formatCurrency(monthly_premium)}
            </p>
          </div>
          <div className="text-slate-500 text-xs bg-slate-700/50 px-2 py-1 rounded">
            /ай
          </div>
        </div>

        {/* One-time */}
        <div className="flex items-center justify-between border border-slate-600/50 rounded-xl p-4">
          <div>
            <p className="text-slate-400 text-sm">Біржолғы сыйлықақы</p>
            <p className="text-white text-xl font-semibold">
              {formatCurrency(one_time_premium)}
            </p>
          </div>
          <div className="text-slate-500 text-xs bg-slate-700/50 px-2 py-1 rounded">
            бір рет
          </div>
        </div>
      </div>
    </div>
  );
}
