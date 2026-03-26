import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const riskScore = data.risk_score || 0;
    const riskLevel = data.risk_level || 'Неизвестно';
    const annualPremium = (data.annual_premium || 0).toLocaleString('ru-RU');
    const monthlyPremium = (data.monthly_premium || 0).toLocaleString('ru-RU');
    const oneTimePremium = (data.one_time_premium || 0).toLocaleString('ru-RU');

    const riskColor = riskScore <= 25 ? '#10B981'
      : riskScore <= 50 ? '#F59E0B'
      : riskScore <= 75 ? '#F97316'
      : '#EF4444';

    const actuarial = data.actuarial || {};
    const factors = data.risk_factors || [];
    const recommendations = data.recommendations || [];
    const lifeExp = data.life_expectancy || {};

    // Generate HTML-based PDF using a printable HTML document
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>LifeGuard KZ - Отчёт</title>
<style>
  @page { margin: 20mm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'DejaVu Sans', Arial, sans-serif; color: #1e293b; font-size: 11pt; line-height: 1.5; }
  .header { background: linear-gradient(135deg, #0F172A, #1E293B); color: white; padding: 24px 32px; margin: -20mm -20mm 20px -20mm; width: calc(100% + 40mm); }
  .header h1 { font-size: 22pt; color: #10B981; margin-bottom: 4px; }
  .header p { color: #94A3B8; font-size: 10pt; }
  .header .date { color: #64748B; font-size: 8pt; margin-top: 8px; }
  h2 { font-size: 14pt; color: #0F172A; margin: 20px 0 10px 0; border-bottom: 2px solid #10B981; padding-bottom: 4px; }
  .risk-badge { display: inline-block; padding: 8px 24px; border-radius: 12px; font-size: 20pt; font-weight: bold; color: white; margin: 8px 0 16px 0; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 20px 0; }
  th { background: #0F172A; color: #10B981; text-align: left; padding: 8px 12px; font-size: 10pt; }
  td { padding: 6px 12px; border-bottom: 1px solid #e2e8f0; font-size: 10pt; }
  tr:nth-child(even) td { background: #f8fafc; }
  .factor-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f1f5f9; }
  .factor-name { color: #475569; }
  .factor-adj { font-weight: 600; }
  .factor-adj.positive { color: #EF4444; }
  .factor-adj.negative { color: #10B981; }
  .rec-item { padding: 8px 12px; margin: 4px 0; background: #f0fdf4; border-left: 3px solid #10B981; border-radius: 0 8px 8px 0; font-size: 10pt; }
  .premium-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 10px 0 20px 0; }
  .premium-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
  .premium-card .label { color: #64748B; font-size: 9pt; }
  .premium-card .value { font-size: 16pt; font-weight: bold; color: #0F172A; }
  .premium-card.main { border-color: #10B981; background: #f0fdf4; }
  .premium-card.main .value { color: #10B981; }
  .le-bar { margin: 10px 0 20px 0; padding: 12px; background: #f8fafc; border-radius: 8px; }
  .disclaimer { margin-top: 30px; padding: 16px; background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; font-size: 8pt; color: #92400e; }
  .footer { margin-top: 20px; text-align: center; font-size: 8pt; color: #94A3B8; }
</style>
</head>
<body>

<div class="header">
  <h1>LifeGuard KZ</h1>
  <p>AI-платформа оценки рисков страхования жизни</p>
  <div class="date">Отчёт сформирован: ${new Date().toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</div>
</div>

<h2>Оценка риска</h2>
<div>
  <span class="risk-badge" style="background: ${riskColor}">${riskScore} — ${riskLevel}</span>
</div>

<h2>Страховая премия</h2>
<div class="premium-grid">
  <div class="premium-card main">
    <div class="label">Годовая премия</div>
    <div class="value">${annualPremium} ₸</div>
  </div>
  <div class="premium-card">
    <div class="label">Ежемесячная</div>
    <div class="value">${monthlyPremium} ₸</div>
  </div>
  <div class="premium-card">
    <div class="label">Единовременная</div>
    <div class="value">${oneTimePremium} ₸</div>
  </div>
</div>

<h2>Актуарные расчёты</h2>
<table>
  <thead><tr><th>Параметр</th><th>Значение</th></tr></thead>
  <tbody>
    <tr><td>lx (живущие на возраст x)</td><td>${actuarial.lx?.toLocaleString('ru-RU') || '—'}</td></tr>
    <tr><td>lx+n (живущие на возраст x+n)</td><td>${actuarial.lx_n?.toLocaleString('ru-RU') || '—'}</td></tr>
    <tr><td>Dx (дисконтированные живущие)</td><td>${typeof actuarial.Dx === 'number' ? actuarial.Dx.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</td></tr>
    <tr><td>Dx+n</td><td>${typeof actuarial.Dx_n === 'number' ? actuarial.Dx_n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</td></tr>
    <tr><td>Nx (коммутационное число)</td><td>${typeof actuarial.Nx === 'number' ? actuarial.Nx.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</td></tr>
    <tr><td>Mx (коммутационное число)</td><td>${typeof actuarial.Mx === 'number' ? actuarial.Mx.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</td></tr>
    <tr><td>Базовый нетто-тариф</td><td>${typeof actuarial.base_net_tariff === 'number' ? actuarial.base_net_tariff.toFixed(6) : '—'}</td></tr>
  </tbody>
</table>

${factors.length > 0 ? `
<h2>Факторы риска</h2>
<table>
  <thead><tr><th>Фактор</th><th>Поправка</th></tr></thead>
  <tbody>
    ${factors.map((f: { factor: string; adjustment: number }) => {
      const adj = f.adjustment;
      const adjStr = adj > 0 ? `+${adj}%` : adj < 0 ? `${adj}%` : '0%';
      const color = adj > 0 ? '#EF4444' : adj < 0 ? '#10B981' : '#64748B';
      return `<tr><td>${f.factor}</td><td style="color: ${color}; font-weight: 600">${adjStr}</td></tr>`;
    }).join('')}
  </tbody>
</table>
` : ''}

${lifeExp.personal_estimate ? `
<h2>Ожидаемая продолжительность жизни</h2>
<div class="le-bar">
  <p><strong>Личный прогноз:</strong> ${lifeExp.personal_estimate} лет</p>
  <p><strong>Среднее по полу:</strong> ${lifeExp.gender_average} лет</p>
  <p><strong>Среднее по Казахстану:</strong> ${lifeExp.country_average} лет</p>
</div>
` : ''}

${recommendations.length > 0 ? `
<h2>Рекомендации</h2>
${recommendations.map((r: string, i: number) => `<div class="rec-item">${i + 1}. ${r}</div>`).join('')}
` : ''}

<div class="disclaimer">
  <strong>Отказ от ответственности:</strong> Результаты расчётов носят исключительно информационный характер
  и не являются офертой или рекомендацией к заключению договора страхования. Для получения точных условий
  обратитесь в лицензированную страховую компанию Республики Казахстан. Платформа использует модели ИИ,
  которые могут содержать неточности.
</div>

<div class="footer">
  &copy; ${new Date().getFullYear()} LifeGuard KZ — AI-платформа оценки рисков страхования жизни
</div>

</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'attachment; filename="lifeguard-kz-report.html"',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Ошибка при генерации отчёта' },
      { status: 500 }
    );
  }
}
