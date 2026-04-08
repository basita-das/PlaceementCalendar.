import { 
  addDays, 
  eachDayOfInterval, 
  endOfMonth, 
  endOfWeek, 
  format, 
  isSameDay, 
  isSameMonth, 
  isToday, 
  startOfMonth, 
  startOfWeek,
  isWithinInterval,
  isBefore,
  startOfDay
} from 'date-fns';
import { Zap, Brain, Users, X, Clock, MapPin, Building2, Quote } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import { CalendarRange, SpecialEvent } from '@/src/types/calendar';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarGridProps {
  currentMonth: Date;
  range: CalendarRange;
  onRangeChange: (range: CalendarRange) => void;
  notes: Record<string, string>;
  specials: SpecialEvent[];
  setSpecials: React.Dispatch<React.SetStateAction<SpecialEvent[]>>;
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ 
  currentMonth, 
  range, 
  onRangeChange,
  notes,
  specials,
  setSpecials
}: CalendarGridProps) {
  const [activeSpecialId, setActiveSpecialId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [tempReview, setTempReview] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleUpdateReview = (id: string) => {
    setSpecials(prev => prev.map(s => s.id === id ? { ...s, review: tempReview } : s));
    setEditingReviewId(null);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = useMemo(() => 
    eachDayOfInterval({
      start: startDate,
      end: endDate,
    }),
    [startDate, endDate]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActiveSpecialId(null);
      }
    };

    if (activeSpecialId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeSpecialId]);

  const handleDateClick = (date: Date) => {
    const clickedDate = startOfDay(date);
    
    if (!range.start || (range.start && range.end)) {
      onRangeChange({ start: clickedDate, end: null });
    } else {
      if (isBefore(clickedDate, range.start)) {
        onRangeChange({ start: clickedDate, end: null });
      } else {
        onRangeChange({ start: range.start, end: clickedDate });
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!range.start || !range.end) return false;
    return isWithinInterval(date, { start: range.start, end: range.end });
  };

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-7 mb-2 sm:mb-6">
        {weekDays.map((day, idx) => (
          <div 
            key={day} 
            className={cn(
              "text-center text-[10px] sm:text-xs font-black uppercase tracking-tighter",
              (idx === 0 || idx === 6) ? "text-primary" : "text-slate-600 dark:text-slate-400"
            )}
          >
            <span className="hidden xs:inline">{day}</span>
            <span className="xs:hidden">{day[0]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border border-primary/30 dark:border-primary/20 rounded-lg shadow-sm relative">
        {days.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isSelectedStart = range.start && isSameDay(day, range.start);
          const isSelectedEnd = range.end && isSameDay(day, range.end);
          const isBetween = isInRange(day);
          const hasNote = notes[dateStr];
          const daySpecials = specials.filter(s => s.date === dateStr);
          const colIndex = idx % 7;
          const hasActiveSpecial = daySpecials.some(s => s.id === activeSpecialId);

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative min-h-[4.5rem] xs:min-h-[5.5rem] sm:min-h-0 sm:aspect-auto sm:h-32 md:h-36 p-1 sm:p-2 transition-all duration-200 group bg-white dark:bg-black cursor-pointer",
                !isCurrentMonth && "bg-slate-50/50 dark:bg-slate-950/30 text-slate-300 dark:text-slate-700",
                isBetween && "bg-primary/5 dark:bg-primary/10",
                isSelectedStart && "bg-primary text-white z-10 rounded-l-xl",
                isSelectedEnd && "bg-primary text-white z-10 rounded-r-xl",
                isSelectedStart && isSelectedEnd && "rounded-xl",
                hasNote && "after:content-[''] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full",
                "hover:bg-slate-50 dark:hover:bg-slate-900",
                hasActiveSpecial && "z-50",
                // Round corners manually since we removed overflow-hidden
                idx === 0 && "rounded-tl-lg",
                idx === 6 && "rounded-tr-lg",
                idx === days.length - 7 && "rounded-bl-lg",
                idx === days.length - 1 && "rounded-br-lg"
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start h-full gap-1">
                <span className={cn(
                  "text-lg sm:text-2xl font-black shrink-0",
                  isCurrentMonth ? (
                    (day.getDay() === 0 || day.getDay() === 6) ? "text-primary" : "text-slate-900 dark:text-white"
                  ) : "text-slate-300 dark:text-slate-700",
                  isToday(day) && !isSelectedStart && !isSelectedEnd && "text-primary ring-2 ring-primary/20 rounded-full w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center",
                  (isSelectedStart || isSelectedEnd) && "text-white"
                )}>
                  {format(day, 'd')}
                </span>
                
                <div className="flex flex-wrap justify-end sm:flex-col gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
                  {daySpecials.map(special => {
                    const Icon = special.tag === 'OA' ? Zap : special.tag === 'Mock test' ? Brain : Users;
                    const isActive = activeSpecialId === special.id;
                    
                    return (
                      <div key={special.id} className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSpecialId(isActive ? null : special.id);
                          }}
                          className={cn(
                            "p-0.5 sm:p-1 rounded-md transition-all",
                            isActive ? "bg-primary text-white scale-110" : "hover:bg-primary/10"
                          )}
                        >
                          <Icon 
                            className={cn(
                              "w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-6 sm:h-6", 
                              (isSelectedStart || isSelectedEnd || isActive) ? "text-white" : "text-primary"
                            )} 
                          />
                        </button>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              ref={popoverRef}
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className={cn(
                                "absolute z-[100] mt-2 w-48 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4 text-left pointer-events-auto",
                                colIndex < 3 ? "left-0" : colIndex > 3 ? "right-0" : "left-1/2 -translate-x-1/2"
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-wider">{special.tag}</span>
                                <button 
                                  onClick={() => setActiveSpecialId(null)}
                                  className="ml-auto text-slate-400 hover:text-slate-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{special.company}</h5>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{special.time}</span>
                                </div>
                                {special.mode && (
                                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                    <Building2 className="w-3 h-3" />
                                    <span>{special.mode}</span>
                                  </div>
                                )}
                                {special.review || editingReviewId === special.id ? (
                                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                          <Quote className="w-3 h-3 text-primary shrink-0" />
                                          <span className="text-[8px] font-bold text-slate-400 uppercase">Review</span>
                                        </div>
                                        {editingReviewId !== special.id && (
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingReviewId(special.id);
                                              setTempReview(special.review);
                                            }}
                                            className="text-[8px] font-bold text-primary hover:underline"
                                          >
                                            Edit
                                          </button>
                                        )}
                                      </div>
                                      
                                      {editingReviewId === special.id ? (
                                        <div className="space-y-2">
                                          <textarea
                                            value={tempReview}
                                            onChange={(e) => setTempReview(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-[10px] text-slate-900 dark:text-white focus:ring-1 focus:ring-primary outline-none min-h-[60px]"
                                            placeholder="Add your review..."
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <div className="flex gap-1">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateReview(special.id);
                                              }}
                                              className="flex-1 py-1 bg-primary text-white text-[9px] font-bold rounded"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingReviewId(null);
                                              }}
                                              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-bold rounded"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-[10px] text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                          {special.review || "No review added yet."}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingReviewId(special.id);
                                      setTempReview('');
                                    }}
                                    className="mt-2 w-full py-1.5 border border-dashed border-slate-200 dark:border-slate-800 rounded text-[9px] font-bold text-slate-400 hover:border-primary hover:text-primary transition-colors"
                                  >
                                    + Add Review
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Range connecting background for middle days */}
              {isBetween && !isSelectedStart && !isSelectedEnd && (
                <div className="absolute inset-y-0 -inset-x-0.5 bg-primary/10 dark:bg-primary/20 z-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
