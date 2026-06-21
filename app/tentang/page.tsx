'use client';

import { Footer } from '@/components/layouts/footer';
import { PageHeader } from '@/components/layouts/page-header';
import { ArrowRight, Feather, Hourglass } from 'lucide-react';
import Link from 'next/link';

export default function TentangPage() {
    return (
        <div className="min-h-[100dvh] bg-animated w-full overflow-y-auto hide-scrollbar font-sans">
            <PageHeader eyebrow="Asal Mula" title="Tentang Sebuah Pertanyaan yang Tak Pernah Selesai Diajukan" />

            <main className="max-w-2xl mx-auto px-6 pb-10">
                {/* Narrative */}
                <article
                    className="space-y-6 text-[15px] text-text-secondary leading-[1.9] fade-in-up"
                    style={{ animationDelay: '0.1s' }}
                >
                    <p>
                        Setiap aplikasi punya alasan ia ada. WetoMind AI lahir bukan dari ruang rapat atau riset pasar,
                        melainkan dari satu titik waktu yang sulit dijelaskan dengan angka — saat seseorang mendapati
                        harinya tetap berjalan, namun untuk sesaat ia tak lagi tahu ke arah mana semua ini menuju.
                    </p>
                    <p>
                        Di masa itu, kalender terasa seperti satu-satunya hal yang masih bisa dipercaya untuk berjalan
                        maju. Pergantian hari pasaran — Legi, Pahing, Pon, Wage, Kliwon — yang dulu hanya dianggap rumus
                        warisan leluhur, perlahan terasa seperti pengingat halus: bahwa waktu tidak pernah benar-benar
                        berhenti, meski rasanya seperti itu.
                    </p>
                    <p>
                        Dari sana muncul rasa ingin tahu yang sederhana. Bagaimana jika kebijaksanaan lama yang
                        diwariskan leluhur Jawa bisa dibaca ulang — bukan untuk meramal nasib, tapi untuk memahami diri
                        sendiri sedikit lebih jujur? Bagaimana jika Neptu dan Weton, yang tampak kuno dan kaku itu,
                        sebenarnya menyimpan bahasa yang sudah lama kita lupakan cara membacanya?
                    </p>

                    {/* Quote callout */}
                    <div className="relative my-10 px-6 py-6 rounded-2xl bg-accent-gold/[0.06] border border-accent-gold/15">
                        <span className="absolute -top-3 left-5 text-4xl font-display text-accent-gold/40 leading-none">
                            &ldquo;
                        </span>
                        <p className="font-display text-base md:text-lg text-text-primary italic leading-relaxed text-center">
                            Kadang yang kita cari bukan jawaban — melainkan cara baru untuk memahami waktu yang sudah
                            berjalan.
                        </p>
                    </div>

                    <p>
                        WetoMind AI dibangun dari proses itu: menyandingkan rumus primbon klasik dengan kecerdasan
                        buatan, bukan untuk menggantikan refleksi pribadi, melainkan untuk menemaninya. Aplikasi ini,
                        pada akhirnya, adalah sebuah catatan panjang yang ditulis ulang menjadi sesuatu yang bisa
                        dipakai orang lain — ruang yang tenang untuk bertanya &ldquo;mengapa saya begini&rdquo;, tanpa
                        harus menjawabnya sendirian.
                    </p>
                </article>

                {/* Developer section */}
                <section className="mt-20 relative">
                    <div className="absolute -inset-2 bg-accent-gold/5 rounded-[32px] blur-2xl pointer-events-none" />
                    <div className="relative bg-bg-secondary/70 backdrop-blur-xl border border-accent-gold/15 rounded-[28px] p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border border-accent-gold/25 flex items-center justify-center">
                                <Feather className="w-5 h-5 text-accent-gold" />
                            </div>
                            <div>
                                <span className="text-[11px] text-accent-gold font-bold uppercase tracking-wider block">
                                    Di Balik Aplikasi
                                </span>
                                <h2 className="font-display font-extrabold text-lg text-text-primary">
                                    Satrio Wisnu Adi Pratama
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                            <p>
                                Satrio Wisnu Adi Pratama membangun WetoMind AI sebagai pertemuan antara latar belakang
                                teknis dan ketertarikan pribadinya pada kosmologi serta falsafah Jawa. Bukan sebagai
                                pakar primbon, melainkan sebagai seseorang yang percaya bahwa teknologi modern dan
                                kearifan lama tidak harus saling meniadakan — keduanya bisa duduk di meja yang sama
                                untuk membantu orang memahami dirinya lebih baik.
                            </p>
                            <p>
                                Ia menulis setiap baris kode aplikasi ini dengan satu harapan sederhana: agar siapa pun
                                yang sedang berdiri di persimpangan dan mencari arah, dapat menemukan sedikit ketenangan
                                — dan menemukannya lebih cepat daripada yang pernah ia rasakan.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-accent-gold/10">
                            <Hourglass className="w-3.5 h-3.5 text-accent-gold/60" />
                            <span className="text-[11px] text-text-secondary/70">
                                Dirancang dan dikembangkan dengan penuh kesadaran, di Malang, Jawa Timur.
                            </span>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="flex justify-center mt-14 mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-gold to-accent-amber text-[#0a0400] font-extrabold text-xs tracking-wider hover:opacity-95 hover:scale-[1.02] transition-all shadow-lg shadow-accent-gold/20"
                    >
                        MULAI REFLEKSI ANDA SENDIRI <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </main>

            <div className="max-w-2xl mx-auto px-6">
                <Footer />
            </div>
        </div>
    );
}
