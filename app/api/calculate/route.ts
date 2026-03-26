import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `Ты — актуарий страховой компании Республики Казахстан. Твоя задача — рассчитать страховой риск и рекомендуемую страховую премию для клиента на основе актуарных формул и казахстанской статистики смертности.

РАЗДЕЛ 1: ТАБЛИЦА СМЕРТНОСТИ (КАЗАХСТАН)
Используй следующие базовые данные таблицы смертности населения Казахстана (lx — число доживших до возраста x из 100 000 родившихся):
x | lx: 0|100000, 10|98200, 20|97400, 25|96800, 30|96000, 35|95000, 40|93500, 45|91200, 50|87800, 55|82500, 60|74800, 65|63900, 70|50200, 75|34800, 80|19500, 85|8200, 90|2100, ω|0

Дисконтирующий множитель: v = 1/(1+i), где i = 0.05 (5% годовых).
Коммутационные числа: Dx = lx * v^x, Nx = сумма Dk от k=x до ω, Cx = dx * v^(x+1), Mx = сумма Ck от k=x до ω

РАЗДЕЛ 2: ФОРМУЛЫ НЕТТО-ТАРИФОВ (Таблица 23.2)
1. Страхование на дожитие (до возраста x+n лет): nEx = Dx+n / Dx
2. Пожизненное на случай смерти: Ax = Mx / (Dx * v)
3. Срочное на случай смерти на n лет: nAx = (Mx - Mx+n) / (Dx * v)
4. Пожизненная рента пренумерандо: a'x = Nx / Dx
5. Срочная рента пренумерандо на n лет: n|a'x = (Nx - Nx+n) / Dx
6. Пожизненная рента постнумерандо: ax = Nx+1 / Dx
7. Срочная рента постнумерандо на n лет: n|ax = (Nx+1 - Nx+n+1) / Dx
8. Ежегодный взнос: P_annual = nEx / ä, где ä = n|a'x
9. Брутто-тариф: Тб = (nE + α + (γ + δ) * ä) / (1 - β), α=0.05, β=0.04, γ=0.02, δ=0.03

РАЗДЕЛ 3: ПОПРАВОЧНЫЕ КОЭФФИЦИЕНТЫ РИСКА
ЗДОРОВЬЕ:
- Гипертония (давление > 140/90): +12%
- Ожирение (ИМТ > 30): +10%
- Ожирение тяжёлое (ИМТ > 35): +18%
- Сахарный диабет 2 типа: +15%
- Сердечно-сосудистые заболевания: +25%
- Перенесённый инфаркт/инсульт: +35%
- Онкология в анамнезе (ремиссия < 5 лет): +40%
- Онкология в анамнезе (ремиссия > 5 лет): +15%
- Хронические болезни лёгких (ХОБЛ): +20%
- Хроническая почечная недостаточность: +22%

ОБРАЗ ЖИЗНИ:
- Курение активное (> 10 сигарет/день): +15%
- Курение умеренное (< 10 сигарет/день): +8%
- Бросил курить (< 5 лет назад): +5%
- Злоупотребление алкоголем: +12%
- Физическая активность низкая: +5%
- Физическая активность высокая: -5% (скидка)

НАСЛЕДСТВЕННОСТЬ:
- Смерть родителя от ССЗ до 60 лет: +8%
- Смерть родителя от онкологии до 60 лет: +6%
- Диабет у обоих родителей: +7%

РЕГИОН:
- Алматы (центральные районы): базовый тариф
- Алматы (Алатау, Наурызбай): +3%
- Астана: базовый тариф
- Шымкент: -1%
- Северные области (ВКО, СКО, Павлодар): +4%
- Сельская местность: +3%
- Ұлытау, отдалённые регионы: +6%

ПОЛ:
- Мужчина: базовый тариф (ОПЖ = 71.33 года)
- Женщина: -8% (ОПЖ = 79.42 года)

РАЗДЕЛ 4: АЛГОРИТМ (выполняй СТРОГО по шагам)
Шаг 1: Получить данные клиента.
Шаг 2: Вычислить lx и lx+n (интерполяция линейная).
Шаг 3: Вычислить коммутационные числа Dx, Dx+n, Nx, Nx+n, Mx.
Шаг 4: Базовый нетто-тариф по нужной формуле.
Шаг 5: K_total = 1 + сумма всех поправок.
Шаг 6: Скорректированный тариф и брутто-тариф.
Шаг 7: Годовая премия = Брутто-тариф * Страховая сумма.
Шаг 8: Уровень риска: K<1.10 Низкий, 1.10-1.25 Средний, 1.25-1.45 Высокий, >=1.45 Очень высокий.

РАЗДЕЛ 5: ФОРМАТ ОТВЕТА — строго JSON, все числа как числа (не строки), adjustment как строки вида "+12%":
{
  "client_summary": { "age": 35, "gender": "Мужчина", "region": "Алматы", "insurance_type": "Смешанное", "insurance_term": 20, "insurance_sum": 10000000 },
  "actuarial_calculation": { "lx": 95000, "lx_n": 82500, "Dx": 18456.2, "Dx_n": 7823.1, "Nx": 95234.5, "Nx_n": 41230.8, "Mx": 3241.7, "base_net_tariff": 0.4234, "base_tariff_type": "nEx (страхование на дожитие)" },
  "risk_factors": [{ "factor": "Гипертония", "adjustment": "+12%" }, { "factor": "Курение активное", "adjustment": "+15%" }],
  "risk_calculation": { "base_tariff": 0.4234, "total_adjustment_coefficient": 1.27, "adjusted_net_tariff": 0.5377, "gross_tariff": 0.6021, "risk_level": "Высокий", "risk_score": 27 },
  "premium": { "annual_premium_per_1000": 60.21, "annual_premium_tenge": 180630, "monthly_premium_tenge": 15052, "one_time_premium_tenge": 2108400 },
  "life_expectancy_estimate": { "base_kazakhstan": 75.44, "gender_adjusted": 71.33, "personal_adjusted": 68.1, "adjustment_explanation": "Курение и гипертония снижают ОПЖ на ~3.2 года" },
  "recommendations": ["Рекомендуем смешанное страхование жизни на 20 лет", "Рассмотрите страхование от критических заболеваний", "При отказе от курения тариф снизится на ~8%"],
  "comparison_traditional": { "traditional_tariff": 0.4234, "ai_adjusted_tariff": 0.5377, "difference_percent": 27, "explanation": "Традиционный расчёт не учитывает индивидуальные факторы. AI скорректировал на +27%." }
}`;

