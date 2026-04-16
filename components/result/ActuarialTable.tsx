'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ActuarialData {
  lx: number;
  lx_n: number;
  Dx: number;
  Dx_n: number;
  Nx: number;
  Mx: number;
  base_net_tariff: number;
}

interface ActuarialTableProps {
  data: ActuarialData;
}

export default function ActuarialTable({ data }: ActuarialTableProps) {
  const [isOpen, setIsOpen] = useState(false);

  const rows = [
    { label: 'lx (x жаста тірі қалғандар)', value: data.lx },
    { label: 'lx+n (x+n жаста тірі қалғандар)', value: data.lx_n },
    { label: 'Dx (дисконтталған тірі қалғандар)', value: data.Dx },
    { label: 'Dx+n', value: data.Dx_n },
    { label: 'Nx (коммутациялық сан)', value: data.Nx },
    { label: 'Mx (коммутациялық сан)', value: data.Mx },
    { label: 'Базалық нетто-тариф', value: data.base_net_tariff },
  ];

  return (
    <div className="bg-[#1E293B] rounded-2xl p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-white hover:text-emerald-400 transition-colors"
      >
        <h3 className="text-lg font-semibold">Актуарлық есептеулерді көрсету</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left text-slate-400 py-3 px-4 font-medium">
                  Параметр
                </th>
                <th className="text-right text-slate-400 py-3 px-4 font-medium">
                  Мәні
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-slate-700/50 ${
                    i % 2 === 0 ? 'bg-slate-800/30' : 'bg-transparent'
                  }`}
                >
                  <td className="text-slate-300 py-3 px-4">{row.label}</td>
                  <td className="text-white text-right py-3 px-4 font-mono">
                    {typeof row.value === 'number'
                      ? row.value.toLocaleString('kk-KZ', {
                          maximumFractionDigits: 6,
                        })
                      : row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
