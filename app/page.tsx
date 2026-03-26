'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  Brain,
  Calculator,
  Users,
  Building2,
  ArrowRight,
  Clock,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Zap,
  BarChart3,
  FileText,
  ChevronRight,
} from 'lucide-react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white">
      {count.toLocaleString('ru-RU')}{suffix}
    </div>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Particles background */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle animate-float-particle"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 20}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 15}s`,
            }}
          />
        ))}
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                AI-powered Insurance Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Умная оценка рисков{' '}
              <span className="gradient-text">страхования жизни</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Первая AI-платформа в Казахстане, использующая актуарные формулы и
              нейросеть для персонального расчёта страховой премии
            </motion.p>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/calculator"
                className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                <Calculator className="w-5 h-5" />
                Рассчитать бесплатно
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 px-8 py-4 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all"
              >
                Смотреть демо
              </Link>
            </motion.div>
          </motion.div>

          {/* Counters */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-3 gap-6 mt-20 max-w-2xl mx-auto"
          >
            {[
              { target: 10000, suffix: '+', label: 'Расчётов' },
              { target: 98, suffix: '%', label: 'Точность' },
              { target: 24, suffix: '', label: 'Региона КЗ' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <AnimatedCounter target={item.target} suffix={item.suffix} />
                <p className="text-slate-500 text-sm mt-1">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ PROBLEM ═══════ */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Проблемы традиционного страхования
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Казахстанский рынок страхования жизни сталкивается с серьёзными вызовами
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingDown,
                  title: 'Одинаковые тарифы для всех',
                  desc: 'Здоровый человек платит столько же, сколько курящий диабетик. Нет персонализации.',
                  color: 'text-red-400',
                  bg: 'bg-red-500/10',
                },
                {
                  icon: Clock,
                  title: 'Долгий андеррайтинг',
                  desc: 'Андеррайтинг занимает 3–5 дней. За это время клиент уходит к конкурентам.',
                  color: 'text-orange-400',
                  bg: 'bg-orange-500/10',
                },
                {
                  icon: AlertTriangle,
                  title: '15–20% убытков',
                  desc: 'Неточная оценка рисков приводит к убыткам в 15–20% страхового портфеля.',
                  color: 'text-yellow-400',
                  bg: 'bg-yellow-500/10',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                  className="glass-card-hover p-6"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ SOLUTION / HOW IT WORKS ═══════ */}
      <section className="py-20 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Как работает <span className="gradient-text">LifeGuard KZ</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                От анкеты до персонального тарифа за 2 минуты
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: FileText, step: '01', title: 'Анкета', desc: 'Заполните анкету за 2 минуты', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { icon: Brain, step: '02', title: 'AI-анализ', desc: 'GPT-4o mini анализирует факторы', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: Calculator, step: '03', title: 'Актуарный расчёт', desc: 'Формулы и таблицы КЗ', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { icon: Shield, step: '04', title: 'Персональный тариф', desc: 'Индивидуальная премия', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                  className="relative glass-card p-6 text-center"
                >
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 z-20">
                      <ChevronRight className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <div className="text-xs text-slate-500 font-mono mb-2">ШАГ {item.step}</div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Comparison table */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="glass-card overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-white text-lg font-semibold">Сравнение подходов</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 py-4 px-6 font-medium">Параметр</th>
                      <th className="text-center text-slate-400 py-4 px-6 font-medium">Традиционный</th>
                      <th className="text-center text-emerald-400 py-4 px-6 font-medium">LifeGuard AI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Время расчёта', '3–5 дней', '2 минуты'],
                      ['Персонализация', 'Нет', 'Полная'],
                      ['Учёт факторов', '3–5 параметров', '15+ параметров'],
                      ['Точность', '~80%', '~98%'],
                      ['Стоимость', 'Дорого', 'Бесплатно'],
                    ].map(([param, trad, ai], i) => (
                      <tr key={i} className="border-b border-slate-700/50">
                        <td className="text-slate-300 py-3 px-6">{param}</td>
                        <td className="text-center text-slate-500 py-3 px-6">{trad}</td>
                        <td className="text-center py-3 px-6">
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            {ai}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ DEMO RESULT ═══════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Пример результата
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Так выглядит персональный отчёт после AI-анализа
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="glass-card p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Mock gauge */}
                  <div className="flex flex-col items-center">
                    <svg viewBox="0 0 200 120" className="w-48">
                      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
                      <path d="M 20 100 A 80 80 0 0 1 60 35" fill="none" stroke="#10B981" strokeWidth="16" strokeLinecap="round" />
                      <path d="M 60 35 A 80 80 0 0 1 100 20" fill="none" stroke="#F59E0B" strokeWidth="16" strokeLinecap="butt" />
                      <path d="M 100 20 A 80 80 0 0 1 140 35" fill="none" stroke="#F97316" strokeWidth="16" strokeLinecap="butt" />
                      <text x="100" y="80" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">27</text>
                      <text x="100" y="100" textAnchor="middle" fill="#94A3B8" fontSize="11">Высокий риск</text>
                    </svg>
                  </div>
                  {/* Mock premium */}
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold">Страховая премия</h4>
                    <div className="border border-emerald-500/30 rounded-xl p-3 bg-emerald-500/5">
                      <p className="text-slate-400 text-xs">Годовая</p>
                      <p className="text-emerald-400 text-2xl font-bold">180 630 ₸</p>
                    </div>
                    <div className="border border-slate-600/50 rounded-xl p-3">
                      <p className="text-slate-400 text-xs">Ежемесячная</p>
                      <p className="text-white text-lg font-semibold">15 052 ₸</p>
                    </div>
                  </div>
                  {/* Mock recommendations */}
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold">Рекомендации</h4>
                    {['Смешанное страхование на 20 лет', 'Страхование от критических заболеваний', 'Отказ от курения снизит тариф на ~8%'].map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-400">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FOR WHO ═══════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Для кого</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Users,
                  title: 'Физические лица',
                  desc: 'Узнайте свой страховой риск и оптимальную премию за 2 минуты. Бесплатно и анонимно.',
                  features: ['Персональный расчёт', 'PDF отчёт', 'Рекомендации'],
                  color: 'emerald',
                },
                {
                  icon: Building2,
                  title: 'Страховые компании',
                  desc: 'API-интеграция для автоматизации андеррайтинга и снижения убытков.',
                  features: ['API доступ', 'Аналитика', 'Массовый расчёт'],
                  color: 'blue',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                  className="glass-card-hover p-8"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-4`}>
                    <item.icon className={`w-7 h-7 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((f, j) => (
                      <span
                        key={j}
                        className={`text-xs px-3 py-1 rounded-full bg-${item.color}-500/10 text-${item.color}-400 border border-${item.color}-500/20`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TECH ═══════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Технологии</h2>
              <p className="text-slate-400">Надёжный стек для точных расчётов</p>
            </motion.div>

            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: 'GPT-4o mini', icon: Brain },
                  { label: 'Next.js 14', icon: Zap },
                  { label: 'Vercel', icon: Shield },
                  { label: 'Актуарные формулы', icon: Calculator },
                  { label: 'Бюро нацстатистики РК', icon: BarChart3 },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E293B] border border-slate-700 hover:border-emerald-500/30 transition-colors"
                  >
                    <tech.icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm font-medium">{tech.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Готовы узнать свой страховой риск?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Бесплатный расчёт за 2 минуты. Без регистрации и обязательств.
              </p>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
              >
                <Calculator className="w-5 h-5" />
                Начать расчёт
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
