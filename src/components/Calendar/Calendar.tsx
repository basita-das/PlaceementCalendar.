import React, { useState, useCallback } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarHero from './CalendarHero';
import NotesSection from './NotesSection';
import { CalendarRange, Goal, SpecialEvent } from '@/src/types/calendar';
import { MONTH_IMAGES } from '@/src/constants/calendar';

interface CalendarProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  notes: Record<string, string>;
  setNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  specials: SpecialEvent[];
  setSpecials: React.Dispatch<React.SetStateAction<SpecialEvent[]>>;
}

export default function Calendar({ 
  currentMonth, 
  setCurrentMonth, 
  notes, 
  setNotes,
  goals,
  setGoals,
  specials,
  setSpecials
}: CalendarProps) {
  const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
  const [direction, setDirection] = useState(0);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  }, [currentMonth, setCurrentMonth]);

  const handleNextMonth = useCallback(() => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  }, [currentMonth, setCurrentMonth]);

  const handleAddNote = useCallback((date: string, content: string) => {
    setNotes(prev => ({ ...prev, [date]: content }));
  }, [setNotes]);

  const handleDeleteNote = useCallback((date: string) => {
    setNotes(prev => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }, [setNotes]);

  const monthIndex = currentMonth.getMonth();
  const heroImage = MONTH_IMAGES[monthIndex];
  const currentMonthStr = format(currentMonth, 'yyyy-MM');

  const currentMonthGoals = goals.filter(g => g.month === currentMonthStr);
  const completedGoals = currentMonthGoals.filter(g => g.completed).length;
  const totalGoals = currentMonthGoals.length;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-6 sm:py-10">
      <div className="bg-white dark:bg-black rounded-[2rem] sm:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-x-4 border-b-8 border-slate-200 dark:border-slate-800 overflow-hidden relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          
          {/* Image (Hero) - Top on mobile, Top-Left on desktop */}
          <div className="col-span-1 lg:col-span-4 border-b-4 lg:border-b-0 lg:border-r-4 border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50">
            <CalendarHero 
              image={heroImage} 
              monthName={format(currentMonth, 'MMMM')} 
            />
          </div>

          {/* Calendar Grid - Middle on mobile, Right on desktop */}
          <div className="col-span-1 lg:col-span-8 lg:row-span-2 p-4 sm:p-10 order-2 lg:order-none">
            <CalendarHeader 
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onDateChange={setCurrentMonth}
            />
            
            <div className="mt-4 sm:mt-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentMonth.toISOString()}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    rotateY: { duration: 0.4 }
                  }}
                  className="perspective-1000"
                >
                  <CalendarGrid 
                    currentMonth={currentMonth}
                    range={range}
                    onRangeChange={setRange}
                    notes={notes}
                    specials={specials}
                    setSpecials={setSpecials}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Bar (Integrated) */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-900">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h4 className="text-[10px] font-display font-black text-slate-400 uppercase tracking-tighter">Monthly Completion</h4>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-1">
                    {completedGoals} of {totalGoals} milestones achieved
                  </p>
                </div>
                <span className="text-2xl font-black text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-1 border border-slate-200 dark:border-slate-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(255,107,0,0.3)]"
                />
              </div>
            </div>
          </div>

          {/* Notes Section - Bottom on mobile, Bottom-Left on desktop */}
          <div className="col-span-1 lg:col-span-4 border-b-4 lg:border-b-0 lg:border-r-4 border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col order-3 lg:order-none">
            <div className="p-2 sm:p-8 flex-1">
              <NotesSection 
                range={range} 
                notes={notes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                goals={goals}
                setGoals={setGoals}
                specials={specials}
                setSpecials={setSpecials}
                currentMonth={currentMonth}
                onDateChange={setCurrentMonth}
                onRangeChange={setRange}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Footer */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-white dark:bg-black rounded-full shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-slate-500 font-display font-black text-sm uppercase tracking-tighter">
            Mastering DSA, one day at a time.
          </p>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
}
