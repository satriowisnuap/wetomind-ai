'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import type { WetonResult } from '@/lib/javaCalendar';

interface WetonResultCardProps {
    calcName: string;
    calcResult: WetonResult;
    onConsult: () => void;
    onReset: () => void;
}

export function WetonResultCard({ calcName, calcResult, onConsult, onReset }: WetonResultCardProps) {
    return (
        <motion.div
            key="result-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-4 rounded-3xl border-2 border-accent-gold/40 shadow-xl bg-gradient-to-br from-bg-secondary/80 to-bg-primary/95"
        >
            <div className="flex justify-between items-center mb-3">
                <div>
                    <span className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">
                        Hasil Perhitungan Weton
                    </span>
                    <h3 className="font-display font-extrabold text-2xl text-text-primary mt-0.5">
                        {calcResult.hariJawa} {calcResult.pasaran}
                    </h3>
                </div>
                <div className="w-14 h-14 rounded-full bg-accent-gold/10 border-2 border-accent-gold/30 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] text-text-secondary uppercase font-bold leading-none">Neptu</span>
                    <span className="font-display font-black text-xl text-accent-gold">{calcResult.totalNeptu}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 my-3 border-y border-accent-gold/10 text-sm">
                <div className="bg-bg-primary/30 p-2.5 rounded-xl border border-accent-gold/5">
                    <span className="text-[10px] text-text-secondary block mb-0.5">Vibrasi Hari</span>
                    <span className="font-bold text-text-primary text-xs">
                        {calcResult.hariJawa} ({calcResult.neptuHari})
                    </span>
                </div>
                <div className="bg-bg-primary/30 p-2.5 rounded-xl border border-accent-gold/5">
                    <span className="text-[10px] text-text-secondary block mb-0.5">Siklus Pasaran</span>
                    <span className="font-bold text-text-primary text-xs">
                        {calcResult.pasaran} ({calcResult.neptuPasaran})
                    </span>
                </div>
            </div>

            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                Halo <strong className="text-text-primary">{calcName}</strong>, weton Anda mencerminkan karakter unik di
                bawah naungan energi kosmik Jawa. Mulailah dialog interaktif untuk memahami analisis karir, asmara, dan
                nasib Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    onClick={onConsult}
                    className="flex-1 py-3 px-4 rounded-xl bg-accent-amber hover:bg-accent-amber/95 text-white font-extrabold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Sparkles className="w-4 h-4" /> KONSULTASI DETAIL DENGAN AI
                </button>
                <button
                    onClick={onReset}
                    className="py-3 px-5 rounded-xl border border-accent-gold/30 hover:bg-accent-gold/5 text-text-secondary font-bold text-xs tracking-wider transition-all cursor-pointer"
                >
                    KEMBALI
                </button>
            </div>
        </motion.div>
    );
}