// ─── Mortality table ───────────────────────────────────────────────
const MORTALITY_TABLE: Array<[number, number]> = [
  [0, 100000], [10, 98200], [20, 97400], [25, 96800], [30, 96000],
  [35, 95000], [40, 93500], [45, 91200], [50, 87800], [55, 82500],
  [60, 74800], [65, 63900], [70, 50200], [75, 34800], [80, 19500],
  [85, 8200], [90, 2100], [100, 0],
];

function interpolateLx(age: number): number {
  if (age <= 0) return 100000;
  if (age >= 100) return 0;
  for (let i = 0; i < MORTALITY_TABLE.length - 1; i++) {
    const [x0, lx0] = MORTALITY_TABLE[i];
    const [x1, lx1] = MORTALITY_TABLE[i + 1];
    if (age >= x0 && age <= x1) {
      const fraction = (age - x0) / (x1 - x0);
      return Math.round(lx0 + fraction * (lx1 - lx0));
    }
  }
  return 0;
}

const V = 1 / 1.05; // discount factor

function computeDx(age: number): number {
  return interpolateLx(age) * Math.pow(V, age);
}

function computeNx(age: number): number {
  let sum = 0;
  for (let k = age; k <= 100; k++) {
    sum += computeDx(k);
  }
  return sum;
}

function computeCx(age: number): number {
  const dx = interpolateLx(age) - interpolateLx(age + 1);
  return dx * Math.pow(V, age + 1);
}

