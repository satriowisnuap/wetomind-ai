'use client';

import { ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-[100dvh] flex items-center justify-center px-6 bg-animated">
            <div className="max-w-xl mx-auto text-center">
                {/* Number */}
                <div className="mb-6">
                    <span className="font-display text-7xl md:text-8xl font-bold text-accent-gold/30">404</span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center">
                    <Compass className="w-8 h-8 text-accent-gold" />
                </div>

                {/* Title */}
                <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">
                    Jalan yang Anda Cari Tidak Ditemukan
                </h1>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed max-w-md mx-auto">
                    Ada kalanya sebuah perjalanan membawa kita ke tempat yang tidak tercatat di peta. Mungkin halaman
                    ini telah berpindah, atau mungkin memang bukan bagian dari perjalanan Anda hari ini.
                </p>

                {/* Quote */}
                <div className="mt-10 mb-10 px-6 py-5 rounded-2xl bg-accent-gold/[0.05] border border-accent-gold/15">
                    <p className="font-display italic text-text-primary">
                        “Tidak semua jalan yang hilang adalah jalan yang salah.”
                    </p>
                </div>

                {/* CTA */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-gold to-accent-amber text-[#0a0400] font-bold text-sm tracking-wide transition-all hover:scale-[1.02]"
                >
                    KEMBALI KE BERANDA
                    <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Small Note */}
                <p className="mt-6 text-xs text-text-secondary/60">
                    Waktu akan terus berjalan. Anda selalu dapat memulai kembali dari awal.
                </p>
            </div>
        </main>
    );
}
