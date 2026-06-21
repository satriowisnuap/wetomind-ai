import React from 'react';
import { FeatureType } from '@/types';
import { User, Briefcase, TrendingUp, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface FeatureSelectorProps {
  selectedFeature: FeatureType;
  onSelect: (feature: FeatureType) => void;
}

const features: { type: FeatureType; label: string; icon: React.ReactNode }[] = [
  { type: 'BEDAH_KARAKTER', label: 'Bedah Karakter', icon: <User className="w-4 h-4" /> },
  { type: 'KOMPAS_KARIR', label: 'Kompas Karir', icon: <Briefcase className="w-4 h-4" /> },
  { type: 'PETA_PERBAIKAN', label: 'Peta Perbaikan', icon: <TrendingUp className="w-4 h-4" /> },
  { type: 'UJI_JODOH', label: 'Uji Jodoh', icon: <Heart className="w-4 h-4" /> },
  { type: 'SINERGI_REKAN', label: 'Sinergi Rekan', icon: <Users className="w-4 h-4" /> },
];

export function FeatureSelector({ selectedFeature, onSelect }: FeatureSelectorProps) {
  return (
    <div className="flex overflow-x-auto hide-scrollbar sm:flex-wrap gap-2 pb-2 mb-4">
      {features.map((feat) => {
        const isSelected = selectedFeature === feat.type;
        return (
          <button
            key={feat.type}
            onClick={() => onSelect(feat.type)}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              isSelected
                ? 'text-[#fdf5e6]'
                : 'text-[#3d1f00] dark:text-[#a89070] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="pill"
                className="absolute inset-0 bg-[#cc6600] rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {feat.icon}
              {feat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
