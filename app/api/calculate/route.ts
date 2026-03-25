import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `Ты — актуарий страховой компании Республики Казахстан. Твоя задача — рассчитать страховой риск и рекомендуемую страховую премию для клиента на основе актуарных формул и казахстанской статистики смертности.

РАЗДЕЛ 1: ТАБЛИЦА СМЕРТНОСТИ (КАЗАХСТАН)
Используй следующие базовые данные таблицы смертности населения Казахстана (lx — число доживших до возраста x из 100 000 родившихся):
x | lx: 0|100000, 10|98200, 20|97400, 25|96800, 30|96000, 35|95000, 40|93500, 45|91200, 50|87800, 55|82500, 60|74800, 65|63900, 70|50200, 75|34800, 80|19500, 85|8200, 90|2100, ω|0

Дисконтирующий множитель: v = 1/(1+i), где i = 0.05 (5% годовых).
Коммутационные числа: Dx = lx * v^x, Nx = сумма Dk от k=x до ω, Cx = dx * v^(x+1), Mx = сумма Ck от k=x до ω

РАЗДЕЛ 2: ФОРМУЛЫ НЕТТО-ТАРИФОВ
1. Страхование на дожитие: nEx = Dx+n / Dx
2. Пожизненное на случай смерти: Ax = Mx / (Dx * v)
3. Срочное на случай смерти (n лет): nAx = (Mx - Mx+n) / (Dx * v)
4. Пожизненная рента пренумерандо: a'x = Nx / Dx
5. Срочная рента пренумерандо: n|a'x = (Nx - Nx+n) / Dx
6. Пожизненная рента постнумерандо: ax = Nx+1 / Dx
7. Срочная рента постнумерандо: n|ax = (Nx+1 - Nx+n+1) / Dx
8. Ежегодный взнос: P_annual = nEx / ä, где ä = n|a'x
9. Брутто-тариф: Тб = (nE + α + (γ + δ) * ä) / (1 - β), α=0.05, β=0.04, γ=0.02, δ=0.03

РАЗДЕЛ 3: ПОПРАВОЧНЫЕ КОЭФФИЦИЕНТЫ
Здоровье: Гипертония +12%, Ожирение ИМТ>30 +10%, ИМТ>35 +18%, Диабет 2 +15%, ССЗ +25%, Инфаркт/инсульт +35%, Онкология ремиссия<5л +40%, >5л +15%, ХОБЛ +20%, ХПН +22%
Образ жизни: Курение активное +15%, умеренное +8%, бросил<5л +5%, Алкоголь злоупотребление +12%, Низкая активность +5%, Высокая активность -5%
Наследственность: Родитель ССЗ до 60 +8%, Онкология до 60 +6%, Диабет у обоих +7%
Регион: Алматы центр — базовый, Алатау/Наурызбай +3%, Астана — базовый, Шымкент -1%, Северные области +4%, Сельская местность +3%, Ұлытау/отдалённые +6%
Пол: Мужчина — базовый (ОПЖ 71.33), Женщина -8% (ОПЖ 79.42)

РАЗДЕЛ 4: АЛГОРИТМ (пошагово)
Шаг 1: Получить данные. Шаг 2: Вычислить lx, lx+n (интерполяция). Шаг 3: Коммутационные числа. Шаг 4: Базовый нетто-тариф. Шаг 5: K_total = 1 + сумма поправок. Шаг 6: Брутто-тариф. Шаг 7: Годовая премия. Шаг 8: Уровень риска (K<1.10 Низкий, 1.10-1.25 Средний, 1.25-1.45 Высокий, >=1.45 Очень высокий).

РАЗДЕЛ 5: ФОРМАТ ОТВЕТА — строго JSON:
{
  "client_summary": { "age", "gender", "region", "insurance_type", "insurance_term", "insurance_sum" },
  "actuarial_calculation": { "lx", "lx_n", "Dx", "Dx_n", "Nx", "Nx_n", "Mx", "base_net_tariff", "base_tariff_type" },
  "risk_factors": [{ "factor", "adjustment" }],
  "risk_calculation": { "base_tariff", "total_adjustment_coefficient", "adjusted_net_tariff", "gross_tariff", "risk_level", "risk_score" },
  "premium": { "annual_premium_per_1000", "annual_premium_tenge", "monthly_premium_tenge", "one_time_premium_tenge" },
  "life_expectancy_estimate": { "base_kazakhstan", "gender_adjusted", "personal_adjusted", "adjustment_explanation" },
  "recommendations": ["string1", "string2", "string3"],
  "comparison_traditional": { "traditional_tariff", "ai_adjusted_tariff", "difference_percent", "explanation" }
}`;

