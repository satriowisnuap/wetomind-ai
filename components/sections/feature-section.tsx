'use client';

import { Shield, Sparkles, BookOpen, Clock, Heart, Gem } from 'lucide-react';

const features = [
    {
        icon: <Shield className="w-5 h-5 text-accent-gold" />,
        title: 'Privasi Terjamin',
        desc: 'Data Anda sepenuhnya aman. Seluruh riwayat konsultasi bersifat sementara dan langsung terhapus.',
    },
    {
        icon: <Sparkles className="w-5 h-5 text-accent-gold" />,
        title: 'Analisis Hibrida',
        desc: 'Sintesis rumusan kalender Jawa legendaris dengan kecerdasan buatan modern untuk keakuratan tinggi.',
    },
    {
        icon: <BookOpen className="w-5 h-5 text-accent-gold" />,
        title: 'Buku Primbon Otentik',
        desc: 'Tafsiran bersandar pada literatur klasik primbon serta siklus horoskop Jawa asli.',
    },
    {
        icon: <Clock className="w-5 h-5 text-accent-gold" />,
        title: 'Konsultasi Instan',
        desc: 'Dapatkan jawaban real-time untuk memandu langkah strategis hidup Anda saat ini.',
    },
    {
        icon: <Heart className="w-5 h-5 text-accent-gold" />,
        title: 'Perspektif Empatik',
        desc: 'Arahan yang disajikan bersifat membangun, positif, membimbing tanpa menghakimi.',
    },
    {
        icon: <Gem className="w-5 h-5 text-accent-gold" />,
        title: 'Wawasan Mendalam',
        desc: 'Setiap hasil dilengkapi konteks filosofis, bukan sekadar angka, agar maknanya benar-benar dipahami.',
    },
];

export function FeaturesSection() {
    return (
        <section className="mb-28 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-center font-display text-3xl font-extrabold mb-3 text-text-primary">
                Harmonisasi Tradisi & Teknologi
            </h3>
            <p className="text-center text-text-secondary text-sm max-w-xl mx-auto mb-12">
                Mengapa WetoMind AI menjadi partner terbaik untuk menyelami peta energi kehidupan Anda.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="group relative p-6 rounded-2xl flex flex-col items-start overflow-hidden bg-bg-secondary/70 backdrop-blur-xl border border-accent-gold/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-gold/40 hover:shadow-[0_12px_40px_rgba(212,175,55,0.15)]"
                    >
                        {/* Subtle gradient sheen overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-gold/[0.06] via-transparent to-transparent" />

                        {/* Top accent line that glows on hover */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold/0 to-transparent group-hover:via-accent-gold/70 transition-all duration-500" />

                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 flex items-center justify-center mb-5 border border-accent-gold/25 shadow-inner transition-transform duration-300 group-hover:scale-110">
                            {f.icon}
                        </div>

                        <h4 className="relative font-display font-extrabold text-base mb-2 text-text-primary tracking-tight">
                            {f.title}
                        </h4>
                        <p className="relative text-sm text-text-secondary leading-relaxed">{f.desc}</p>

                        {/* Bottom-right faint glow accent */}
                        <div className="pointer-events-none absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-accent-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                ))}
            </div>
        </section>
    );
}
