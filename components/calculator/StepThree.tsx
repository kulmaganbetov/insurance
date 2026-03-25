'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Cigarette, Wine, Dumbbell, Dna } from 'lucide-react';

const SMOKING_OPTIONS = [
  { value: 'none', label: 'Не курю' },
  { value: 'moderate', label: 'Умеренно' },
  { value: 'active', label: 'Активно' },
  { value: 'quit_recent', label: 'Бросил < 5 лет' },
] as const;

const ALCOHOL_OPTIONS = [
  { value: 'none', label: 'Не употребляю' },
  { value: 'moderate', label: 'Умеренно' },
  { value: 'abuse', label: 'Злоупотребляю' },
] as const;

const ACTIVITY_OPTIONS = [
  { value: 'low', label: 'Низкая' },
  { value: 'medium', label: 'Средняя' },
  { value: 'high', label: 'Высокая' },
] as const;

const HEREDITY_OPTIONS = [
  { id: 'parent_cvd', label: 'Родитель умер от ССЗ до 60 лет' },
  { id: 'parent_oncology', label: 'Родитель умер от онкологии до 60 лет' },
  { id: 'parent_diabetes', label: 'Диабет у обоих родителей' },
] as const;

interface RadioCardGroupProps {
  name: string;
  options: readonly { value: string; label: string }[];
  icon: React.ReactNode;
  title: string;
}

function RadioCardGroup({ name, options, icon, title }: RadioCardGroupProps) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const current = watch(name);

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
        {icon}
        {title}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => (
          <motion.button
            key={opt.value}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setValue(name, opt.value, { shouldValidate: true })}
            className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
              current === opt.value
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                : 'border-gray-700 bg-[#1E293B] text-gray-400 hover:border-gray-600'
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
      {errors[name] && (
        <p className="text-red-400 text-sm mt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  );
}

export default function StepThree() {
  const { watch, setValue } = useFormContext();
  const heredity: string[] = watch('heredity') ?? [];

  const toggleHeredity = (id: string) => {
    const current = [...heredity];
    const idx = current.indexOf(id);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(id);
    }
    setValue('heredity', current, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <RadioCardGroup
        name="smoking"
        options={SMOKING_OPTIONS}
        icon={<Cigarette className="w-4 h-4 text-emerald-400" />}
        title="Курение"
      />

      <RadioCardGroup
        name="alcohol"
        options={ALCOHOL_OPTIONS}
        icon={<Wine className="w-4 h-4 text-emerald-400" />}
        title="Алкоголь"
      />

      <RadioCardGroup
        name="activity"
        options={ACTIVITY_OPTIONS}
        icon={<Dumbbell className="w-4 h-4 text-emerald-400" />}
        title="Физическая активность"
      />

      {/* Heredity */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
          <Dna className="w-4 h-4 text-emerald-400" />
          Наследственность
        </label>
        <div className="space-y-3">
          {HEREDITY_OPTIONS.map((opt) => {
            const selected = heredity.includes(opt.id);
            return (
              <motion.button
                key={opt.id}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleHeredity(opt.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selected
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-gray-700 bg-[#1E293B] hover:border-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
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
                <span
                  className={`text-sm font-medium ${
                    selected ? 'text-emerald-300' : 'text-gray-300'
                  }`}
                >
                  {opt.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
