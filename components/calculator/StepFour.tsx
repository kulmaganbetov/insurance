'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Shield, Clock, Banknote, Target } from 'lucide-react';
import { INSURANCE_TYPES } from '@/lib/constants';

const GOAL_OPTIONS = [
  { value: 'savings', label: 'Жинақтау' },
  { value: 'family_protection', label: 'Отбасын қорғау' },
  { value: 'pension', label: 'Зейнетақы' },
] as const;

function formatTenge(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₸';
}

function formatUsd(tenge: number): string {
  const usd = Math.round(tenge / 450);
  return '~$' + new Intl.NumberFormat('en-US').format(usd);
}

export default function StepFour() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const insuranceType = watch('insuranceType');
  const term = watch('term') ?? 20;
  const insuranceSum = watch('insuranceSum') ?? 5000000;
  const goal = watch('goal');

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Insurance Type */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-4">
          <Shield className="w-4 h-4 text-emerald-400" />
          Сақтандыру түрі
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INSURANCE_TYPES.map((type) => (
            <motion.button
              key={type.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setValue('insuranceType', type.value, { shouldValidate: true })}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                insuranceType === type.value
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-gray-700 bg-[#1E293B] hover:border-gray-600'
              }`}
            >
              <span
                className={`block text-sm font-semibold mb-1 ${
                  insuranceType === type.value ? 'text-emerald-300' : 'text-gray-200'
                }`}
              >
                {type.label}
              </span>
              <span className="block text-xs text-gray-500">{type.description}</span>
            </motion.button>
          ))}
        </div>
        {errors.insuranceType && (
          <p className="text-red-400 text-sm mt-1">{errors.insuranceType.message as string}</p>
        )}
      </div>

      {/* Term slider */}
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-3">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Сақтандыру мерзімі
          </span>
          <span className="text-2xl font-bold text-emerald-400">{term} жыл</span>
        </label>
        <input
          type="range"
          min={5}
          max={40}
          step={1}
          value={term}
          onChange={(e) => setValue('term', Number(e.target.value), { shouldValidate: true })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5 жыл</span>
          <span>40 жыл</span>
        </div>
        {errors.term && (
          <p className="text-red-400 text-sm mt-1">{errors.term.message as string}</p>
        )}
      </div>

      {/* Insurance sum slider */}
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-1">
          <span className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-400" />
            Сақтандыру сомасы
          </span>
        </label>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-2xl font-bold text-emerald-400">{formatTenge(insuranceSum)}</span>
          <span className="text-sm text-gray-500">{formatUsd(insuranceSum)}</span>
        </div>
        <input
          type="range"
          min={1000000}
          max={50000000}
          step={500000}
          value={insuranceSum}
          onChange={(e) => setValue('insuranceSum', Number(e.target.value), { shouldValidate: true })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 000 000 ₸</span>
          <span>50 000 000 ₸</span>
        </div>
        {errors.insuranceSum && (
          <p className="text-red-400 text-sm mt-1">{errors.insuranceSum.message as string}</p>
        )}
      </div>

      {/* Goal */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
          <Target className="w-4 h-4 text-emerald-400" />
          Сақтандыру мақсаты
        </label>
        <div className="grid grid-cols-3 gap-3">
          {GOAL_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setValue('goal', opt.value, { shouldValidate: true })}
              className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                goal === opt.value
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : 'border-gray-700 bg-[#1E293B] text-gray-400 hover:border-gray-600'
              }`}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
        {errors.goal && (
          <p className="text-red-400 text-sm mt-1">{errors.goal.message as string}</p>
        )}
      </div>
    </motion.div>
  );
}