function buildUserMessage(data: Record<string, unknown>): string {
  const parts: string[] = [];

  if (data.age) parts.push(`Возраст: ${data.age}`);
  if (data.gender) parts.push(`Пол: ${data.gender}`);
  if (data.region) parts.push(`Регион: ${data.region}`);
  if (data.insuranceType) parts.push(`Тип страхования: ${data.insuranceType}`);
  if (data.insuranceTerm) parts.push(`Срок страхования: ${data.insuranceTerm} лет`);
  if (data.insuranceSum) parts.push(`Страховая сумма: ${data.insuranceSum} тенге`);

  if (data.healthConditions) {
    const conditions = Array.isArray(data.healthConditions)
      ? data.healthConditions
      : [data.healthConditions];
    if (conditions.length > 0) {
      parts.push(`Состояние здоровья: ${conditions.join(', ')}`);
    }
  }

  if (data.bmi) parts.push(`ИМТ: ${data.bmi}`);
  if (data.smoking) parts.push(`Курение: ${data.smoking}`);
  if (data.alcohol) parts.push(`Алкоголь: ${data.alcohol}`);
  if (data.physicalActivity) parts.push(`Физическая активность: ${data.physicalActivity}`);

  if (data.heredpietary || data.hereditary) {
    const hereditary = (data.hereditary || data.heredpietary) as string[];
    if (Array.isArray(hereditary) && hereditary.length > 0) {
      parts.push(`Наследственность: ${hereditary.join(', ')}`);
    }
  }

  if (data.occupation) parts.push(`Профессия: ${data.occupation}`);

  return `Рассчитай страховой риск и премию для следующего клиента:\n\n${parts.join('\n')}`;
}

