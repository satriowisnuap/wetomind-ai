'use client';

import { Calendar, Sparkles, MessageCircleHeart } from 'lucide-react';

const steps = [
    {
        num: 1,
        icon: <Calendar className="w-5 h-5" />,
        title: 'Input Tanggal Lahir',
        desc: 'Masukkan identitas dan tanggal lahir masehi Anda.',
    },
    {
        num: 2,
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Penentuan Neptu',
        desc: 'Algoritma kami menghitung weton dan neptu pasaran presisi.',
    },
    {
        num: 3,
        icon: <MessageCircleHeart className="w-5 h-5" />,
        title: 'Tanya Jawab AI',
        desc: 'AI menyintesis primbon untuk petunjuk praktis kehidupan.',
    },
];

export function TimelineSection() {
    return (
        <section className="mb-28">
            <span className="block text-center text-xs text-accent-gold font-bold uppercase tracking-[0.2em] mb-3">
                Proses Sederhana
            </span>
            <h3 className="text-center font-display text-3xl font-extrabold mb-3 text-text-primary">Alur Singkat</h3>
            <p className="text-center text-text-secondary text-sm max-w-xl mx-auto mb-16">
                Langkah sederhana menyinkronkan data kelahiran Anda dengan kecerdasan buatan.
            </p>

            <div className="relative max-w-4xl mx-auto px-4">
                {/* Connecting line with glow + animated dot flow */}
                <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent blur-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative z-10">
                    {steps.map((s, i) => (
                        <div key={s.num} className="group relative flex flex-col items-center text-center">
                            {/* Number badge with gradient ring + glow */}
                            <div className="relative mb-5">
                                <div className="absolute inset-0 rounded-2xl bg-accent-gold/25 blur-xl scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-bg-secondary to-bg-primary border border-accent-gold/30 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:border-accent-gold/60 group-hover:-translate-y-1">
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-gold/10 to-transparent" />
                                    <span className="relative text-accent-gold">{s.icon}</span>
                                </div>
                                {/* Step number chip */}
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-accent-gold to-accent-amber flex items-center justify-center text-[10px] font-black text-[#0a0400] shadow-md border-2 border-bg-primary">
                                    {s.num}
                                </div>
                            </div>

                            <h4 className="font-display font-bold text-base mb-2 text-text-primary tracking-tight">
                                {s.title}
                            </h4>
                            <p className="text-xs text-text-secondary max-w-[210px] leading-relaxed">{s.desc}</p>

                            {/* Mobile connector */}
                            {i < steps.length - 1 && (
                                <div className="md:hidden w-px h-8 bg-gradient-to-b from-accent-gold/40 to-transparent mt-6" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
