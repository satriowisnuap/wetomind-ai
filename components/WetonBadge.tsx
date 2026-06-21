import React from 'react';
import { Sparkles } from 'lucide-react';
import { WetonData } from '@/types';

interface WetonBadgeProps {
  weton: WetonData;
}

export function WetonBadge({ weton }: WetonBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm font-medium">
      <Sparkles className="w-4 h-4 text-amber-500" />
      <span>
        Weton Anda: {weton.hariJawa} {weton.pasaran} (Neptu {weton.totalNeptu})
      </span>
    </div>
  );
}