function generateFallbackResult(data: Record<string, unknown>) {
  const age = Number(data.age) || 35;
  const gender = String(data.gender || 'Мужчина');
  const region = String(data.region || 'Алматы');
  const insuranceType = String(data.insuranceType || 'Срочное на случай смерти');
  const insuranceTerm = Number(data.insuranceTerm) || 10;
  const insuranceSum = Number(data.insuranceSum) || 5000000;

  let baseCoeff = 1.0;
  const factors: { factor: string; adjustment: string }[] = [];

  if (gender === 'Мужчина') {
    baseCoeff += 0.0;
    factors.push({ factor: 'Пол: Мужчина', adjustment: '+0% (базовый)' });
  } else {
    baseCoeff -= 0.08;
    factors.push({ factor: 'Пол: Женщина', adjustment: '-8%' });
  }

  if (age > 50) {
    baseCoeff += 0.1;
    factors.push({ factor: 'Возраст старше 50', adjustment: '+10%' });
  }

  if (data.smoking === 'active' || data.smoking === 'Активное') {
    baseCoeff += 0.15;
    factors.push({ factor: 'Курение активное', adjustment: '+15%' });
  }

  const baseTariff = 0.035;
  const adjustedTariff = baseTariff * baseCoeff;
  const grossTariff = (adjustedTariff + 0.05 + (0.02 + 0.03) * insuranceTerm) / (1 - 0.04);
  const annualPremium = Math.round(insuranceSum * adjustedTariff);
  const monthlyPremium = Math.round(annualPremium / 12);

  let riskLevel = 'Низкий';
  let riskScore = 25;
  if (baseCoeff >= 1.45) { riskLevel = 'Очень высокий'; riskScore = 90; }
  else if (baseCoeff >= 1.25) { riskLevel = 'Высокий'; riskScore = 70; }
  else if (baseCoeff >= 1.10) { riskLevel = 'Средний'; riskScore = 50; }

  const baseLifeExpectancy = gender === 'Женщина' ? 79.42 : 71.33;

  return {
    client_summary: {
      age,
      gender,
      region,
      insurance_type: insuranceType,
      insurance_term: insuranceTerm,
      insurance_sum: insuranceSum,
    },
    actuarial_calculation: {
      lx: 95000,
      lx_n: 87800,
      Dx: 95000 * Math.pow(1 / 1.05, age),
      Dx_n: 87800 * Math.pow(1 / 1.05, age + insuranceTerm),
      Nx: 450000,
      Nx_n: 280000,
      Mx: 12500,
      base_net_tariff: Number(baseTariff.toFixed(6)),
      base_tariff_type: insuranceType,
    },
    risk_factors: factors,
    risk_calculation: {
      base_tariff: Number(baseTariff.toFixed(6)),
      total_adjustment_coefficient: Number(baseCoeff.toFixed(4)),
      adjusted_net_tariff: Number(adjustedTariff.toFixed(6)),
      gross_tariff: Number(grossTariff.toFixed(6)),
      risk_level: riskLevel,
      risk_score: riskScore,
    },
    premium: {
      annual_premium_per_1000: Number((adjustedTariff * 1000).toFixed(2)),
      annual_premium_tenge: annualPremium,
      monthly_premium_tenge: monthlyPremium,
      one_time_premium_tenge: Math.round(annualPremium * insuranceTerm * 0.85),
    },
    life_expectancy_estimate: {
      base_kazakhstan: 75.38,
      gender_adjusted: baseLifeExpectancy,
      personal_adjusted: Number((baseLifeExpectancy - (baseCoeff - 1) * 10).toFixed(1)),
      adjustment_explanation: 'Оценка скорректирована на основе факторов риска клиента',
    },
    recommendations: [
      'Рекомендуется ежегодное медицинское обследование',
      'Поддерживайте здоровый образ жизни для снижения рисков',
      'Рассмотрите дополнительное страхование от критических заболеваний',
    ],
    comparison_traditional: {
      traditional_tariff: Number(baseTariff.toFixed(6)),
      ai_adjusted_tariff: Number(adjustedTariff.toFixed(6)),
      difference_percent: Number(((baseCoeff - 1) * 100).toFixed(1)),
      explanation: 'AI-модель учитывает индивидуальные факторы риска для более точного расчёта',
    },
    _fallback: true,
  };
}

async function trySaveToDb(data: Record<string, unknown>, result: Record<string, unknown>) {
  try {
    const { sql } = await import('@vercel/postgres');
    await sql`
      INSERT INTO calculations (
        age, gender, region, insurance_type, insurance_term, insurance_sum,
        risk_level, risk_score, annual_premium, monthly_premium,
        result_json, created_at
      ) VALUES (
        ${Number(data.age)},
        ${String(data.gender)},
        ${String(data.region)},
        ${String(data.insuranceType)},
        ${Number(data.insuranceTerm)},
        ${Number(data.insuranceSum)},
        ${String((result as { risk_calculation?: { risk_level?: string } }).risk_calculation?.risk_level || 'Неизвестно')},
        ${Number((result as { risk_calculation?: { risk_score?: number } }).risk_calculation?.risk_score || 0)},
        ${Number((result as { premium?: { annual_premium_tenge?: number } }).premium?.annual_premium_tenge || 0)},
        ${Number((result as { premium?: { monthly_premium_tenge?: number } }).premium?.monthly_premium_tenge || 0)},
        ${JSON.stringify(result)},
        NOW()
      )
    `;
  } catch {
    // DB not available — silently ignore
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const userMessage = buildUserMessage(data);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from GPT');
      }

      let result: Record<string, unknown>;
      try {
        result = JSON.parse(content);
      } catch {
        throw new Error('GPT returned non-JSON response');
      }

      // Try to save to DB (non-blocking)
      trySaveToDb(data, result).catch(() => {});

      return NextResponse.json(result);
    } catch (gptError) {
      console.error('GPT API error, using fallback calculation:', gptError);

      const fallbackResult = generateFallbackResult(data);

      // Try to save fallback to DB (non-blocking)
      trySaveToDb(data, fallbackResult).catch(() => {});

      return NextResponse.json(fallbackResult);
    }
  } catch (error) {
    console.error('Calculate API error:', error);
    return NextResponse.json(
      { error: 'Ошибка при расчёте. Пожалуйста, попробуйте снова.' },
      { status: 500 }
    );
  }
}
