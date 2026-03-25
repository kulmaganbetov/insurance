import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(16, 185, 129);
    doc.setFontSize(22);
    doc.text('LifeGuard KZ', 20, 20);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.text('AI-platforma ocenki riskov strahovaniya zhizni', 20, 28);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`Otchyot sformirovan: ${new Date().toLocaleString('ru-RU')}`, 20, 35);

    let y = 50;

    // Risk level
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Uroven riska', 20, y);
    y += 8;

    const riskLevel = data.risk_level || 'N/A';
    const riskScore = data.risk_score || 0;

    doc.setFontSize(24);
    if (riskScore <= 25) doc.setTextColor(16, 185, 129);
    else if (riskScore <= 50) doc.setTextColor(245, 158, 11);
    else if (riskScore <= 75) doc.setTextColor(249, 115, 22);
    else doc.setTextColor(239, 68, 68);

    doc.text(`${riskScore} - ${riskLevel}`, 20, y + 5);
    y += 20;

    // Premium section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Strahovaya premiya', 20, y);
    y += 8;

    const premiumData = [
      ['Godovaya premiya', `${(data.annual_premium || 0).toLocaleString('ru-RU')} tg`],
      ['Ezhemesyachnaya premiya', `${(data.monthly_premium || 0).toLocaleString('ru-RU')} tg`],
      ['Edinovremennaya premiya', `${(data.one_time_premium || 0).toLocaleString('ru-RU')} tg`],
    ];

    autoTable(doc, {
      startY: y,
      head: [['Parametr', 'Znachenie']],
      body: premiumData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10 },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // Actuarial calculations
    if (data.actuarial) {
      doc.setFontSize(14);
      doc.text('Aktuarnye raschyoty', 20, y);
      y += 8;

      const actuarialData = [
        ['lx', String(data.actuarial.lx || 0)],
        ['lx+n', String(data.actuarial.lx_n || 0)],
        ['Dx', String(data.actuarial.Dx || 0)],
        ['Dx+n', String(data.actuarial.Dx_n || 0)],
        ['Nx', String(data.actuarial.Nx || 0)],
        ['Mx', String(data.actuarial.Mx || 0)],
        ['Bazovyj netto-tarif', String(data.actuarial.base_net_tariff || 0)],
      ];

      autoTable(doc, {
        startY: y,
        head: [['Parametr', 'Znachenie']],
        body: actuarialData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
      });

      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    }

    // Risk factors
    if (data.risk_factors && data.risk_factors.length > 0) {
      if (y > 230) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text('Faktory riska', 20, y);
      y += 8;

      const factorData = data.risk_factors.map((f: { factor: string; adjustment: number | string }) => [
        f.factor,
        typeof f.adjustment === 'number' ? `${f.adjustment > 0 ? '+' : ''}${f.adjustment}%` : String(f.adjustment),
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Faktor', 'Popravka']],
        body: factorData,
        theme: 'grid',
        headStyles: { fillColor: [249, 115, 22] },
        styles: { fontSize: 10 },
      });

      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    }

    // Recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text('Rekomendacii', 20, y);
      y += 8;

      doc.setFontSize(10);
      data.recommendations.forEach((rec: string, i: number) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${i + 1}. ${rec}`, 20, y);
        y += 7;
      });
    }

    // Disclaimer
    if (y > 250) {
      doc.addPage();
      y = 20;
    } else {
      y += 10;
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 8;

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.text(
      'Raschyot nosit isklyuchitelno informacionnyj harakter i ne yavlyaetsya ofertoj.',
      20,
      y
    );
    doc.text(
      'Dlya polucheniya tochnyh uslovij obratites v licenzirovannuyu strahovuyu kompaniyu RK.',
      20,
      y + 5
    );
    doc.text('LifeGuard KZ - AI-platforma ocenki riskov strahovaniya zhizni', 20, y + 10);

    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="lifeguard-kz-report.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Oshibka pri generacii PDF' },
      { status: 500 }
    );
  }
}
