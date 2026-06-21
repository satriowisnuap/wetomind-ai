'use client';

import { Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WetonResultCard } from './weton-result-card';
import type { WetonResult } from '@/lib/javaCalendar';

interface WetonCalculatorProps {
    calcName: string;
    setCalcName: (v: string) => void;
    calcBirthdate: string;
    setCalcBirthdate: (v: string) => void;
    calcResult: WetonResult | null;
    showResultCard: boolean;
    onCalculate: (e: React.FormEvent) => void;
    onConsult: () => void;
    onReset: () => void;
}

export function WetonCalculator({
    calcName,
    setCalcName,
    calcBirthdate,
    setCalcBirthdate,
    calcResult,
    showResultCard,
    onCalculate,
    onConsult,
    onReset,
}: WetonCalculatorProps) {
    return (
        <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
                {!showResultCard ? (
                    <motion.form
                        key="calculator-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={onCalculate}
                        className="glass-card p-6 rounded-3xl border border-accent-gold/15 shadow-xl space-y-4"
                    >
                        <h3 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-accent-gold" /> Kalkulator Weton Instan
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 tracking-wider">
                                    Nama Anda
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Budiman"
                                        value={calcName}
                                        onChange={(e) => setCalcName(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-bg-secondary/40 border border-accent-gold/10 focus:border-accent-gold/60 outline-none text-text-primary text-sm transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 tracking-wider">
                                    Tanggal Lahir
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={calcBirthdate}
                                    onChange={(e) => setCalcBirthdate(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-bg-secondary/40 border border-accent-gold/10 focus:border-accent-gold/60 outline-none text-text-primary text-sm transition-all"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-gold to-accent-amber text-[#0a0400] font-extrabold text-sm tracking-wider hover:opacity-95 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-accent-gold/20"
                        >
                            HITUNG WETON SEKARANG
                        </button>
                    </motion.form>
                ) : (
                    calcResult && (
                        <WetonResultCard
                            calcName={calcName}
                            calcResult={calcResult}
                            onConsult={onConsult}
                            onReset={onReset}
                        />
                    )
                )}
            </AnimatePresence>
        </div>
    );
}
