import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    try {
      const { sql } = await import('@vercel/postgres');

      await sql`
        INSERT INTO calculations (
          age, gender, region, insurance_type, insurance_term, insurance_sum,
          risk_level, risk_score, annual_premium, monthly_premium,
          result_json, created_at
        ) VALUES (
          ${Number(data.age || data.client_summary?.age || 0)},
          ${String(data.gender || data.client_summary?.gender || '')},
          ${String(data.region || data.client_summary?.region || '')},
          ${String(data.insuranceType || data.client_summary?.insurance_type || '')},
          ${Number(data.insuranceTerm || data.client_summary?.insurance_term || 0)},
          ${Number(data.insuranceSum || data.client_summary?.insurance_sum || 0)},
          ${String(data.risk_calculation?.risk_level || data.riskLevel || 'Белгісіз')},
          ${Number(data.risk_calculation?.risk_score || data.riskScore || 0)},
          ${Number(data.premium?.annual_premium_tenge || data.annualPremium || 0)},
          ${Number(data.premium?.monthly_premium_tenge || data.monthlyPremium || 0)},
          ${JSON.stringify(data)},
          NOW()
        )
      `;

      return NextResponse.json({ success: true, source: 'database' });
    } catch {
      // DB not available — graceful fallback
      console.warn('Database not available, returning success without saving');
      return NextResponse.json({ success: true, source: 'fallback' });
    }
  } catch (error) {
    console.error('Save result API error:', error);
    return NextResponse.json(
      { error: 'Нәтижені сақтау қатесі' },
      { status: 500 }
    );
  }
}
