'use client';

import { Plus } from 'lucide-react';

const faqs = [
    {
        q: 'Bagaimana WetoMind AI merumuskan analisisnya?',
        a: 'Sistem kami pertama-tama menghitung nilai Neptu berdasarkan Hari dan Pasaran kelahiran Anda. Nilai ini kemudian dianalisis bersama kecerdasan buatan (AI) yang telah dilatih dengan berbagai referensi kitab Primbon Jawa kuno guna memberikan kesimpulan yang logis dan relevan.',
    },
    {
        q: 'Apakah data tanggal lahir saya disimpan?',
        a: 'Sama sekali tidak. Privasi adalah komitmen kami. Seluruh kalkulasi diproses secara real-time dan data Anda langsung dibersihkan begitu sesi ditutup.',
    },
    {
        q: 'Apa perbedaan Neptu Hari dan Neptu Pasaran?',
        a: 'Neptu Hari adalah nilai angka dari penanggalan masehi (7 hari), sedangkan Neptu Pasaran adalah nilai penanggalan Jawa (5 pasaran: Legi, Pahing, Pon, Wage, Kliwon). Penjumlahan keduanya menghasilkan Total Neptu yang melambangkan vibrasi energi awal Anda.',
    },
    {
        q: 'Dapatkah saya menguji kecocokan bisnis di sini?',
        a: 'Bisa. Di dalam panel konsultasi, pilih fitur "Sinergi Rekan Kerja" untuk menganalisis kecocokan energi, kolaborasi peran, dan arah rezeki bersama partner kerja Anda.',
    },
];

export function FaqSection() {
    return (
        <section className="mb-24">
            <span className="block text-center text-xs text-accent-gold font-bold uppercase tracking-[0.2em] mb-3">
                Pusat Bantuan
            </span>
            <h3 className="text-center font-display text-3xl font-extrabold mb-3 text-text-primary">
                Tanya Jawab Umum
            </h3>
            <p className="text-center text-text-secondary text-sm max-w-xl mx-auto mb-12">
                Menjawab rasa penasaran Anda seputar kalkulator dan konsultasi WetoMind AI.
            </p>

            <div className="space-y-3 max-w-3xl mx-auto">
                {faqs.map((faq, i) => (
                    <details
                        key={i}
                        className="group relative bg-bg-secondary/70 backdrop-blur-md border border-accent-gold/15 hover:border-accent-gold/35 rounded-2xl px-5 md:px-6 cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] open:shadow-[0_8px_30px_rgba(212,175,55,0.1)] open:border-accent-gold/40 [&_summary::-webkit-details-marker]:hidden"
                    >
                        {/* left accent bar, lights up when open */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[3px] rounded-full bg-gradient-to-b from-accent-gold to-accent-amber transition-all duration-300 group-open:h-2/3" />

                        <summary className="py-5 font-display font-bold text-sm md:text-[15px] text-text-primary list-none flex justify-between items-center gap-4 outline-none">
                            <div className="flex items-center gap-4">
                                <span className="shrink-0 w-7 h-7 rounded-lg bg-accent-gold/10 border border-accent-gold/25 flex items-center justify-center text-[11px] font-black text-accent-gold">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span>{faq.q}</span>
                            </div>
                            <span className="shrink-0 w-7 h-7 rounded-full bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold transition-all duration-300 group-open:rotate-45 group-open:bg-accent-gold group-open:text-[#0a0400]">
                                <Plus className="w-3.5 h-3.5" />
                            </span>
                        </summary>

                        <div className="pb-5 pl-11 pr-2 text-xs md:text-sm text-text-secondary leading-relaxed border-t border-accent-gold/10 pt-4 -mt-1">
                            {faq.a}
                        </div>
                    </details>
                ))}
            </div>

            {/* Helper note below */}
            {/* Helper note below */}
            <p className="text-center text-xs text-text-secondary/60 mt-8">
                Temukan berbagai informasi seputar weton, primbon Jawa, dan interpretasi tradisional yang dapat membantu
                Anda memahami makna di balik tanggal lahir.
            </p>
        </section>
    );
}
