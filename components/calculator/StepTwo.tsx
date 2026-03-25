'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Droplets,
  Heart,
  Activity,
  Ribbon,
  Wind,
  CircleDot,
} from 'lucide-react';

const DISEASES = [
  { id: 'hypertension', label: 'Гипертония', icon: HeartPulse },
  { id: 'diabetes', label: 'Сахарный диабет 2 типа', icon: Droplets },
  { id: 'cardiovascular', label: 'Сердечно-сосудистые заболевания', icon: Heart },
  { id: 'heart_attack_stroke', label: 'Перенесённый инфаркт или инсульт', icon: Activity },
  { id: 'oncology', label: 'Онкология в анамнезе', icon: Ribbon },
  { id: 'chronic_lung', label: 'Хронические болезни лёгких', icon: Wind },
  { id: 'chronic_kidney', label: 'Хроническая почечная недостаточность', icon: CircleDot },
] as const;

export default function StepTwo() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const diseases: string[] = watch('diseases') ?? [];

  const toggleDisease = (id: string) => {
    const current = [...diseases];
    const idx = current.indexOf(id);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(id);
    }
    setValue('diseases', current, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Diseases */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Хронические заболевания
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DISEASES.map((d) => {
            const Icon = d.icon;
            const selected = diseases.includes(d.id);
            return (
              <motion.button
                key={d.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleDisease(d.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selected
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-gray-700 bg-[#1E293B] hover:border-gray-600'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    selected ? 'bg-emerald-500/20' : 'bg-gray-700/50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      selected ? 'text-emerald-400' : 'text-gray-400'
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    selected ? 'text-emerald-300' : 'text-gray-300'
                  }`}
                >
                  {d.label}
                </span>
                <div className="ml-auto flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      selected
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-600'
                    }`}
                  >
                    {selected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Blood pressure */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Артериальное давление (мм рт.ст.)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Систолическое (верхнее)</label>
            <input
              type="number"
              placeholder="120"
              {...register('systolic', { valueAsNumber: true })}
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {errors.systolic && (
              <p className="text-red-400 text-xs mt-1">{errors.systolic.message as string}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Диастолическое (нижнее)</label>
            <input
              type="number"
              placeholder="80"
              {...register('diastolic', { valueAsNumber: true })}
              className="w-full bg-[#1E293B] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {errors.diastolic && (
              <p className="text-red-400 text-xs mt-1">{errors.diastolic.message as string}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
