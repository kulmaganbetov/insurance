'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import StepOne from '@/components/calculator/StepOne';
import StepTwo from '@/components/calculator/StepTwo';
import StepThree from '@/components/calculator/StepThree';
import StepFour from '@/components/calculator/StepFour';
import { LOADING_MESSAGES } from '@/lib/constants';

const schema = z.object({
  name: z.string().optional(),
  age: z.number().min(18).max(75),
  gender: z.string().min(1, 'Выберите пол'),
  region: z.string().min(1, 'Выберите регион'),
  height: z.number().min(100, 'Мин. 100 см').max(250, 'Макс. 250 см'),
  weight: z.number().min(30, 'Мин. 30 кг').max(300, 'Макс. 300 кг'),
  diseases: z.array(z.string()).default([]),
  systolic: z.number().min(60).max(250).optional().or(z.nan()),
  diastolic: z.number().min(40).max(160).optional().or(z.nan()),
  smoking: z.string().min(1, 'Выберите вариант'),
  alcohol: z.string().min(1, 'Выберите вариант'),
  activity: z.string().min(1, 'Выберите вариант'),
  heredity: z.array(z.string()).default([]),
  insuranceType: z.string().min(1, 'Выберите тип страхования'),
  term: z.number().min(5).max(40),
  insuranceSum: z.number().min(1000000).max(50000000),
  goal: z.string().min(1, 'Выберите цель'),
});

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { title: 'Личные данные', fields: ['age', 'gender', 'region', 'height', 'weight'] },
  { title: 'Здоровье', fields: ['diseases', 'systolic', 'diastolic'] },
  { title: 'Образ жизни', fields: ['smoking', 'alcohol', 'activity', 'heredity'] },
  { title: 'Страхование', fields: ['insuranceType', 'term', 'insuranceSum', 'goal'] },
];

export default function CalculatorPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      age: 30,
      gender: '',
      region: '',
      height: undefined as unknown as number,
      weight: undefined as unknown as number,
      diseases: [],
      systolic: undefined as unknown as number,
      diastolic: undefined as unknown as number,
      smoking: '',
      alcohol: '',
      activity: '',
      heredity: [],
      insuranceType: '',
      term: 20,
      insuranceSum: 5000000,
      goal: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const nextStep = async () => {
    const fields = STEPS[step].fields as Array<keyof FormValues>;
    const valid = await methods.trigger(fields);
    if (valid && step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setLoadingMsgIndex(0);

    const bmiVal = data.height && data.weight
      ? data.weight / Math.pow(data.height / 100, 2)
      : null;

    const payload = {
      ...data,
      bmi: bmiVal ? Number(bmiVal.toFixed(1)) : null,
      bmiCategory: bmiVal
        ? bmiVal < 18.5 ? 'Недостаточная масса'
          : bmiVal < 25 ? 'Норма'
          : bmiVal < 30 ? 'Избыточный вес'
          : bmiVal < 35 ? 'Ожирение I степени'
          : 'Ожирение II+ степени'
        : null,
      bloodPressure: data.systolic && data.diastolic
        ? `${data.systolic}/${data.diastolic}`
        : 'Не указано',
    };

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Ошибка расчёта');

      const result = await res.json();

      // Normalize result for display
      const displayData = {
        risk_score: result.risk_calculation?.risk_score ?? 50,
        risk_level: result.risk_calculation?.risk_level ?? 'Средний',
        annual_premium: result.premium?.annual_premium_tenge ?? 0,
        monthly_premium: result.premium?.monthly_premium_tenge ?? 0,
        one_time_premium: result.premium?.one_time_premium_tenge ?? 0,
        traditional_premium: result.premium?.annual_premium_tenge
          ? Math.round(result.premium.annual_premium_tenge / (result.risk_calculation?.total_adjustment_coefficient ?? 1))
          : 0,
        ai_adjusted_premium: result.premium?.annual_premium_tenge ?? 0,
        life_expectancy: {
          personal_estimate: result.life_expectancy_estimate?.personal_adjusted ?? 70,
          gender_average: result.life_expectancy_estimate?.gender_adjusted ?? 75,
          country_average: result.life_expectancy_estimate?.base_kazakhstan ?? 75.44,
        },
        recommendations: result.recommendations ?? [],
        risk_factors: (result.risk_factors ?? []).map((f: { factor: string; adjustment: string | number }) => ({
          factor: f.factor,
          adjustment: typeof f.adjustment === 'string'
            ? parseFloat(f.adjustment.replace(/[^-\d.]/g, '')) || 0
            : f.adjustment,
        })),
        actuarial: {
          lx: result.actuarial_calculation?.lx ?? 0,
          lx_n: result.actuarial_calculation?.lx_n ?? 0,
          Dx: result.actuarial_calculation?.Dx ?? 0,
          Dx_n: result.actuarial_calculation?.Dx_n ?? 0,
          Nx: result.actuarial_calculation?.Nx ?? 0,
          Mx: result.actuarial_calculation?.Mx ?? 0,
          base_net_tariff: result.actuarial_calculation?.base_net_tariff ?? 0,
        },
        comparison_traditional: result.comparison_traditional ?? null,
        full_result: result,
      };

      sessionStorage.setItem('insuranceResult', JSON.stringify(displayData));
      router.push('/result');
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Произошла ошибка при расчёте. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Калькулятор страхования
          </h1>
          <p className="text-slate-400">Заполните анкету для персонального расчёта</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    i < step
                      ? 'bg-emerald-500 text-white'
                      : i === step
                      ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500'
                      : 'bg-slate-700 text-slate-500'
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 md:w-24 h-0.5 mx-2 transition-colors ${
                      i < step ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-slate-400">
              Шаг {step + 1} из {STEPS.length}: {STEPS[step].title}
            </span>
          </div>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="glass-card p-6 md:p-8">
              <AnimatePresence mode="wait">
                {step === 0 && <StepOne key="step1" />}
                {step === 1 && <StepTwo key="step2" />}
                {step === 2 && <StepThree key="step3" />}
                {step === 3 && <StepFour key="step4" />}
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 0}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-white rounded-xl transition-all text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-all text-sm font-medium"
                >
                  Далее
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:opacity-60 text-white rounded-xl transition-all text-sm font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Рассчитываем...
                    </>
                  ) : (
                    <>
                      Рассчитать
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </FormProvider>

        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white text-lg font-medium"
                  >
                    {LOADING_MESSAGES[loadingMsgIndex]}
                  </motion.p>
                </AnimatePresence>
                <p className="text-slate-500 text-sm mt-2">Обычно это занимает 5–10 секунд</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
