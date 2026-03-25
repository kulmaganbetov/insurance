'use client';

import { motion } from 'framer-motion';
import { BookOpen, Database, Brain, Calculator, FileText } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const MORTALITY_TABLE = [
  { x: 0, lx: 100000 }, { x: 10, lx: 98200 }, { x: 20, lx: 97400 },
  { x: 25, lx: 96800 }, { x: 30, lx: 96000 }, { x: 35, lx: 95000 },
  { x: 40, lx: 93500 }, { x: 45, lx: 91200 }, { x: 50, lx: 87800 },
  { x: 55, lx: 82500 }, { x: 60, lx: 74800 }, { x: 65, lx: 63900 },
  { x: 70, lx: 50200 }, { x: 75, lx: 34800 }, { x: 80, lx: 19500 },
  { x: 85, lx: 8200 }, { x: 90, lx: 2100 },
];

const RISK_COEFFICIENTS = [
  { category: 'Здоровье', factors: [
    { name: 'Гипертония (АД > 140/90)', value: '+12%' },
    { name: 'Ожирение (ИМТ > 30)', value: '+10%' },
    { name: 'Ожирение тяжёлое (ИМТ > 35)', value: '+18%' },
    { name: 'Сахарный диабет 2 типа', value: '+15%' },
    { name: 'Сердечно-сосудистые заболевания', value: '+25%' },
    { name: 'Перенесённый инфаркт/инсульт', value: '+35%' },
    { name: 'Онкология (ремиссия < 5 лет)', value: '+40%' },
    { name: 'Онкология (ремиссия > 5 лет)', value: '+15%' },
    { name: 'Хронические болезни лёгких (ХОБЛ)', value: '+20%' },
    { name: 'Хроническая почечная недостаточность', value: '+22%' },
  ]},
  { category: 'Образ жизни', factors: [
    { name: 'Курение активное (> 10 сигарет/день)', value: '+15%' },
    { name: 'Курение умеренное (< 10 сигарет/день)', value: '+8%' },
    { name: 'Бросил курить (< 5 лет назад)', value: '+5%' },
    { name: 'Злоупотребление алкоголем', value: '+12%' },
    { name: 'Низкая физическая активность', value: '+5%' },
    { name: 'Высокая физическая активность', value: '-5%' },
  ]},
  { category: 'Наследственность', factors: [
    { name: 'Смерть родителя от ССЗ до 60 лет', value: '+8%' },
    { name: 'Смерть родителя от онкологии до 60 лет', value: '+6%' },
    { name: 'Диабет у обоих родителей', value: '+7%' },
  ]},
  { category: 'Регион', factors: [
    { name: 'Алматы (центр), Астана', value: 'Базовый' },
    { name: 'Алматы (Алатау, Наурызбай)', value: '+3%' },
    { name: 'Шымкент', value: '-1%' },
    { name: 'Северные области (ВКО, СКО, Павлодар)', value: '+4%' },
    { name: 'Сельская местность', value: '+3%' },
    { name: 'Ұлытау, отдалённые регионы', value: '+6%' },
  ]},
  { category: 'Пол', factors: [
    { name: 'Мужчина (ОПЖ 71.33 года)', value: 'Базовый' },
    { name: 'Женщина (ОПЖ 79.42 года)', value: '-8%' },
  ]},
];

