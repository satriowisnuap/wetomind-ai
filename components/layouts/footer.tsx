'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="relative mt-auto pt-10 pb-6 text-center overflow-hidden">
            {/* Glowing gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/70 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent-amber to-transparent blur-sm" />

            {/* Soft ambient color glow behind content */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-40 bg-accent-gold/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative">
                <div className="mb-5 flex items-center justify-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-accent-gold/30 bg-gradient-to-br from-accent-gold/25 to-accent-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                        <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
                    </div>
                    <span className="font-display text-base font-black text-text-primary">
                        WetoMind <span className="text-accent-gold">AI</span>
                    </span>
                </div>

                <p className="mx-auto mb-5 max-w-md text-xs leading-relaxed text-text-secondary">
                    Interpretasi adat budaya sebagai sarana introspeksi dan refleksi diri. Tidak untuk dijadikan
                    kebenaran <span className="text-accent-gold/80 font-medium">mutlak</span>.
                </p>

                <blockquote className="relative mx-auto mb-6 max-w-lg rounded-2xl border border-accent-gold/15 bg-accent-gold/[0.06] px-5 py-4 text-xs italic leading-relaxed text-text-secondary">
                    <span className="absolute -top-2 left-4 text-3xl font-display text-accent-gold/40 leading-none">
                        &ldquo;
                    </span>
                    Kenali dirimu, pahami perjalananmu, dan temukan makna di balik setiap langkah yang telah digariskan
                    semesta.
                </blockquote>

                <div className="mb-6 flex items-center justify-center gap-4 text-xs text-text-secondary">
                    <Link
                        href="/tentang"
                        className="px-3 py-1.5 rounded-full border border-accent-gold/15 hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold transition-all duration-200"
                    >
                        Tentang
                    </Link>
                    <Link
                        href="/privasi"
                        className="px-3 py-1.5 rounded-full border border-accent-gold/15 hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold transition-all duration-200"
                    >
                        Kebijakan Privasi
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                    <p className="text-[11px] text-text-secondary/80">
                        Dikembangkan oleh{' '}
                        <span className="font-semibold text-accent-gold">Satrio Wisnu Adi Pratama</span>
                    </p>
                </div>

                <p className="text-[10px] text-text-secondary/50">
                    © {new Date().getFullYear()} WetoMind AI. Seluruh hak cipta dilindungi.
                </p>
            </div>
        </footer>
    );
}
