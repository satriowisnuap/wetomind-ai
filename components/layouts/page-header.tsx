'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    subtitle?: string;
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
    return (
        <header className="max-w-3xl mx-auto w-full px-6 pt-8">
            <nav className="flex items-center justify-between mb-16">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-accent-gold transition-colors group"
                >
                    <span className="w-8 h-8 rounded-full border border-accent-gold/20 flex items-center justify-center group-hover:border-accent-gold/50 group-hover:bg-accent-gold/10 transition-all">
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                    Kembali
                </Link>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20">
                            <Sparkles className="text-accent-gold w-3.5 h-3.5" />
                        </div>
                        <span className="font-display font-black text-sm text-text-primary hidden sm:inline">
                            WetoMind <span className="text-accent-gold">AI</span>
                        </span>
                    </div>
                </div>
            </nav>

            <div className="text-center mb-14 fade-in-up">
                <span className="block text-xs text-accent-gold font-bold uppercase tracking-[0.2em] mb-4">
                    {eyebrow}
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text-primary leading-tight mb-4">
                    {title}
                </h1>
                {subtitle && <p className="text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">{subtitle}</p>}
            </div>
        </header>
    );
}
