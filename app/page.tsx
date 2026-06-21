'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatPanel } from '@/components/ChatPanel';
import { Navbar } from '@/components/layouts/navbar';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/feature-section';
import { TimelineSection } from '@/components/sections/timeline-section';
import { PhilosophySection } from '@/components/sections/philosophy-section';
import { FaqSection } from '@/components/sections/faq-section';
import { Footer } from '@/components/layouts/footer';
import { getWeton, type WetonResult } from '@/lib/javaCalendar';

export default function Home() {
    const [isActive, setIsActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [calcName, setCalcName] = useState('');
    const [calcBirthdate, setCalcBirthdate] = useState('');
    const [calcResult, setCalcResult] = useState<WetonResult | null>(null);
    const [showResultCard, setShowResultCard] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!calcName.trim() || !calcBirthdate) return;
        try {
            const result = getWeton(calcBirthdate);
            setCalcResult(result);
            setShowResultCard(true);
        } catch (error) {
            console.error('Gagal kalkulasi weton', error);
        }
    };

    const handleReset = () => {
        setShowResultCard(false);
        setCalcResult(null);
        setCalcName('');
        setCalcBirthdate('');
    };

    return (
        <div className="min-h-[100dvh] flex bg-animated w-full overflow-hidden font-sans relative">
            <motion.div
                animate={{ width: isActive ? (isMobile ? '0%' : '50%') : '100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
                className="h-[100dvh] overflow-y-auto overflow-x-hidden flex flex-col hide-scrollbar relative shrink-0 z-0 bg-transparent"
            >
                <div className="max-w-6xl mx-auto w-full px-6 py-6 flex flex-col pb-32">
                    <Navbar isActive={isActive} onStartConsultation={() => setIsActive(true)} />

                    <HeroSection
                        calcName={calcName}
                        setCalcName={setCalcName}
                        calcBirthdate={calcBirthdate}
                        setCalcBirthdate={setCalcBirthdate}
                        calcResult={calcResult}
                        showResultCard={showResultCard}
                        onCalculate={handleCalculate}
                        onConsult={() => setIsActive(true)}
                        onReset={handleReset}
                        isChatOpen={isActive}
                    />

                    <FeaturesSection />
                    <TimelineSection />
                    <PhilosophySection />
                    <FaqSection />
                    <Footer />
                </div>
            </motion.div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ width: '0%', opacity: 0 }}
                        animate={{ width: isMobile ? '100%' : '50%', opacity: 1 }}
                        exit={{ width: '0%', opacity: 0 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
                        className="h-[100dvh] absolute lg:relative right-0 flex-shrink-0 bg-bg-secondary shadow-[-20px_0_40px_rgba(0,0,0,0.35)] z-20"
                    >
                        <div className="w-full h-full min-w-[320px]">
                            <ChatPanel
                                onClose={() => setIsActive(false)}
                                initialUserName={calcName}
                                initialUserBirthdate={calcBirthdate}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