function computeMx(age: number): number {
  let sum = 0;
  for (let k = age; k <= 100; k++) {
    sum += computeCx(k);
  }
  return sum;
}

// ─── Disease ID to Russian label mapping ───────────────────────────
const DISEASE_LABELS: Record<string, string> = {
  hypertension: 'Гипертония',
  diabetes: 'Сахарный диабет 2 типа',
  cardiovascular: 'Сердечно-сосудистые заболевания',
  heart_attack_stroke: 'Перенесённый инфаркт/инсульт',
  oncology: 'Онкология в анамнезе',
  chronic_lung: 'Хронические болезни лёгких (ХОБЛ)',
  chronic_kidney: 'Хроническая почечная недостаточность',
};

const DISEASE_ADJUSTMENTS: Record<string, number> = {
  hypertension: 0.12,
  diabetes: 0.15,
  cardiovascular: 0.25,
  heart_attack_stroke: 0.35,
  oncology: 0.40,
  chronic_lung: 0.20,
  chronic_kidney: 0.22,
};

const SMOKING_LABELS: Record<string, string> = {
  none: 'Не курит',
  moderate: 'Курение умеренное',
  active: 'Курение активное',
  quit_recent: 'Бросил курить < 5 лет',
};

const ALCOHOL_LABELS: Record<string, string> = {
  none: 'Не употребляет алкоголь',
  moderate: 'Алкоголь умеренно',
  abuse: 'Злоупотребление алкоголем',
};

const ACTIVITY_LABELS: Record<string, string> = {
  low: 'Физическая активность низкая',
  medium: 'Физическая активность средняя',
  high: 'Физическая активность высокая',
};

const HEREDITY_LABELS: Record<string, string> = {
  parent_cvd: 'Родитель умер от ССЗ до 60 лет',
  parent_oncology: 'Родитель умер от онкологии до 60 лет',
  parent_diabetes: 'Диабет у обоих родителей',
};

const REGION_LABELS: Record<string, string> = {
  almaty_city: 'г. Алматы',
  astana_city: 'г. Астана',
  shymkent_city: 'г. Шымкент',
  akmola: 'Акмолинская область',
  aktobe: 'Актюбинская область',
  almaty: 'Алматинская область',
  atyrau: 'Атырауская область',
  east_kaz: 'ВКО',
  zhambyl: 'Жамбылская область',
  west_kaz: 'ЗКО',
  karaganda: 'Карагандинская область',
  kostanay: 'Костанайская область',
  kyzylorda: 'Кызылординская область',
  mangystau: 'Мангистауская область',
  pavlodar: 'Павлодарская область',
  north_kaz: 'СКО',
  turkestan: 'Туркестанская область',
  ulytau: 'Область Ұлытау',
  abay: 'Область Абай',
  zhetisu: 'Область Жетісу',
};

const INSURANCE_TYPE_LABELS: Record<string, string> = {
  endowment: 'На дожитие',
  term_life: 'На случай смерти (срочное)',
  mixed: 'Смешанное',
  whole_life: 'Пожизненное',
  pension_annuity: 'Пенсионная рента',
};

// ─── Build GPT user message ────────────────────────────────────────
function buildUserMessage(data: Record<string, unknown>): string {
  const age = data.age;
  const gender = data.gender === 'male' ? 'Мужчина' : 'Женщина';
  const region = REGION_LABELS[String(data.region)] || String(data.region);
  const insType = INSURANCE_TYPE_LABELS[String(data.insuranceType)] || String(data.insuranceType);
  const bmi = data.bmi;
  const bmiCat = data.bmiCategory || '';
  const bp = data.bloodPressure || 'Не указано';
  const diseases = Array.isArray(data.diseases) && data.diseases.length > 0
    ? data.diseases.map((d: string) => DISEASE_LABELS[d] || d).join(', ')
    : 'нет';
  const smoking = SMOKING_LABELS[String(data.smoking)] || String(data.smoking);
  const alcohol = ALCOHOL_LABELS[String(data.alcohol)] || String(data.alcohol);
  const activity = ACTIVITY_LABELS[String(data.activity)] || String(data.activity);
  const heredity = Array.isArray(data.heredity) && data.heredity.length > 0
    ? data.heredity.map((h: string) => HEREDITY_LABELS[h] || h).join(', ')
    : 'нет';

  return `Рассчитай страховой риск для клиента со следующими данными:
- Возраст: ${age} лет
- Пол: ${gender}
- Регион: ${region}
- ИМТ: ${bmi} (${bmiCat})
- Артериальное давление: ${bp}
- Хронические заболевания: ${diseases}
- Курение: ${smoking}
- Алкоголь: ${alcohol}
- Физическая активность: ${activity}
- Наследственность: ${heredity}
- Тип страхования: ${insType}
- Срок страхования: ${data.term} лет
- Страховая сумма: ${data.insuranceSum} тенге`;
}