const SOURCES = [
  'Бюро национальной статистики Республики Казахстан — Таблицы смертности населения',
  'Закон РК «О страховой деятельности» — Нормативы актуарных расчётов',
  'Актуарная математика — Н.Л. Бауэрс и др., 2001',
  'World Health Organization — Life Tables for Kazakhstan',
  'Национальный банк РК — Нормативные акты по страхованию жизни',
  'OpenAI GPT-4o mini — Модель для анализа и корректировки рисков',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              О методологии <span className="gradient-text">LifeGuard KZ</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Научная основа платформы оценки рисков страхования жизни
            </p>
          </motion.div>

          {/* Section 1: Scientific base */}
          <motion.section variants={fadeInUp} transition={{ duration: 0.5 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Научная база</h2>
            </div>
            <div className="glass-card p-6 space-y-6">
              <p className="text-slate-300 leading-relaxed">
                Платформа использует классические актуарные формулы для расчёта страховых премий.
                Все расчёты основаны на коммутационных числах и таблицах смертности.
              </p>

              {/* Formulas */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Ключевые формулы</h3>
                {[
                  { name: 'Коммутационные числа', formula: 'Dₓ = lₓ · v^x,  где v = 1/(1+i),  i = 5%' },
                  { name: 'Страхование на дожитие', formula: 'ₙEₓ = D(x+n) / Dₓ' },
                  { name: 'Срочное страхование', formula: 'ₙAₓ = (Mₓ - M(x+n)) / (Dₓ · v)' },
                  { name: 'Срочная рента', formula: 'ₙ|ä\'ₓ = (Nₓ - N(x+n)) / Dₓ' },
                  { name: 'Брутто-тариф', formula: 'Тб = (nE + α + (γ + δ) · ä) / (1 - β)' },
                ].map((f, i) => (
                  <div key={i} className="bg-[#0F172A] rounded-xl p-4 border border-slate-700/50">
                    <p className="text-slate-400 text-xs mb-1">{f.name}</p>
                    <p className="text-emerald-400 font-mono text-sm">{f.formula}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0F172A] rounded-xl p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs mb-1">Параметры брутто-тарифа</p>
                <p className="text-slate-300 text-sm font-mono">
                  α = 0.05 (единовременные расходы) · β = 0.04 (сбор взносов) · γ = 0.02 (управление) · δ = 0.03 (прибыль)
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Data */}
          <motion.section variants={fadeInUp} transition={{ duration: 0.5 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Данные</h2>
            </div>
            <div className="glass-card p-6">
              <p className="text-slate-300 leading-relaxed mb-6">
                Используется таблица смертности населения Республики Казахстан
                (Бюро национальной статистики РК). Значение lₓ — число доживших
                до возраста x из 100 000 родившихся.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 py-2 px-3 font-medium">Возраст (x)</th>
                      <th className="text-right text-slate-400 py-2 px-3 font-medium">lₓ</th>
                      <th className="text-right text-slate-400 py-2 px-3 font-medium">dₓ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MORTALITY_TABLE.map((row, i) => (
                      <tr key={i} className={`border-b border-slate-700/50 ${i % 2 === 0 ? 'bg-slate-800/30' : ''}`}>
                        <td className="text-slate-300 py-2 px-3">{row.x}</td>
                        <td className="text-white text-right py-2 px-3 font-mono">{row.lx.toLocaleString('ru-RU')}</td>
                        <td className="text-slate-400 text-right py-2 px-3 font-mono">
                          {i < MORTALITY_TABLE.length - 1
                            ? (row.lx - MORTALITY_TABLE[i + 1].lx).toLocaleString('ru-RU')
                            : '2 100'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* Section 3: AI Model */}
          <motion.section variants={fadeInUp} transition={{ duration: 0.5 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">AI-модель</h2>
            </div>
            <div className="glass-card p-6 space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Платформа интегрирована с моделью <span className="text-emerald-400 font-semibold">GPT-4o mini</span> от OpenAI.
                Нейросеть выполняет роль актуария, который:
              </p>
              <ul className="space-y-3 text-slate-300">
                {[
                  'Интерполирует значения таблицы смертности для промежуточных возрастов',
                  'Рассчитывает коммутационные числа Dₓ, Nₓ, Mₓ',
                  'Применяет нужную формулу тарифа в зависимости от типа страхования',
                  'Определяет поправочные коэффициенты на основе индивидуальных факторов',
                  'Генерирует персональные рекомендации',
                  'Оценивает ожидаемую продолжительность жизни с учётом факторов',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-[#0F172A] rounded-xl p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs mb-1">Параметры модели</p>
                <p className="text-slate-300 text-sm">
                  Model: gpt-4o · Temperature: 0.1 · Response format: JSON · Промпт: ~2500 токенов
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 4: Risk Coefficients */}
          <motion.section variants={fadeInUp} transition={{ duration: 0.5 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Поправочные коэффициенты</h2>
            </div>
            <div className="space-y-6">
              {RISK_COEFFICIENTS.map((group, gi) => (
                <div key={gi} className="glass-card p-6">
                  <h3 className="text-white font-semibold mb-4">{group.category}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left text-slate-400 py-2 px-3 font-medium">Фактор</th>
                          <th className="text-right text-slate-400 py-2 px-3 font-medium">Поправка</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.factors.map((f, fi) => (
                          <tr key={fi} className="border-b border-slate-700/50">
                            <td className="text-slate-300 py-2 px-3">{f.name}</td>
                            <td className={`text-right py-2 px-3 font-medium font-mono ${
                              f.value.startsWith('+') ? 'text-red-400'
                              : f.value.startsWith('-') ? 'text-emerald-400'
                              : 'text-slate-400'
                            }`}>
                              {f.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section 5: Sources */}
          <motion.section variants={fadeInUp} transition={{ duration: 0.5 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Источники</h2>
            </div>
            <div className="glass-card p-6">
              <ol className="space-y-3">
                {SOURCES.map((source, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                    <span className="text-emerald-400 font-mono text-xs mt-0.5 flex-shrink-0">
                      [{i + 1}]
                    </span>
                    {source}
                  </li>
                ))}
              </ol>
            </div>
          </motion.section>

          {/* Algorithm steps */}
          <motion.section variants={fadeInUp} transition={{ duration: 0.5 }}>
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-4">Алгоритм расчёта (8 шагов)</h3>
              <div className="space-y-3">
                {[
                  'Получить данные клиента (возраст, пол, регион, здоровье, образ жизни)',
                  'Вычислить lₓ и l(x+n) из таблицы смертности (линейная интерполяция)',
                  'Рассчитать коммутационные числа: Dₓ, D(x+n), Nₓ, N(x+n), Mₓ',
                  'Применить формулу нетто-тарифа для выбранного типа страхования',
                  'Определить суммарный коэффициент K = 1 + Σ поправок',
                  'Скорректировать тариф и вычислить брутто-тариф',
                  'Рассчитать годовую, ежемесячную и единовременную премию',
                  'Определить уровень риска: K < 1.10 → Низкий, 1.10–1.25 → Средний, 1.25–1.45 → Высокий, ≥ 1.45 → Очень высокий',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 text-sm pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
