'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, MapPin, Ruler, Weight } from 'lucide-react';
import { REGIONS, BMI_CATEGORIES } from '@/lib/constants';
import { useMemo } from 'react';

export default function StepOne() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const age = watch('age') ?? 30;
  const gender = watch('gender');
  const height = watch('height');
  const weight = watch('weight');

  const bmi = useMemo(() => {
    if (height && weight && height > 0) {
      const h = Number(height) / 100;
      return Number(weight) / (h * h);
    }
    return null;
  }, [height, weight]);

  const bmiCategory = useMemo(() => {
    if (bmi === null) return null;
    return BMI_CATEGORIES.find((c) => bmi < c.max) ?? BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
  }, [bmi]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <User className="w-4 h-4 text-emerald-600" />
          Аты (міндетті емес)
        </label>
        <input
          {...register('name')}
          placeholder="Атыңызды енгізіңіз"
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
      </div>

      {/* Age slider */}
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-3">
          <span>Жасы</span>
          <span className="text-2xl font-bold text-emerald-600">{age} жас</span>
        </label>
        <input
          type="range"
          min={18}
          max={75}
          {...register('age', { valueAsNumber: true })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>18</span>
          <span>75</span>
        </div>
        {errors.age && (
          <p className="text-red-600 text-sm mt-1">{errors.age.message as string}</p>
        )}
      </div>

      {/* Gender toggle */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Жынысы</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'male', label: 'Ер', emoji: '♂' },
            { value: 'female', label: 'Әйел', emoji: '♀' },
          ].map((opt) => (
            <motion.button
              key={opt.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setValue('gender', opt.value, { shouldValidate: true })}
              className={`relative flex items-center justify-center gap-3 py-4 rounded-xl border-2 font-medium transition-all cursor-pointer ${
                gender === opt.value
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span>{opt.label}</span>
            </motion.button>
          ))}
        </div>
        {errors.gender && (
          <p className="text-red-600 text-sm mt-1">{errors.gender.message as string}</p>
        )}
      </div>

      {/* Region */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          Аймақ
        </label>
        <select
          {...register('region')}
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Аймақты таңдаңыз</option>
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {errors.region && (
          <p className="text-red-600 text-sm mt-1">{errors.region.message as string}</p>
        )}
      </div>

      {/* Height & Weight with BMI */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Бой және салмақ
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="number"
              placeholder="Бой, см"
              {...register('height', { valueAsNumber: true })}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {errors.height && (
              <p className="text-red-600 text-xs mt-1">{errors.height.message as string}</p>
            )}
          </div>
          <div className="relative">
            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="number"
              placeholder="Салмақ, кг"
              {...register('weight', { valueAsNumber: true })}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {errors.weight && (
              <p className="text-red-600 text-xs mt-1">{errors.weight.message as string}</p>
            )}
          </div>
        </div>

        {/* BMI display */}
        {bmi !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <span className="text-sm text-slate-600">Дене салмағының индексі (ДСИ)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{bmi.toFixed(1)}</span>
                {bmiCategory && (
                  <span className={`text-sm font-medium ${bmiCategory.color}`}>
                    {bmiCategory.label}
                  </span>
                )}
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center">
              <span className={`text-lg font-bold ${bmiCategory?.color ?? 'text-slate-900'}`}>
                {bmi.toFixed(0)}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
