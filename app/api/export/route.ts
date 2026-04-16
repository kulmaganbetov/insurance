import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const riskScore = data.risk_score || 0;
    const riskLevel = data.risk_level || 'Белгісіз';
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
<html lang="kk">
<head>
<meta charset="UTF-8">
<title>LifeGuard KZ - Есеп</title>
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
  <p>Өмірді сақтандыру тәуекелдерін AI бағалау платформасы</p>
  <div class="date">Есеп құрылған күні: ${new Date().toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</div>
</div>

<h2>Тәуекелді бағалау</h2>
<div>
  <span class="risk-badge" style="background: ${riskColor}">${riskScore} — ${riskLevel}</span>
</div>

<h2>Сақтандыру сыйлықақысы</h2>
<div class="premium-grid">
  <div class="premium-card main">
    <div class="label">Жылдық сыйлықақы</div>
    <div class="value">${annualPremium} ₸</div>
  </div>
  <div class="premium-card">
    <div class="label">Айлық</div>
    <div class="value">${monthlyPremium} ₸</div>
  </div>
  <div class="premium-card">
    <div class="label">Біржолғы</div>
    <div class="value">${oneTimePremium} ₸</div>
  </div>
</div>

<h2>Актуарлық есептеулер</h2>
<table>
  <thead><tr><th>Параметр</th><th>Мәні</th></tr></thead>
  <tbody>
    <tr><td>lx (x жасындағы тірі қалғандар)</td><td>${actuarial.lx?.toLocaleString('ru-RU') || '—'}</td></tr>
    <tr><td>lx+n (x+n жасындағы тірі қалғандар)</td><td>${actuarial.lx_n?.toLocaleString('ru-RU') || '—'}</td></tr>
    <tr><td>Dx (дисконтталған тірі қалғандар)</td><td>${typeof actuarial.Dx === 'number' ? actuarial.Dx.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</td></tr>
    <tr><td>Dx+n</td><td>${typeof actuarial.Dx_n === 'number' ? actuarial.Dx_n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</td></tr>
    <tr><td>Nx (коммутациялық сан)</td><td>${typeof actuarial.Nx === 'number' ? actuarial.Nx.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</td></tr>
    <tr><td>Mx (коммутациялық сан)</td><td>${typeof actuarial.Mx === 'number' ? actuarial.Mx.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</td></tr>
    <tr><td>Базалық нетто-тариф</td><td>${typeof actuarial.base_net_tariff === 'number' ? actuarial.base_net_tariff.toFixed(6) : '—'}</td></tr>
  </tbody>
</table>

${factors.length > 0 ? `
<h2>Тәуекел факторлары</h2>
<table>
  <thead><tr><th>Фактор</th><th>Түзету</th></tr></thead>
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
<h2>Күтілетін өмір сүру ұзақтығы</h2>
<div class="le-bar">
  <p><strong>Жеке болжам:</strong> ${lifeExp.personal_estimate} жас</p>
  <p><strong>Жыныс бойынша орташа:</strong> ${lifeExp.gender_average} жас</p>
  <p><strong>Қазақстан бойынша орташа:</strong> ${lifeExp.country_average} жас</p>
</div>
` : ''}

${recommendations.length > 0 ? `
<h2>Ұсыныстар</h2>
${recommendations.map((r: string, i: number) => `<div class="rec-item">${i + 1}. ${r}</div>`).join('')}
` : ''}

<div class="disclaimer">
  <strong>Жауапкершіліктен бас тарту:</strong> Есептеу нәтижелері тек ақпараттық сипатта және
  сақтандыру шартын жасасуға оферта немесе ұсыныс болып табылмайды. Нақты шарттарды алу үшін
  Қазақстан Республикасының лицензияланған сақтандыру компаниясына хабарласыңыз. Платформа AI
  модельдерін пайдаланады, олар дәлсіздіктерді қамтуы мүмкін.
</div>

<div class="footer">
  &copy; ${new Date().getFullYear()} LifeGuard KZ — Өмірді сақтандыру тәуекелдерін AI бағалау платформасы
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
      { error: 'Есеп жасау кезінде қате пайда болды' },
      { status: 500 }
    );
  }
}
