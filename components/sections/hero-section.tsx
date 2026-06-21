'use client';

import type { WetonResult } from '@/lib/javaCalendar';
import clsx from 'clsx';
import Image from 'next/image';
import { WetonCalculator } from './weton-calculator';

interface HeroSectionProps {
    calcName: string;
    setCalcName: (v: string) => void;
    calcBirthdate: string;
    setCalcBirthdate: (v: string) => void;
    calcResult: WetonResult | null;
    showResultCard: boolean;
    onCalculate: (e: React.FormEvent) => void;
    onConsult: () => void;
    onReset: () => void;
    isChatOpen?: boolean;
}

export function HeroSection(props: HeroSectionProps) {
    const { isChatOpen, ...calculatorProps } = props;

    return (
        <main
            className={clsx(
                "grid gap-8 lg:gap-12 items-center py-6 lg:py-10 mb-12",
                isChatOpen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
            )}
        >
            {/* Hero Text & Calculator */}
            <div
                className={clsx(
                    "flex flex-col items-center lg:items-start text-center lg:text-left fade-in-up",
                    isChatOpen ? "col-span-1" : "lg:col-span-7"
                )}
                style={{ animationDelay: '0.1s' }}
            >
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black leading-[1.15] mb-4 text-text-primary text-center lg:text-left">
                    Menguak Jati Diri Lewat <br className="hidden lg:inline" />
                    <span className="text-shimmer">Kebijaksanaan Weton & AI</span>
                </h2>

                <p className="text-sm md:text-base text-text-secondary max-w-xl mb-6 leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                    Pahami vibrasi energi alam semesta saat Anda dilahirkan. Temukan watak asli, arah karir prospektif,
                    dan kompas asmara Anda melalui rumus Primbon klasik yang diperdalam kecerdasan buatan.
                </p>

                <div className="w-full flex justify-center lg:justify-start">
                    <WetonCalculator {...calculatorProps} />
                </div>
            </div>

            {/* Interactive Wayang & Sacred Geometry Astrolabe */}
            <div
                className={clsx(
                    "flex justify-center items-center relative w-full",
                    isChatOpen
                        ? "col-span-1 h-[320px] mt-6"
                        : "lg:col-span-5 h-[380px] lg:h-[480px]"
                )}
            >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className={clsx(
                            "rounded-full border border-accent-gold/10 animate-spin-slow",
                            isChatOpen ? "w-[240px] h-[240px]" : "w-[300px] h-[300px] md:w-[380px] md:h-[380px]"
                        )}
                    ></div>
                    <div
                        className={clsx(
                            "absolute rounded-full border border-dashed border-accent-gold/15 animate-spin-reverse-slow",
                            isChatOpen ? "w-[200px] h-[200px]" : "w-[240px] h-[240px] md:w-[300px] md:h-[300px]"
                        )}
                    ></div>
                    <div
                        className={clsx(
                            "absolute rounded-full border border-accent-gold/5",
                            isChatOpen ? "w-[140px] h-[140px]" : "w-[180px] h-[180px] md:w-[220px] md:h-[220px]"
                        )}
                    ></div>
                </div>

                <div
                    className={clsx(
                        'relative',
                        isChatOpen ? 'w-[220px] h-[280px]' : 'w-[280px] h-[340px] md:w-[320px] md:h-[400px]',
                        'rounded-t-[120px]',
                        'rounded-b-[40px]',
                        'overflow-hidden',
                        'border',
                        'border-accent-gold/30',
                        'shadow-[0_0_50px_rgba(212,175,55,0.15)]',
                        'bg-bg-secondary/40',
                        'backdrop-blur-md',
                        'float',
                        'z-10',
                        'flex',
                        'items-center',
                        'justify-center',
                        'p-4',
                    )}
                >
                    <Image
                        src="/wayang-hero.png"
                        alt="Gunungan Wayang Emas"
                        fill
                        priority
                        style={{
                            borderRadius: '160px 160px 40px 40px',
                        }}
                        className={clsx(
                            'object-cover',
                            'opacity-90',
                            'p-4',
                            'transition-transform',
                            'duration-700',
                            'hover:scale-105',
                        )}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-transparent"></div>

                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card border border-accent-gold/20 flex items-center justify-between">
                        <div>
                            {/* <span className="text-[9px] uppercase tracking-widest text-accent-gold font-bold">
                                Karakter Utama
                            </span> */}
                            <span className="block text-xs font-bold text-text-primary mt-0.5">
                                Memayu Hayuning Bawana
                            </span>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-gold animate-ping"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
