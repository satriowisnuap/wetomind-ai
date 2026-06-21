'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export function PhilosophySection() {
    return (
        <section className="mb-28 relative">
            {/* Ambient glow backdrop */}
            <div className="absolute -inset-4 bg-accent-gold/10 rounded-[40px] blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-40 h-40 bg-accent-amber/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative bg-gradient-to-br from-bg-secondary/85 via-bg-secondary/70 to-bg-primary/80 backdrop-blur-xl border border-accent-gold/20 p-8 md:p-14 rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                {/* Decorative batik pattern overlay across whole card */}
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
                    <Image src="/batik-pattern.svg" alt="" fill className="object-cover" />
                </div>

                {/* Corner ornaments */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent-gold/40 rounded-tl-[32px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent-gold/40 rounded-br-[32px] pointer-events-none" />

                {/* Top accent line glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-accent-gold/60 to-transparent" />

                <div className="relative flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/25">
                            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                            <span className="text-[11px] text-accent-gold font-bold uppercase tracking-[0.15em]">
                                Filosofi Kosmologi Jawa
                            </span>
                        </div>

                        <h3 className="font-display text-2xl md:text-4xl font-extrabold mb-5 text-text-primary leading-tight">
                            Siklus Neptu &<br className="hidden md:block" /> Keselarasan Hidup
                        </h3>

                        <p className="text-sm md:text-[15px] text-text-secondary leading-relaxed mb-5 max-w-lg">
                            Dalam tradisi Jawa, setiap jiwa lahir ke bumi membawa bekal energi kosmis yang khas.
                            Dinamika 7 hari mingguan bersatu dengan 5 siklus pasaran membentuk frekuensi hidup (Neptu)
                            yang memengaruhi temperamen dasar kita.
                        </p>

                        <div className="relative pl-6 mt-6">
                            <span className="absolute left-0 top-0 text-4xl font-display text-accent-gold/40 leading-none">
                                &ldquo;
                            </span>
                            <p className="text-sm md:text-base text-text-primary leading-relaxed font-medium italic pl-3 border-l-2 border-accent-gold/50">
                                Memayu Hayuning Bawana &mdash; Tugas luhur setiap insan adalah mempercantik indahnya
                                jagat raya dengan menyelaraskan keunikan watak dirinya dengan harmoni alam semesta.
                            </p>
                        </div>
                    </div>

                    {/* Image panel with richer frame */}
                    <div className="relative w-full md:w-[280px] h-[200px] shrink-0">
                        <div className="absolute -inset-1.5 rounded-[22px] bg-gradient-to-br from-accent-gold/40 via-accent-gold/10 to-transparent" />
                        <div className="relative w-full h-full rounded-[20px] overflow-hidden border border-accent-gold/30 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
                            <Image src="/wayang-hero.png" alt="Kawung Semar" fill className="object-cover opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/95 via-bg-secondary/40 to-transparent" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <span className="font-display font-extrabold text-base text-text-primary tracking-wide">
                                    Kawung Semar
                                </span>
                                <div className="w-8 h-px bg-accent-gold/60 my-2" />
                                <p className="text-[11px] text-text-secondary leading-relaxed">
                                    Lambang kesucian hati dan harmoni vertikal dengan sang Pencipta.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
