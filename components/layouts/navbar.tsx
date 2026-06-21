'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavbarProps {
    isActive: boolean;
    onStartConsultation: () => void;
}

export function Navbar({ isActive, onStartConsultation }: NavbarProps) {
    return (
        <nav className="flex justify-between items-center mb-10 fade-in-up">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20">
                    <Sparkles className="text-accent-gold w-5 h-5" />
                </div>
                <h1 className="font-display text-xl font-extrabold tracking-tight text-text-primary">
                    WetoMind <span className="text-accent-gold">AI</span>
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                {!isActive && (
                    <button
                        onClick={onStartConsultation}
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-accent-gold text-[#0a0400] hover:bg-accent-amber transition-all cursor-pointer shadow-lg shadow-accent-gold/20"
                    >
                        Mulai Konsultasi <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </nav>
    );
}
