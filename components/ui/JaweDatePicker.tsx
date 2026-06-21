'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import clsx from 'clsx';

// How many px of space needed below trigger before we prefer downward
const DROPDOWN_HEIGHT_ESTIMATE = 390;

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

// Javanese day names & pasaran info for visual decoration
const HARI_JAWA: Record<number, string> = { 0: 'Ngahad', 1: 'Senen', 2: 'Selasa', 3: 'Rebo', 4: 'Kemis', 5: 'Jemuwah', 6: 'Setu' };
const PASARAN_CYCLE = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
// Epoch: 2000-01-01 = Sabtu Kliwon (pasaran index 4)
const EPOCH_DATE = new Date(2000, 0, 1);
function getPasaran(date: Date): string {
    const diff = Math.floor((date.getTime() - EPOCH_DATE.getTime()) / 86400000);
    return PASARAN_CYCLE[((diff % 5) + 5) % 5];
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

export function JaweDatePicker({ value, onChange, required, placeholder = 'Pilih tanggal lahir', id }: JaweDatePickerProps) {
    const today = new Date();
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const [viewYear, setViewYear] = useState(() => {
        if (value) return parseInt(value.split('-')[0]);
        return today.getFullYear() - 25;
    });
    const [viewMonth, setViewMonth] = useState(() => {
        if (value) return parseInt(value.split('-')[1]) - 1;
        return today.getMonth();
    });
    const [showYearPicker, setShowYearPicker] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Sync view when value changes externally
    useEffect(() => {
        if (value) {
            setViewYear(parseInt(value.split('-')[0]));
            setViewMonth(parseInt(value.split('-')[1]) - 1);
        }
    }, [value]);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setShowYearPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Compute direction when opening
    const handleToggle = useCallback(() => {
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpward(spaceBelow < DROPDOWN_HEIGHT_ESTIMATE);
        }
        setIsOpen(o => !o);
    }, [isOpen]);

    const prevMonth = useCallback(() => {
        setViewMonth(m => {
            if (m === 0) { setViewYear(y => y - 1); return 11; }
            return m - 1;
        });
    }, []);

    const nextMonth = useCallback(() => {
        setViewMonth(m => {
            if (m === 11) { setViewYear(y => y + 1); return 0; }
            return m + 1;
        });
    }, []);

    const selectDate = (day: number) => {
        const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(formatted);
        setIsOpen(false);
        setShowYearPicker(false);
    };

    const selectedDay = value ? parseInt(value.split('-')[2]) : null;
    const selectedMonth = value ? parseInt(value.split('-')[1]) - 1 : null;
    const selectedYear = value ? parseInt(value.split('-')[0]) : null;

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    // Year range for year picker (1930 – today)
    const yearRange: number[] = [];
    for (let y = today.getFullYear(); y >= 1930; y--) yearRange.push(y);

    const calendarDate = value ? new Date(parseInt(value.split('-')[0]), parseInt(value.split('-')[1]) - 1, parseInt(value.split('-')[2])) : null;
    const calendarHariJawa = calendarDate ? HARI_JAWA[calendarDate.getDay()] : null;
    const calendarPasaran = calendarDate ? getPasaran(calendarDate) : null;

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                id={id}
                onClick={handleToggle}
                className={clsx(
                    'w-full flex items-center justify-between gap-2',
                    'px-4 py-2.5 rounded-xl',
                    'bg-bg-secondary/40 border transition-all outline-none',
                    'text-sm text-left cursor-pointer',
                    isOpen
                        ? 'border-accent-gold/60 shadow-[0_0_0_2px_rgba(212,175,55,0.15)]'
                        : 'border-accent-gold/10 hover:border-accent-gold/30',
                    value ? 'text-text-primary' : 'text-text-secondary/50',
                )}
            >
                <span>{value ? formatDisplay(value) : placeholder}</span>
                <Calendar className="w-4 h-4 text-accent-gold/60 shrink-0" />
            </button>

            {/* Dropdown Calendar */}
            {isOpen && (
                <div className={clsx(
                    'absolute z-50 left-0',
                    openUpward ? 'bottom-full mb-2' : 'top-full mt-2',
                    'w-[300px] rounded-2xl overflow-hidden',
                    'border border-accent-gold/25',
                    'shadow-[0_8px_40px_rgba(0,0,0,0.25),0_0_0_1px_rgba(212,175,55,0.08)]',
                    'bg-bg-primary',
                    'backdrop-blur-xl',
                )}>
                    {/* Gold top bar ornament */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-60" />

                    {/* Header */}
                    <div className="px-4 pt-3 pb-2">
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="p-1.5 rounded-lg hover:bg-accent-gold/10 text-text-secondary hover:text-accent-gold transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowYearPicker(s => !s)}
                                className="font-display font-bold text-sm text-text-primary hover:text-accent-gold transition-colors px-2 py-1 rounded-lg hover:bg-accent-gold/8"
                            >
                                {MONTHS_ID[viewMonth]} <span className="text-accent-gold">{viewYear}</span>
                            </button>

                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-1.5 rounded-lg hover:bg-accent-gold/10 text-text-secondary hover:text-accent-gold transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Ornament divider */}
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex-1 h-px bg-accent-gold/15" />
                            <span className="text-accent-gold/40 text-[10px]">✦</span>
                            <div className="flex-1 h-px bg-accent-gold/15" />
                        </div>
                    </div>

                    {/* Year Picker Overlay */}
                    {showYearPicker ? (
                        <div className="px-3 pb-3 max-h-[220px] overflow-y-auto hide-scrollbar grid grid-cols-4 gap-1.5">
                            {yearRange.map(y => (
                                <button
                                    key={y}
                                    type="button"
                                    onClick={() => {
                                        setViewYear(y);
                                        setShowYearPicker(false);
                                    }}
                                    className={clsx(
                                        'py-1.5 rounded-lg text-xs font-bold transition-all',
                                        y === viewYear
                                            ? 'bg-accent-gold text-[#0a0400]'
                                            : 'text-text-secondary hover:bg-accent-gold/10 hover:text-text-primary',
                                    )}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-3 pb-3">
                            {/* Day headers */}
                            <div className="grid grid-cols-7 mb-1">
                                {DAYS_SHORT.map(d => (
                                    <div key={d} className={clsx(
                                        'text-center text-[10px] font-bold uppercase tracking-wider py-1',
                                        d === 'Jum' ? 'text-accent-gold/80' : 'text-text-secondary/50',
                                    )}>
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-y-0.5">
                                {/* Empty cells before first day */}
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}

                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const isSelected = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
                                    const cellDate = new Date(viewYear, viewMonth, day);
                                    const pasaran = getPasaran(cellDate);
                                    const isKliwon = pasaran === 'Kliwon';
                                    const isFriday = cellDate.getDay() === 5;
                                    const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => selectDate(day)}
                                            title={`${HARI_JAWA[cellDate.getDay()]} ${pasaran}`}
                                            className={clsx(
                                                'relative flex flex-col items-center justify-center rounded-lg transition-all',
                                                'h-9 w-full text-xs font-medium',
                                                isSelected
                                                    ? 'bg-accent-gold text-[#0a0400] font-black shadow-md shadow-accent-gold/30'
                                                    : isToday
                                                        ? 'border border-accent-gold/40 text-accent-gold font-bold hover:bg-accent-gold/10'
                                                        : 'text-text-primary hover:bg-accent-gold/8 hover:text-accent-gold',
                                                isKliwon && !isSelected && 'after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-accent-gold/50',
                                                isFriday && !isSelected && 'text-accent-amber/90',
                                            )}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Weton preview if a date is selected */}
                            {calendarHariJawa && calendarPasaran && (
                                <>
                                    <div className="flex items-center gap-1.5 mt-2.5 mb-2">
                                        <div className="flex-1 h-px bg-accent-gold/15" />
                                        <span className="text-accent-gold/40 text-[10px]">✦</span>
                                        <div className="flex-1 h-px bg-accent-gold/15" />
                                    </div>
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[10px] text-text-secondary/60 uppercase tracking-widest">Weton</span>
                                        <span className="text-[11px] font-bold text-accent-gold">
                                            {calendarHariJawa} {calendarPasaran}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Gold bottom bar ornament */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
                </div>
            )}
        </div>
    );
}
