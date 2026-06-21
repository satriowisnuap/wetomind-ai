'use client';

import { Footer } from '@/components/layouts/footer';
import { PageHeader } from '@/components/layouts/page-header';
import { Database, Lock, Mail, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react';

const sections = [
    {
        icon: <Database className="w-4.5 h-4.5" />,
        title: 'Data yang Kami Kumpulkan',
        body: 'WetoMind AI hanya meminta nama dan tanggal lahir yang Anda masukkan secara sukarela untuk keperluan kalkulasi weton. Kami tidak meminta nomor telepon, alamat email, atau data identitas lain, dan tidak ada proses pendaftaran akun.',
    },
    {
        icon: <ShieldCheck className="w-4.5 h-4.5" />,
        title: 'Bagaimana Data Digunakan',
        body: 'Nama dan tanggal lahir digunakan semata untuk menghitung Neptu, Weton, dan menjalankan konsultasi interaktif bersama AI selama sesi Anda berlangsung. Data ini tidak digunakan untuk iklan, pemasaran, maupun dijual kepada pihak ketiga mana pun.',
    },
    {
        icon: <Lock className="w-4.5 h-4.5" />,
        title: 'Penyimpanan & Keamanan',
        body: 'Seluruh kalkulasi dan percakapan diproses secara real-time. Kami tidak menyimpan riwayat konsultasi secara permanen — begitu sesi Anda ditutup atau halaman dimuat ulang, data sesi tersebut akan terhapus dari sistem.',
    },
    {
        icon: <UserCheck className="w-4.5 h-4.5" />,
        title: 'Pihak Ketiga',
        body: 'Untuk menghasilkan jawaban konsultasi, kami memproses input Anda melalui penyedia layanan kecerdasan buatan tepercaya. Penyedia tersebut memproses data sesuai kebijakan keamanan mereka dan tidak menggunakan data Anda untuk tujuan di luar layanan ini.',
    },
    {
        icon: <RefreshCw className="w-4.5 h-4.5" />,
        title: 'Perubahan Kebijakan',
        body: 'Kebijakan privasi ini dapat diperbarui sewaktu-waktu mengikuti perkembangan layanan. Perubahan signifikan akan dicantumkan pada tanggal pembaruan di bagian bawah halaman ini.',
    },
];

export default function PrivasiPage() {
    return (
        <div className="min-h-[100dvh] bg-animated w-full overflow-y-auto hide-scrollbar font-sans">
            <PageHeader
                eyebrow="Kebijakan Privasi"
                title="Privasi Anda, Prioritas Kami"
                subtitle="Ringkas dan transparan — berikut bagaimana WetoMind AI memperlakukan data yang Anda berikan."
            />

            <main className="max-w-2xl mx-auto px-6 pb-10">
                <div className="space-y-4">
                    {sections.map((s, i) => (
                        <div
                            key={i}
                            className="flex gap-4 p-5 md:p-6 rounded-2xl bg-bg-secondary/70 backdrop-blur-md border border-accent-gold/15 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                        >
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/25 flex items-center justify-center text-accent-gold">
                                {s.icon}
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-sm text-text-primary mb-1.5">{s.title}</h3>
                                <p className="text-xs md:text-sm text-text-secondary leading-relaxed">{s.body}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact card */}
                <div className="mt-8 p-6 rounded-2xl bg-accent-gold/[0.06] border border-accent-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-accent-gold" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-primary">Ada pertanyaan soal privasi?</p>
                            <p className="text-xs text-text-secondary">Hubungi kami kapan saja.</p>
                        </div>
                    </div>

                    <a
                        href="mailto:halo@wetomind.ai"
                        className="text-xs font-bold text-accent-gold hover:underline whitespace-nowrap"
                    >
                        satriowisnuap@gmail.com
                    </a>
                </div>

                <p className="text-center text-[11px] text-text-secondary/50 mt-8">Terakhir diperbarui: 21 Juni 2026</p>
            </main>

            <div className="max-w-2xl mx-auto px-6">
                <Footer />
            </div>
        </div>
    );
}
