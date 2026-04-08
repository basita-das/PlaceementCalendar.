import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ChevronDown, Calendar as CalendarIcon, Target, CheckCircle2, Circle, Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Goal, SpecialEvent, SpecialTag } from '@/src/types/calendar';
import { SPECIAL_TAGS } from '@/src/constants/calendar';

interface NavbarProps {
  notes: Record<string, string>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  specials: SpecialEvent[];
  onDateChange: (date: Date) => void;
}

export default function Navbar({ notes, goals, setGoals, specials, onDateChange }: NavbarProps) {
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isSpecialsOpen, setIsSpecialsOpen] = useState(false);
  const [selectedSpecialTag, setSelectedSpecialTag] = useState<SpecialTag | null>(null);

  const specialsRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (specialsRef.current && !specialsRef.current.contains(event.target as Node)) {
        setIsSpecialsOpen(false);
      }
      if (goalsRef.current && !goalsRef.current.contains(event.target as Node)) {
        setIsGoalsOpen(false);
      }
      if (eventsRef.current && !eventsRef.current.contains(event.target as Node)) {
        setIsEventsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const events = React.useMemo(() => 
    Object.entries(notes)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .slice(0, 10),
    [notes]
  );

  const goalsByMonth = React.useMemo(() => 
    goals.reduce((acc, goal) => {
      if (!acc[goal.month]) acc[goal.month] = [];
      acc[goal.month].push(goal);
      return acc;
    }, {} as Record<string, Goal[]>),
    [goals]
  );

  const sortedMonths = React.useMemo(() => 
    Object.keys(goalsByMonth).sort((a, b) => b.localeCompare(a)),
    [goalsByMonth]
  );

  const handleEventClick = (dateStr: string) => {
    onDateChange(parseISO(dateStr));
    setIsEventsOpen(false);
    setIsSpecialsOpen(false);
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const filteredSpecials = React.useMemo(() => 
    selectedSpecialTag 
      ? specials.filter(s => s.tag === selectedSpecialTag).sort((a, b) => b.date.localeCompare(a.date))
      : [],
    [specials, selectedSpecialTag]
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FFFEFE] dark:bg-[#000000] border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="font-display font-black text-sm xs:text-base sm:text-xl tracking-tighter text-slate-900 dark:text-white whitespace-nowrap">
              <span className="text-primary">Placement</span>Calendar<span className="text-primary">.</span>
            </span>
          </div>

            <div className="flex items-center gap-2 sm:gap-6">
            {/* Specials Dropdown */}
            <div className="relative" ref={specialsRef}>
              <button
                onClick={() => {
                  setIsSpecialsOpen(!isSpecialsOpen);
                  setIsGoalsOpen(false);
                  setIsEventsOpen(false);
                  setSelectedSpecialTag(null);
                }}
                className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <Star className="w-3.5 h-3.5 sm:w-4 h-4" />
                <span className="hidden xs:inline">Specials</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", isSpecialsOpen && "rotate-180")} />
              </button>

              {isSpecialsOpen && (
                <div className="absolute top-full right-[-1rem] xs:right-0 mt-2 w-[calc(100vw-2rem)] xs:w-64 sm:w-72 bg-[#FFFEFE] dark:bg-[#000000] border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-display font-black text-slate-400 uppercase tracking-tighter">Specials Tracker</p>
                  </div>
                  
                  <div className="p-2 flex gap-1 border-b border-slate-50 dark:border-slate-800">
                    {SPECIAL_TAGS.map(({ tag, icon: Icon, color }) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedSpecialTag(tag)}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all border",
                          selectedSpecialTag === tag 
                            ? "bg-primary/10 border-primary/30 text-primary" 
                            : "border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                        aria-label={`Filter by ${tag}`}
                      >
                        <Icon className={cn("w-4 h-4", selectedSpecialTag === tag ? "text-primary" : color)} />
                        <span className="text-[9px] font-bold uppercase">{tag}</span>
                      </button>
                    ))}
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {!selectedSpecialTag ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-xs text-slate-500 italic">Select a category to view logs</p>
                      </div>
                    ) : filteredSpecials.length > 0 ? (
                      <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {filteredSpecials.map(special => (
                          <button
                            key={special.id}
                            onClick={() => handleEventClick(special.date)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[10px] font-bold text-primary">
                                {format(parseISO(special.date), 'MMM d, yyyy')}
                              </p>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{special.company}</span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium line-clamp-1 group-hover:text-white">
                              {special.mode && `${special.mode} • `}{special.time}
                            </p>
                            {special.review && (
                              <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-1">
                                "{special.review}"
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-xs text-slate-500 italic">No {selectedSpecialTag}s logged yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Goals Dropdown */}
            <div className="relative" ref={goalsRef}>
              <button
                onClick={() => {
                  setIsGoalsOpen(!isGoalsOpen);
                  setIsEventsOpen(false);
                  setIsSpecialsOpen(false);
                }}
                className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <Target className="w-3.5 h-3.5 sm:w-4 h-4" />
                <span className="hidden xs:inline">Goals</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", isGoalsOpen && "rotate-180")} />
              </button>

              {isGoalsOpen && (
                <div className="absolute top-full right-[-1rem] xs:right-0 mt-2 w-[calc(100vw-2rem)] xs:w-64 sm:w-72 bg-[#FFFEFE] dark:bg-[#000000] border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-display font-black text-slate-400 uppercase tracking-tighter">Monthly Goals</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {sortedMonths.length > 0 ? (
                      sortedMonths.map(month => (
                        <div key={month} className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                          <p className="text-[10px] font-bold text-primary mb-2 uppercase tracking-wider">
                            {format(parseISO(`${month}-01`), 'MMM yyyy')}
                          </p>
                          <div className="space-y-2">
                            {goalsByMonth[month].map(goal => (
                              <button
                                key={goal.id}
                                onClick={() => toggleGoal(goal.id)}
                                className="flex items-center gap-2 w-full text-left group"
                              >
                                {goal.completed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                )}
                                <span className={cn(
                                  "text-xs transition-all",
                                  goal.completed ? "text-slate-500 line-through" : "text-slate-300 group-hover:text-white"
                                )}>
                                  {goal.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-slate-400 italic">No goals set yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Events Dropdown */}
            <div className="relative" ref={eventsRef}>
              <button
                onClick={() => {
                  setIsEventsOpen(!isEventsOpen);
                  setIsGoalsOpen(false);
                  setIsSpecialsOpen(false);
                }}
                className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <CalendarIcon className="w-3.5 h-3.5 sm:w-4 h-4" />
                <span className="hidden xs:inline">Events</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", isEventsOpen && "rotate-180")} />
              </button>

              {isEventsOpen && (
                <div className="absolute top-full right-[-1rem] xs:right-0 mt-2 w-[calc(100vw-2rem)] xs:w-56 sm:w-64 bg-[#FFFEFE] dark:bg-[#000000] border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-display font-black text-slate-400 uppercase tracking-tighter">Logged Events</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {events.length > 0 ? (
                      events.map(([date, content]) => (
                        <button
                          key={date}
                          onClick={() => handleEventClick(date)}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <p className="text-[10px] font-bold text-primary mb-0.5">
                            {format(parseISO(date), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 group-hover:text-slate-900 dark:group-hover:text-white">
                            {content}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-slate-400 italic">No events logged yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
