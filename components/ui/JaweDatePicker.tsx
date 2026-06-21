'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

interface JaweDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    id?: string;
}

const MONTHS_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const HARI_JAWA: Record<number, string> = { 0: 'Ngahad', 1: 'Senen', 2: 'Selasa', 3: 'Rebo', 4: 'Kemis', 5: 'Jemuwah', 6: 'Setu' };

function getPasaran(date: Date): string {
    const utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const epoch = Date.UTC(1970, 0, 1);
    const diffDays = Math.floor((utcDate - epoch) / 86400000);
    const PASARAN_CYCLE = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'];
    return PASARAN_CYCLE[((diffDays % 5) + 5) % 5];
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

function formatDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return '';
    return `${String(day).padStart(2, '0')} ${MONTHS_ID[month - 1]} ${year}`;
}

function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || ('ontouchstart' in window);
}

function CalendarBody({
    viewYear, viewMonth, value, today, showYearPicker,
    onPrevMonth, onNextMonth, onToggleYearPicker, onSelectDate, onSelectYear,
}: {
    viewYear: number; viewMonth: number; value: string; today: Date; showYearPicker: boolean;
    onPrevMonth: () => void; onNextMonth: () => void; onToggleYearPicker: () => void;
    onSelectDate: (day: number) => void; onSelectYear: (year: number) => void;
}) {
    const selectedDay   = value ? parseInt(value.split('-')[2]) : null;
    const selectedMonth = value ? parseInt(value.split('-')[1]) - 1 : null;
    const selectedYear  = value ? parseInt(value.split('-')[0]) : null;
    const daysInMonth   = getDaysInMonth(viewYear, viewMonth);
    const firstDay      = getFirstDayOfMonth(viewYear, viewMonth);
    const calendarDate  = value ? (() => {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d));
    })() : null;
    const calendarHariJawa = calendarDate ? HARI_JAWA[calendarDate.getUTCDay()] : null;
    const calendarPasaran  = calendarDate ? getPasaran(calendarDate) : null;
    const yearRange: number[] = [];
    for (let y = today.getFullYear(); y >= 1930; y--) yearRange.push(y);
    const yearScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showYearPicker && yearScrollRef.current) {
            const btn = yearScrollRef.current.querySelector('[data-selected="true"]') as HTMLElement;
            if (btn) btn.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [showYearPicker]);

    return (
        <>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-60" />
            <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between">
                    <button type="button" onClick={onPrevMonth} className="p-2 rounded-xl hover:bg-accent-gold/10 text-text-secondary hover:text-accent-gold transition-colors active:scale-90">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={onToggleYearPicker} className="font-display font-bold text-sm text-text-primary hover:text-accent-gold transition-colors px-3 py-1.5 rounded-xl hover:bg-accent-gold/8 active:scale-95">
                        {MONTHS_ID[viewMonth]} <span className="text-accent-gold">{viewYear}</span>
                    </button>
                    <button type="button" onClick={onNextMonth} className="p-2 rounded-xl hover:bg-accent-gold/10 text-text-secondary hover:text-accent-gold transition-colors active:scale-90">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex-1 h-px bg-accent-gold/15" />
                    <span className="text-accent-gold/40 text-[10px]">✦</span>
                    <div className="flex-1 h-px bg-accent-gold/15" />
                </div>
            </div>

            {showYearPicker ? (
                <div ref={yearScrollRef} className="px-3 pb-3 max-h-[240px] overflow-y-auto grid grid-cols-4 gap-1.5" style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                    {yearRange.map(y => (
                        <button key={y} type="button" data-selected={y === viewYear ? 'true' : 'false'} onClick={() => onSelectYear(y)}
                            className={clsx('py-2 rounded-xl text-sm font-bold transition-all active:scale-95', y === viewYear ? 'bg-accent-gold text-[#0a0400]' : 'text-text-secondary hover:bg-accent-gold/10 hover:text-text-primary')}>
                            {y}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="px-3 pb-3">
                    <div className="grid grid-cols-7 mb-1">
                        {DAYS_SHORT.map(d => (
                            <div key={d} className={clsx('text-center text-[10px] font-bold uppercase tracking-wider py-1', d === 'Jum' ? 'text-accent-gold/80' : 'text-text-secondary/50')}>{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
                            const cellDate = new Date(Date.UTC(viewYear, viewMonth, day));
                            const pasaran  = getPasaran(cellDate);
                            const isKliwon = pasaran === 'Kliwon';
                            const isFriday = cellDate.getUTCDay() === 5;
                            const isToday  = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                            return (
                                <button key={day} type="button" onClick={() => onSelectDate(day)} title={`${HARI_JAWA[cellDate.getUTCDay()]} ${pasaran}`}
                                    className={clsx(
                                        'relative flex flex-col items-center justify-center rounded-xl transition-all active:scale-90 h-10 w-full text-sm font-medium',
                                        isSelected ? 'bg-accent-gold text-[#0a0400] font-black shadow-md shadow-accent-gold/30'
                                            : isToday ? 'border border-accent-gold/40 text-accent-gold font-bold hover:bg-accent-gold/10'
                                            : 'text-text-primary hover:bg-accent-gold/8 hover:text-accent-gold',
                                        isKliwon && !isSelected && 'after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-accent-gold/50',
                                        isFriday && !isSelected && 'text-accent-amber/90',
                                    )}>
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                    {calendarHariJawa && calendarPasaran && (
                        <>
                            <div className="flex items-center gap-1.5 mt-3 mb-2">
                                <div className="flex-1 h-px bg-accent-gold/15" />
                                <span className="text-accent-gold/40 text-[10px]">✦</span>
                                <div className="flex-1 h-px bg-accent-gold/15" />
                            </div>
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] text-text-secondary/60 uppercase tracking-widest">Weton</span>
                                <span className="text-[11px] font-bold text-accent-gold">{calendarHariJawa} {calendarPasaran}</span>
                            </div>
                        </>
                    )}
                </div>
            )}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
        </>
    );
}

interface DropdownPos {
    top?: number;
    bottom?: number;
    left: number;
    width: number;
}

export function JaweDatePicker({ value, onChange, required, placeholder = 'Pilih tanggal lahir', id }: JaweDatePickerProps) {
    const today = new Date();
    const [isOpen, setIsOpen]           = useState(false);
    const [isMobile, setIsMobile]       = useState(false);
    const [mounted, setMounted]         = useState(false);
    const [dropdownPos, setDropdownPos] = useState<DropdownPos>({ top: 0, left: 0, width: 300 });
    const [showYearPicker, setShowYearPicker] = useState(false);

    const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split('-')[0]) : today.getFullYear() - 25);
    const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.split('-')[1]) - 1 : today.getMonth());

    const triggerRef = useRef<HTMLButtonElement>(null);

    // Mark as mounted after hydration so portals / window access are safe
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(isMobileDevice());
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (value) {
            setViewYear(parseInt(value.split('-')[0]));
            setViewMonth(parseInt(value.split('-')[1]) - 1);
        }
    }, [value]);

    // Close on outside click (desktop only)
    useEffect(() => {
        if (isMobile || !isOpen) return;
        function handler(e: MouseEvent | TouchEvent) {
            const target = e.target as Node;
            if (triggerRef.current && triggerRef.current.contains(target)) return;
            const dropdownEl = document.getElementById('jawa-dp-dropdown');
            if (dropdownEl && dropdownEl.contains(target)) return;
            setIsOpen(false);
            setShowYearPicker(false);
        }
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [isMobile, isOpen]);

    // Lock body scroll on mobile when open
    useEffect(() => {
        if (isMobile && isOpen) { document.body.style.overflow = 'hidden'; }
        else { document.body.style.overflow = ''; }
        return () => { document.body.style.overflow = ''; };
    }, [isMobile, isOpen]);

    const computeDropdownPos = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const CALENDAR_HEIGHT = 430;
        const CALENDAR_WIDTH  = 300;
        const GAP             = 6;
        const spaceBelow = window.innerHeight - rect.bottom - GAP;
        const spaceAbove = rect.top - GAP;
        const openUpward = spaceBelow < CALENDAR_HEIGHT && spaceAbove > spaceBelow;
        const left = Math.max(GAP, Math.min(rect.left, window.innerWidth - CALENDAR_WIDTH - GAP));
        if (openUpward) {
            setDropdownPos({ bottom: window.innerHeight - rect.top + GAP, left, width: CALENDAR_WIDTH });
        } else {
            setDropdownPos({ top: rect.bottom + GAP, left, width: CALENDAR_WIDTH });
        }
    }, []);

    const handleToggle = useCallback(() => {
        if (!isOpen && !isMobile) computeDropdownPos();
        setIsOpen(o => !o);
    }, [isOpen, isMobile, computeDropdownPos]);

    // Recompute position on scroll/resize so the calendar stays anchored
    useEffect(() => {
        if (isMobile || !isOpen) return;
        const onScrollOrResize = () => computeDropdownPos();
        window.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScrollOrResize, { capture: true });
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, [isMobile, isOpen, computeDropdownPos]);

    const prevMonth = useCallback(() => {
        setViewMonth(m => { if (m === 0) { setViewYear(y => y - 1); return 11; } return m - 1; });
    }, []);

    const nextMonth = useCallback(() => {
        setViewMonth(m => { if (m === 11) { setViewYear(y => y + 1); return 0; } return m + 1; });
    }, []);

    const selectDate = (day: number) => {
        onChange(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        setIsOpen(false);
        setShowYearPicker(false);
    };

    const selectYear = (y: number) => { setViewYear(y); setShowYearPicker(false); };

    const calendarProps = {
        viewYear, viewMonth, value, today, showYearPicker,
        onPrevMonth: prevMonth, onNextMonth: nextMonth,
        onToggleYearPicker: () => setShowYearPicker(s => !s),
        onSelectDate: selectDate, onSelectYear: selectYear,
    };

    const desktopDropdown = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    id="jawa-dp-dropdown"
                    key="desktop-dropdown"
                    initial={{ opacity: 0, scale: 0.97, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -4 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{
                        position: 'fixed',
                        top:    dropdownPos.top    !== undefined ? dropdownPos.top    : undefined,
                        bottom: dropdownPos.bottom !== undefined ? dropdownPos.bottom : undefined,
                        left:   dropdownPos.left,
                        width:  dropdownPos.width,
                        zIndex: 9999,
                    }}
                    className="rounded-2xl overflow-hidden border border-accent-gold/25 shadow-[0_8px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(212,175,55,0.08)] bg-bg-primary backdrop-blur-xl"
                >
                    <CalendarBody {...calendarProps} />
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="relative w-full">
            <button
                ref={triggerRef}
                type="button"
                id={id}
                onClick={handleToggle}
                className={clsx(
                    'w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl',
                    'bg-bg-secondary/40 border transition-all outline-none text-sm text-left cursor-pointer',
                    isOpen ? 'border-accent-gold/60 shadow-[0_0_0_2px_rgba(212,175,55,0.15)]' : 'border-accent-gold/10 hover:border-accent-gold/30',
                    value ? 'text-text-primary' : 'text-text-secondary/50',
                )}
            >
                <span>{value ? formatDisplay(value) : placeholder}</span>
                <Calendar className="w-4 h-4 text-accent-gold/60 shrink-0" />
            </button>

            {/* DESKTOP: Portal onto document.body so it escapes any ancestor
                overflow / transform containing block. AnimatePresence lives
                inside the portal so Framer Motion can track the child. */}
            {mounted && !isMobile && createPortal(desktopDropdown, document.body)}

            {/* MOBILE: full-screen bottom-sheet modal */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 backdrop-blur-sm"
                        onClick={() => { setIsOpen(false); setShowYearPicker(false); }}
                    >
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-md bg-bg-primary rounded-t-3xl border border-accent-gold/20 border-b-0 shadow-2xl overflow-hidden"
                            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
                        >
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-accent-gold/30" />
                            </div>
                            <div className="flex items-center justify-between px-5 py-2 mb-1">
                                <span className="font-display font-bold text-base text-text-primary">Pilih Tanggal Lahir</span>
                                <button type="button" onClick={() => { setIsOpen(false); setShowYearPicker(false); }}
                                    className="p-2 rounded-xl hover:bg-accent-gold/10 text-text-secondary hover:text-text-primary transition-colors active:scale-90">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <CalendarBody {...calendarProps} />
                            {value && (
                                <div className="px-5 pt-3 pb-4">
                                    <button type="button" onClick={() => { setIsOpen(false); setShowYearPicker(false); }}
                                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-gold to-accent-amber text-[#0a0400] font-extrabold text-sm tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-accent-gold/20">
                                        Pilih — {formatDisplay(value)}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
