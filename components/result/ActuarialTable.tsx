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
    { label: 'lx (x жасқа дейін тірі қалғандар)', value: data.lx },
    { label: 'lx+n (x+n жасқа дейін тірі қалғандар)', value: data.lx_n },
    { label: 'Dx (дисконтталған тірі қалғандар)', value: data.Dx },
    { label: 'Dx+n', value: data.Dx_n },
    { label: 'Nx (коммутациялық сан)', value: data.Nx },
    { label: 'Mx (коммутациялық сан)', value: data.Mx },
    { label: 'Базалық нетто-тариф', value: data.base_net_tariff },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-white hover:text-emerald-600 transition-colors"
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
                  className={`border-b border-slate-200 ${
                    i % 2 === 0 ? 'bg-slate-100/60' : 'bg-transparent'
                  }`}
                >
                  <td className="text-slate-700 py-3 px-4">{row.label}</td>
                  <td className="text-slate-900 text-right py-3 px-4 font-mono">
                    {typeof row.value === 'number'
                      ? row.value.toLocaleString('ru-RU', {
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
