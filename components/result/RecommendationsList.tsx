'use client';

import { motion } from 'framer-motion';
import { Pill, Activity, ClipboardList } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: string[];
}

const icons = [Pill, Activity, ClipboardList];
const iconColors = ['text-emerald-400', 'text-blue-400', 'text-yellow-400'];
const bgColors = [
  'bg-emerald-500/10',
  'bg-blue-500/10',
  'bg-yellow-500/10',
];

export default function RecommendationsList({
  recommendations,
}: RecommendationsListProps) {
  return (
    <div className="bg-[#1E293B] rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Рекомендации</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map((rec, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4, ease: 'easeOut' }}
              className={`${bgColors[i % bgColors.length]} border border-slate-700/50 rounded-xl p-4`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${bgColors[i % bgColors.length]} flex items-center justify-center mb-3`}
              >
                <Icon className={`w-5 h-5 ${iconColors[i % iconColors.length]}`} />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
