import React from 'react';
import { motion } from 'motion/react';

export function TypingIndicator() {
  return (
    <div className="flex justify-start w-full mb-4">
      <div className=" bg-white/5 dark:bg-[#1a0a00]/80 border border-[#c9a227]/20 px-4 py-4 rounded-2xl rounded-tl-sm flex items-center gap-3">
        <span className="text-sm text-[#a89070]">Sedang merenung</span>
        <div className="flex gap-1">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#c9a227]"
            animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#c9a227]"
            animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#c9a227]"
            animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </div>
      </div>
    </div>
  );
}