// ─── Full fallback actuarial calculation ───────────────────────────
function generateFallbackResult(data: Record<string, unknown>) {
  const age = Number(data.age) || 35;
  const gender = String(data.gender || 'male');
  const region = String(data.region || 'almaty_city');
  const insuranceType = String(data.insuranceType || 'mixed');
  const term = Number(data.term) || 20;
  const insuranceSum = Number(data.insuranceSum) || 5000000;
  const bmi = Number(data.bmi) || 24;
  const diseases = Array.isArray(data.diseases) ? data.diseases as string[] : [];
  const smoking = String(data.smoking || 'none');
  const alcohol = String(data.alcohol || 'none');
  const activity = String(data.activity || 'medium');
  const heredity = Array.isArray(data.heredity) ? data.heredity as string[] : [];

  // Step 2: lx values
  const lx = interpolateLx(age);
  const lxn = interpolateLx(age + term);

  // Step 3: Commutation numbers
  const Dx = computeDx(age);
  const Dxn = computeDx(age + term);
  const Nx = computeNx(age);
  const Nxn = computeNx(age + term);
  const Mx = computeMx(age);
  const Mxn = computeMx(age + term);

  // Step 4: Base net tariff depending on type
  let baseTariff = 0;
  let tariffType = '';

  switch (insuranceType) {
    case 'endowment':
      baseTariff = Dxn / Dx; // nEx
      tariffType = 'nEx (страхование на дожитие)';
      break;
    case 'term_life':
      baseTariff = (Mx - Mxn) / (Dx * V); // nAx
      tariffType = 'nAx (срочное на случай смерти)';
      break;
    case 'whole_life':
      baseTariff = Mx / (Dx * V); // Ax
      tariffType = 'Ax (пожизненное на случай смерти)';
      break;
    case 'pension_annuity':
      baseTariff = Nxn / Dx; // deferred annuity
      tariffType = 'Отложенная рента (пенсионная)';
      break;
    case 'mixed':
    default: {
      const endowment = Dxn / Dx;
      const termLife = (Mx - Mxn) / (Dx * V);
      baseTariff = endowment + termLife;
      tariffType = 'nEx + nAx (смешанное страхование)';
      break;
    }
  }

  // Step 5: Risk factors
  const factors: Array<{ factor: string; adjustment: string }> = [];
  let totalAdj = 0;

  // Gender
  if (gender === 'female') {
    totalAdj -= 0.08;
    factors.push({ factor: 'Пол: Женщина (ОПЖ 79.42)', adjustment: '-8%' });
  } else {
    factors.push({ factor: 'Пол: Мужчина (ОПЖ 71.33)', adjustment: '+0%' });
  }

  // Region
  const regionAdj: Record<string, number> = {
    almaty_city: 0, astana_city: 0, shymkent_city: -0.01,
    east_kaz: 0.04, north_kaz: 0.04, pavlodar: 0.04,
    ulytau: 0.06, almaty: 0.03, akmola: 0.02,
    aktobe: 0.03, atyrau: 0.03, zhambyl: 0.02,
    west_kaz: 0.03, karaganda: 0.02, kostanay: 0.03,
    kyzylorda: 0.03, mangystau: 0.03, turkestan: 0.01,
    abay: 0.04, zhetisu: 0.03,
  };
  const rAdj = regionAdj[region] || 0;
  if (rAdj !== 0) {
    totalAdj += rAdj;
    factors.push({ factor: `Регион: ${REGION_LABELS[region] || region}`, adjustment: `${rAdj > 0 ? '+' : ''}${(rAdj * 100).toFixed(0)}%` });
  }

  // BMI
  if (bmi > 35) {
    totalAdj += 0.18;
    factors.push({ factor: 'Ожирение тяжёлое (ИМТ > 35)', adjustment: '+18%' });
  } else if (bmi > 30) {
    totalAdj += 0.10;
    factors.push({ factor: 'Ожирение (ИМТ > 30)', adjustment: '+10%' });
  }

  // Diseases
  for (const d of diseases) {
    const adj = DISEASE_ADJUSTMENTS[d];
    if (adj) {
      totalAdj += adj;
      factors.push({ factor: DISEASE_LABELS[d] || d, adjustment: `+${(adj * 100).toFixed(0)}%` });
    }
  }

  // Smoking
  const smokingAdj: Record<string, number> = { active: 0.15, moderate: 0.08, quit_recent: 0.05, none: 0 };
  const sAdj = smokingAdj[smoking] || 0;
  if (sAdj > 0) {
    totalAdj += sAdj;
    factors.push({ factor: SMOKING_LABELS[smoking] || smoking, adjustment: `+${(sAdj * 100).toFixed(0)}%` });
  }

  // Alcohol
  if (alcohol === 'abuse') {
    totalAdj += 0.12;
    factors.push({ factor: 'Злоупотребление алкоголем', adjustment: '+12%' });
  }

  // Activity
  if (activity === 'low') {
    totalAdj += 0.05;
    factors.push({ factor: 'Физическая активность низкая', adjustment: '+5%' });
  } else if (activity === 'high') {
    totalAdj -= 0.05;
    factors.push({ factor: 'Физическая активность высокая', adjustment: '-5%' });
  }

  // Heredity
  const heredityAdj: Record<string, number> = { parent_cvd: 0.08, parent_oncology: 0.06, parent_diabetes: 0.07 };
  for (const h of heredity) {
    const hAdj = heredityAdj[h];
    if (hAdj) {
      totalAdj += hAdj;
      factors.push({ factor: HEREDITY_LABELS[h] || h, adjustment: `+${(hAdj * 100).toFixed(0)}%` });
    }
  }

  const K_total = 1 + totalAdj;
  const adjustedTariff = baseTariff * K_total;

  // Step 6: Gross tariff
  const annuityCoeff = Dx > 0 ? (Nx - Nxn) / Dx : term; // n|a'x
  const alpha = 0.05, beta = 0.04, gamma = 0.02, delta = 0.03;
  const grossTariff = (adjustedTariff + alpha + (gamma + delta) * annuityCoeff) / (1 - beta);

  // Step 7: Premium
  const annualPremium = Math.round(grossTariff * insuranceSum);
  const monthlyPremium = Math.round(annualPremium / 12);
  const oneTimePremium = Math.round(annualPremium * annuityCoeff * 0.85);

  // Step 8: Risk level
  let riskLevel = 'Низкий';
  let riskScore = 15;
  if (K_total >= 1.45) { riskLevel = 'Очень высокий'; riskScore = 85; }
  else if (K_total >= 1.25) { riskLevel = 'Высокий'; riskScore = 65; }
  else if (K_total >= 1.10) { riskLevel = 'Средний'; riskScore = 40; }

  // Scale risk_score to 0-100 range based on K_total
  riskScore = Math.min(100, Math.max(1, Math.round((K_total - 0.9) * 100)));

  const baseLifeExpectancy = gender === 'female' ? 79.42 : 71.33;
  const personalLE = Number((baseLifeExpectancy - totalAdj * 8).toFixed(1));

  // Traditional (without adjustments)
  const traditionalAnnual = Math.round((baseTariff + alpha + (gamma + delta) * annuityCoeff) / (1 - beta) * insuranceSum);
  const diffPercent = traditionalAnnual > 0
    ? Number(((annualPremium - traditionalAnnual) / traditionalAnnual * 100).toFixed(1))
    : 0;

  return {
    client_summary: {
      age,
      gender: gender === 'male' ? 'Мужчина' : 'Женщина',
      region: REGION_LABELS[region] || region,
      insurance_type: INSURANCE_TYPE_LABELS[insuranceType] || insuranceType,
      insurance_term: term,
      insurance_sum: insuranceSum,
    },
    actuarial_calculation: {
      lx,
      lx_n: lxn,
      Dx: Number(Dx.toFixed(2)),
      Dx_n: Number(Dxn.toFixed(2)),
      Nx: Number(Nx.toFixed(2)),
      Nx_n: Number(Nxn.toFixed(2)),
      Mx: Number(Mx.toFixed(2)),
      base_net_tariff: Number(baseTariff.toFixed(6)),
      base_tariff_type: tariffType,
    },
    risk_factors: factors,
    risk_calculation: {
      base_tariff: Number(baseTariff.toFixed(6)),
      total_adjustment_coefficient: Number(K_total.toFixed(4)),
      adjusted_net_tariff: Number(adjustedTariff.toFixed(6)),
      gross_tariff: Number(grossTariff.toFixed(6)),
      risk_level: riskLevel,
      risk_score: riskScore,
    },
    premium: {
      annual_premium_per_1000: Number((grossTariff * 1000).toFixed(2)),
      annual_premium_tenge: annualPremium,
      monthly_premium_tenge: monthlyPremium,
      one_time_premium_tenge: oneTimePremium,
    },
    life_expectancy_estimate: {
      base_kazakhstan: 75.44,
      gender_adjusted: baseLifeExpectancy,
      personal_adjusted: personalLE,
      adjustment_explanation: factors.length > 1
        ? `Факторы риска ${factors.filter(f => f.adjustment.startsWith('+')).map(f => f.factor).slice(0, 3).join(', ')} снижают ОПЖ`
        : 'Оценка скорректирована на основе факторов риска клиента',
    },
    recommendations: [
      `Рекомендуем ${INSURANCE_TYPE_LABELS[insuranceType]?.toLowerCase() || 'смешанное'} страхование жизни на ${term} лет`,
      smoking !== 'none' ? 'При отказе от курения тариф снизится на 8–15%' : 'Рассмотрите страхование от критических заболеваний',
      activity === 'low' ? 'Увеличение физической активности снизит тариф на 5%' : 'Поддерживайте текущий уровень физической активности для сохранения тарифа',
    ],
    comparison_traditional: {
      traditional_tariff: Number(baseTariff.toFixed(6)),
      ai_adjusted_tariff: Number(adjustedTariff.toFixed(6)),
      difference_percent: diffPercent,
      explanation: `Традиционный расчёт не учитывает индивидуальные факторы риска. AI скорректировал тариф на ${diffPercent > 0 ? '+' : ''}${diffPercent}%.`,
    },
  };
}

// ─── DB save (non-blocking) ────────────────────────────────────────
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
        ${Number(data.term)},
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

// ─── POST handler ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Try GPT first if API key is configured
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-...') {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const userMessage = buildUserMessage(data);

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('Empty response from GPT');

        const result = JSON.parse(content);
        trySaveToDb(data, result).catch(() => {});
        return NextResponse.json(result);
      } catch (gptError) {
        console.error('GPT API error, using fallback:', gptError);
      }
    }

    // Fallback: local actuarial calculation
    const fallbackResult = generateFallbackResult(data);
    trySaveToDb(data, fallbackResult).catch(() => {});
    return NextResponse.json(fallbackResult);

  } catch (error) {
    console.error('Calculate API error:', error);
    return NextResponse.json(
      { error: 'Ошибка при расчёте. Пожалуйста, попробуйте снова.' },
      { status: 500 }
    );
  }
}
