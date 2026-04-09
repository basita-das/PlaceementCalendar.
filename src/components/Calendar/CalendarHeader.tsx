import React, { useState, useRef, useEffect } from 'react';
import { format, setMonth, setYear, getYear, getMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { AnimatedUnderline } from '@/src/components/ui/animated-underline';
import { cn } from '@/src/lib/utils';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateChange: (date: Date) => void;
}

export default function CalendarHeader({ 
  currentMonth, 
  onPrevMonth, 
  onNextMonth,
  onDateChange
}: CalendarHeaderProps) {
  const [showPickers, setShowPickers] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPickers(false);
      }
    }

    if (showPickers) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPickers]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 21 }, (_, i) => getYear(new Date()) - 10 + i);

  const handleMonthChange = (idx: number) => {
    onDateChange(setMonth(currentMonth, idx));
    setShowPickers(false);
  };

  const handleYearChange = (year: number) => {
    onDateChange(setYear(currentMonth, year));
    setShowPickers(false);
  };

  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8 px-1 sm:px-2 gap-4">
      <div className="flex items-center gap-6">
        <div className="relative" ref={pickerRef}>
          <button 
            onClick={() => setShowPickers(!showPickers)}
            className="flex flex-col items-start text-left group transition-all"
          >
            <AnimatedUnderline className="pb-1">
              <span className="font-display font-black text-xl xs:text-2xl sm:text-5xl text-primary tracking-tighter uppercase leading-none">
                {format(currentMonth, 'MMMM')}
              </span>
            </AnimatedUnderline>
            <span className="font-display font-black text-base xs:text-lg sm:text-2xl text-slate-400 tracking-tighter mt-0.5 sm:mt-1 leading-none group-hover:text-white transition-colors">
              {format(currentMonth, 'yyyy')}
            </span>
          </button>

          {showPickers && (
            <div className="absolute top-full right-0 sm:right-auto sm:left-0 mt-4 z-50 bg-black border border-slate-800 rounded-2xl shadow-2xl p-3 sm:p-4 flex gap-2 sm:gap-4 animate-in fade-in slide-in-from-top-2 duration-200 max-w-[calc(100vw-2rem)]">
              <div className="flex flex-col gap-1 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 px-2">Month</p>
                {months.map((month, idx) => (
                  <button
                    key={month}
                    onClick={() => handleMonthChange(idx)}
                    className={cn(
                      "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg text-left transition-colors whitespace-nowrap",
                      getMonth(currentMonth) === idx 
                        ? "bg-primary text-white font-bold" 
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
              <div className="w-px bg-slate-800" />
              <div className="flex flex-col gap-1 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 px-2">Year</p>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className={cn(
                      "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg text-left transition-colors",
                      getYear(currentMonth) === year 
                        ? "bg-primary text-white font-bold" 
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-4">
        <div className="flex gap-1 sm:gap-2 bg-black/40 p-1 sm:p-1.5 rounded-xl border border-slate-800 backdrop-blur-sm">
          <button
            onClick={onPrevMonth}
            className="p-2 sm:p-2.5 hover:bg-primary/10 hover:text-primary rounded-lg transition-all text-slate-400 border border-transparent hover:border-primary/20"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 h-6" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 sm:p-2.5 hover:bg-primary/10 hover:text-primary rounded-lg transition-all text-slate-400 border border-transparent hover:border-primary/20"
            aria-label="Next Month"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
