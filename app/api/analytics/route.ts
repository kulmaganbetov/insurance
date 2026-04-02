import { NextResponse } from 'next/server';

function generateMockData() {
  const dailyData = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      calculations: Math.floor(Math.random() * 60) + 20,
      avgPremium: Math.floor(Math.random() * 80000) + 100000,
    });
  }

  const ageDistribution = [
    { range: '18-25', count: 89, percentage: 7.1 },
    { range: '26-35', count: 312, percentage: 25.0 },
    { range: '36-45', count: 398, percentage: 31.9 },
    { range: '46-55', count: 276, percentage: 22.1 },
    { range: '56-65', count: 134, percentage: 10.7 },
    { range: '65+', count: 38, percentage: 3.0 },
  ];

  const riskDistribution = [
    { level: 'Төмен', count: 512, percentage: 41, color: '#22c55e' },
    { level: 'Орташа', count: 362, percentage: 29, color: '#eab308' },
    { level: 'Жоғары', count: 287, percentage: 23, color: '#f97316' },
    { level: 'Өте жоғары', count: 86, percentage: 7, color: '#ef4444' },
  ];

  const topFactors = [
    { factor: 'Темекі', occurrences: 387, avgImpact: '+13.2%' },
    { factor: 'Гипертония', occurrences: 312, avgImpact: '+12.0%' },
    { factor: 'Семіздік (ДСИ > 30)', occurrences: 276, avgImpact: '+10.5%' },
    { factor: 'Дене белсенділігі төмен', occurrences: 245, avgImpact: '+5.0%' },
    { factor: 'ЖҚА тұқымқуалаушылығы', occurrences: 198, avgImpact: '+8.0%' },
    { factor: '2-типті диабет', occurrences: 156, avgImpact: '+15.0%' },
    { factor: 'Алкогольді шамадан тыс қолдану', occurrences: 134, avgImpact: '+12.0%' },
    { factor: 'Жүрек-қантамыр аурулары', occurrences: 98, avgImpact: '+25.0%' },
  ];

  const recentCalculations = [
    {
      id: 1,
      date: '2026-03-25',
      age: 42,
      gender: 'Ер',
      region: 'Алматы',
      riskLevel: 'Орташа',
      annualPremium: 156000,
    },
    {
      id: 2,
      date: '2026-03-25',
      age: 35,
      gender: 'Әйел',
      region: 'Астана',
      riskLevel: 'Төмен',
      annualPremium: 98000,
    },
    {
      id: 3,
      date: '2026-03-24',
      age: 58,
      gender: 'Ер',
      region: 'Шымкент',
      riskLevel: 'Жоғары',
      annualPremium: 234000,
    },
    {
      id: 4,
      date: '2026-03-24',
      age: 29,
      gender: 'Әйел',
      region: 'Алматы',
      riskLevel: 'Төмен',
      annualPremium: 72000,
    },
    {
      id: 5,
      date: '2026-03-24',
      age: 51,
      gender: 'Ер',
      region: 'Қарағанды',
      riskLevel: 'Өте жоғары',
      annualPremium: 312000,
    },
  ];

  return {
    totalCalculations: 1247,
    highRisk: 23,
    lowRisk: 41,
    avgPremium: 145000,
    dailyData,
    ageDistribution,
    riskDistribution,
    topFactors,
    recentCalculations,
    source: 'mock',
  };
}

export async function GET() {
  try {
    try {
      const { sql } = await import('@vercel/postgres');

      const totalResult = await sql`SELECT COUNT(*) as count FROM calculations`;
      const totalCalculations = Number(totalResult.rows[0]?.count) || 0;

      if (totalCalculations === 0) {
        return NextResponse.json(generateMockData());
      }

      const riskResults = await sql`
        SELECT
          risk_level,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM calculations), 0), 1) as percentage
        FROM calculations
        GROUP BY risk_level
        ORDER BY count DESC
      `;

      const avgPremiumResult = await sql`
        SELECT ROUND(AVG(annual_premium)) as avg_premium
        FROM calculations
      `;

      const dailyResults = await sql`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as calculations,
          ROUND(AVG(annual_premium)) as avg_premium
        FROM calculations
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      const ageResults = await sql`
        SELECT
          CASE
            WHEN age BETWEEN 18 AND 25 THEN '18-25'
            WHEN age BETWEEN 26 AND 35 THEN '26-35'
            WHEN age BETWEEN 36 AND 45 THEN '36-45'
            WHEN age BETWEEN 46 AND 55 THEN '46-55'
            WHEN age BETWEEN 56 AND 65 THEN '56-65'
            ELSE '65+'
          END as range,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM calculations), 0), 1) as percentage
        FROM calculations
        GROUP BY range
        ORDER BY range ASC
      `;

      const recentResults = await sql`
        SELECT id, created_at as date, age, gender, region, risk_level, annual_premium
        FROM calculations
        ORDER BY created_at DESC
        LIMIT 10
      `;

      const highRiskRow = riskResults.rows.find(
        (r) => r.risk_level === 'Жоғары' || r.risk_level === 'Өте жоғары'
      );
      const lowRiskRow = riskResults.rows.find((r) => r.risk_level === 'Төмен');

      const riskColorMap: Record<string, string> = {
        'Төмен': '#22c55e',
        'Орташа': '#eab308',
        'Жоғары': '#f97316',
        'Өте жоғары': '#ef4444',
      };

      return NextResponse.json({
        totalCalculations,
        highRisk: Number(highRiskRow?.percentage) || 0,
        lowRisk: Number(lowRiskRow?.percentage) || 0,
        avgPremium: Number(avgPremiumResult.rows[0]?.avg_premium) || 0,
        dailyData: dailyResults.rows.map((r) => ({
          date: r.date,
          calculations: Number(r.calculations),
          avgPremium: Number(r.avg_premium),
        })),
        ageDistribution: ageResults.rows.map((r) => ({
          range: r.range,
          count: Number(r.count),
          percentage: Number(r.percentage),
        })),
        riskDistribution: riskResults.rows.map((r) => ({
          level: r.risk_level,
          count: Number(r.count),
          percentage: Number(r.percentage),
          color: riskColorMap[r.risk_level] || '#94a3b8',
        })),
        topFactors: [],
        recentCalculations: recentResults.rows.map((r) => ({
          id: r.id,
          date: r.date,
          age: r.age,
          gender: r.gender,
          region: r.region,
          riskLevel: r.risk_level,
          annualPremium: Number(r.annual_premium),
        })),
        source: 'database',
      });
    } catch {
      // DB not available — return mock data
      return NextResponse.json(generateMockData());
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Аналитиканы алу қатесі' },
      { status: 500 }
    );
  }
}
