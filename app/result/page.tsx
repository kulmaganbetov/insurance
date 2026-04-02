'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import RiskGauge from '@/components/result/RiskGauge';
import PremiumCard from '@/components/result/PremiumCard';
import ActuarialTable from '@/components/result/ActuarialTable';
import ComparisonChart from '@/components/result/ComparisonChart';
import LifeExpectancyBar from '@/components/result/LifeExpectancyBar';
import RecommendationsList from '@/components/result/RecommendationsList';
import RiskFactorsDisplay from '@/components/result/RiskFactorsDisplay';

interface ResultData {
  risk_score: number;
  risk_level: string;
  annual_premium: number;
  monthly_premium: number;
  one_time_premium: number;
  traditional_premium: number;
  ai_adjusted_premium: number;
  life_expectancy: {
    personal_estimate: number;
    gender_average: number;
    country_average: number;
  };
  recommendations: string[];
  risk_factors: { factor: string; adjustment: number }[];
  actuarial: {
    lx: number;
    lx_n: number;
    Dx: number;
    Dx_n: number;
    Nx: number;
    Mx: number;
    base_net_tariff: number;
  };
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`bg-[#1E293B] rounded-2xl animate-pulse ${className ?? ''}`}
    >
      <div className="p-6 space-y-4">
        <div className="h-5 w-1/3 bg-slate-700 rounded" />
        <div className="h-32 bg-slate-700/50 rounded-lg" />
        <div className="h-4 w-2/3 bg-slate-700 rounded" />
      </div>
    </div>
  );
}

export default function ResultPage() {
  const [data, setData] = useState<ResultData | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('insuranceResult');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // invalid data
      }
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!data) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const html = await res.text();
        // Open HTML in new window for printing as PDF
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          setTimeout(() => {
            printWindow.print();
          }, 500);
        } else {
          // Fallback: download as HTML file
          const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'lifeguard-kz-report.html';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }
    } catch {
      // handle error silently
    } finally {
      setDownloading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0F172A] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-64 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock className="lg:col-span-2" />
            <SkeletonBlock className="lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Есептеу нәтижелері
            </h1>
            <p className="text-slate-400 mt-1">
              Жеке сақтандыру талдауы
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/calculator"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Жаңа есептеу
            </Link>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:opacity-60 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Жүктелуде...' : 'PDF жүктеу'}
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Gauge */}
          <RiskGauge
            risk_score={data.risk_score}
            risk_level={data.risk_level}
          />

          {/* Premium Card */}
          <PremiumCard
            annual_premium={data.annual_premium}
            monthly_premium={data.monthly_premium}
            one_time_premium={data.one_time_premium}
          />

          {/* Comparison Chart */}
          <ComparisonChart
            traditional_premium={data.traditional_premium}
            ai_adjusted_premium={data.ai_adjusted_premium}
          />

          {/* Risk Factors */}
          <RiskFactorsDisplay risk_factors={data.risk_factors} />

          {/* Life Expectancy - full width */}
          <div className="lg:col-span-2">
            <LifeExpectancyBar
              personal_estimate={data.life_expectancy.personal_estimate}
              gender_average={data.life_expectancy.gender_average}
              country_average={data.life_expectancy.country_average}
            />
          </div>

          {/* Recommendations - full width */}
          <div className="lg:col-span-2">
            <RecommendationsList recommendations={data.recommendations} />
          </div>

          {/* Actuarial Table - full width */}
          <div className="lg:col-span-2">
            <ActuarialTable data={data.actuarial} />
          </div>
        </div>
      </div>
    </div>
  );
}
