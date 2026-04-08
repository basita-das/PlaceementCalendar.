import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, CheckCircle2, Circle, Edit2, X, Zap, Brain, Users, Star, Clock, Building2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { CalendarRange, Goal, SpecialEvent, SpecialTag } from '@/src/types/calendar';
import { cn } from '@/src/lib/utils';
import { SPECIAL_TAGS } from '@/src/constants/calendar';
import { Input } from '@/src/components/ui/input';
import { HoverButton } from '@/src/components/ui/hover-button';
import { motion, AnimatePresence } from 'motion/react';

interface NotesSectionProps {
  range: CalendarRange;
  notes: Record<string, string>;
  onAddNote: (date: string, content: string) => void;
  onDeleteNote: (date: string) => void;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  specials: SpecialEvent[];
  setSpecials: React.Dispatch<React.SetStateAction<SpecialEvent[]>>;
  currentMonth: Date;
  onDateChange: (date: Date) => void;
  onRangeChange: (range: CalendarRange) => void;
}

export default function NotesSection({ 
  range, 
  notes, 
  onAddNote, 
  onDeleteNote,
  goals,
  setGoals,
  specials,
  setSpecials,
  currentMonth,
  onDateChange,
  onRangeChange
}: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  // Specials Form State
  const [showSpecialForm, setShowSpecialForm] = useState<SpecialTag | null>(null);
  const [specialFormData, setSpecialFormData] = useState({
    company: '',
    mode: '',
    time: '',
    review: ''
  });
  const [editingSpecialReviewId, setEditingSpecialReviewId] = useState<string | null>(null);
  const [tempSpecialReview, setTempSpecialReview] = useState('');

  const currentMonthStr = format(currentMonth, 'yyyy-MM');
  const currentMonthGoals = goals.filter(g => g.month === currentMonthStr);

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const goal: Goal = {
        id: crypto.randomUUID(),
        text: newGoal.trim(),
        completed: false,
        month: currentMonthStr
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal('');
    }
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };
  
  const selectedDateStr = range.start ? format(range.start, 'yyyy-MM-dd') : null;
  const hasNoteForSelected = selectedDateStr ? notes[selectedDateStr] : null;
  const specialsForSelected = selectedDateStr ? specials.filter(s => s.date === selectedDateStr) : [];

  const handleAdd = () => {
    if (selectedDateStr && newNote.trim()) {
      onAddNote(selectedDateStr, newNote.trim());
      setNewNote('');
    }
  };

  const handleStartEdit = () => {
    if (hasNoteForSelected) {
      setEditContent(hasNoteForSelected);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedDateStr && editContent.trim()) {
      onAddNote(selectedDateStr, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleAddSpecial = () => {
    if (selectedDateStr && showSpecialForm) {
      const newSpecial: SpecialEvent = {
        id: crypto.randomUUID(),
        date: selectedDateStr,
        tag: showSpecialForm,
        ...specialFormData
      };
      setSpecials(prev => [...prev, newSpecial]);
      setShowSpecialForm(null);
      setSpecialFormData({ company: '', mode: '', time: '', review: '' });
    }
  };

  const handleDeleteSpecial = (id: string) => {
    setSpecials(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateSpecialReview = (id: string) => {
    setSpecials(prev => prev.map(s => s.id === id ? { ...s, review: tempSpecialReview } : s));
    setEditingSpecialReviewId(null);
  };

  useEffect(() => {
    setIsEditing(false);
    setShowSpecialForm(null);
  }, [selectedDateStr]);

  const handleLogClick = (dateStr: string) => {
    const date = parseISO(dateStr);
    onDateChange(date);
    onRangeChange({ start: date, end: null });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 sm:mb-8 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        <StickyNote className="w-5 h-5 text-primary" />
        <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white uppercase tracking-tighter">Notes</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        {/* Ruled Paper Section for Notes */}
        <div className="relative bg-[#fdfdfd] dark:bg-slate-900 rounded-lg p-4 sm:p-6 shadow-inner border border-slate-100 dark:border-slate-800 min-h-[250px] sm:min-h-[300px]">
          {/* Ruled Lines Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10" 
               style={{ 
                 backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', 
                 backgroundSize: '100% 2rem',
                 marginTop: '2.5rem'
               }} 
          />
          
          <div className="relative z-10">
            {!selectedDateStr ? (
              <div className="text-center py-12">
                <p className="text-slate-400 dark:text-slate-600 text-sm italic font-medium">
                  Select a date to jot down a memo...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">
                  {format(range.start!, 'MMM d, yyyy')}
                </p>
                
                {hasNoteForSelected ? (
                  <div className="group relative">
                    {isEditing ? (
                      <div className="space-y-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 font-sans text-sm text-slate-800 dark:text-slate-200 resize-none min-h-[150px] leading-[2rem] font-medium"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg shadow-lg shadow-primary/20 transition-all"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-sans text-sm text-slate-800 dark:text-slate-200 leading-[2rem] font-medium pr-12 whitespace-pre-wrap">
                          {hasNoteForSelected}
                        </p>
                        <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={handleStartEdit}
                            className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onDeleteNote(selectedDateStr)}
                            className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Write something..."
                      className="w-full bg-transparent border-none focus:ring-0 font-sans text-sm text-slate-800 dark:text-slate-200 resize-none min-h-[120px] sm:min-h-[150px] leading-[2rem] font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    />
                    <button
                      onClick={handleAdd}
                      disabled={!newNote.trim()}
                      className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 transition-all"
                    >
                      Save Note
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Specials Quick View & Add */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-display font-black text-slate-400 uppercase tracking-tighter">Add Placement Event</h4>
          </div>
          
          {selectedDateStr && !showSpecialForm && (
            <div className="grid grid-cols-3 gap-2">
              {SPECIAL_TAGS.map(({ tag, icon: Icon }) => (
                <button
                  key={tag}
                  onClick={() => setShowSpecialForm(tag)}
                  className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-primary/5 rounded-xl transition-all group shadow-sm"
                  aria-label={`Add ${tag}`}
                >
                  <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter group-hover:text-primary">
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showSpecialForm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border-2 border-primary shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {React.createElement(SPECIAL_TAGS.find(t => t.tag === showSpecialForm)!.icon, { className: "w-5 h-5 text-primary" })}
                  <span className="text-xs font-black text-primary uppercase tracking-widest">New {showSpecialForm}</span>
                </div>
                <button onClick={() => setShowSpecialForm(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full" aria-label="Close form">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Input 
                      label="Company"
                      value={specialFormData.company}
                      onChange={e => setSpecialFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input 
                      label="Time"
                      value={specialFormData.time}
                      onChange={e => setSpecialFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Input 
                      label="Mode"
                      value={specialFormData.mode}
                      onChange={e => setSpecialFormData(prev => ({ ...prev, mode: e.target.value }))}
                      className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input 
                      label="Review"
                      value={specialFormData.review}
                      onChange={e => setSpecialFormData(prev => ({ ...prev, review: e.target.value }))}
                      className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleAddSpecial}
                disabled={!specialFormData.company || !specialFormData.time}
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                Add to Calendar
              </button>
            </motion.div>
          )}

          {specialsForSelected.length > 0 && (
            <div className="space-y-3">
              {specialsForSelected.map(special => {
                const TagIcon = SPECIAL_TAGS.find(t => t.tag === special.tag)?.icon || Star;
                return (
                  <div key={special.id} className="group relative bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TagIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest block">{special.tag}</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{special.company}</span>
                        </div>
                        <div className="ml-auto flex gap-1">
                          <button 
                            onClick={() => {
                              setEditingSpecialReviewId(special.id);
                              setTempSpecialReview(special.review);
                            }}
                            className="p-1.5 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            aria-label="Edit review"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSpecial(special.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            aria-label="Delete event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                          <Clock className="w-3 h-3 text-primary/60" />
                          {special.time}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                          <Building2 className="w-3 h-3 text-primary/60" />
                          {special.mode}
                        </div>
                      </div>
                      
                      {editingSpecialReviewId === special.id ? (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <textarea
                            value={tempSpecialReview}
                            onChange={(e) => setTempSpecialReview(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none min-h-[80px]"
                            placeholder="Add your review..."
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateSpecialReview(special.id)}
                              className="flex-1 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg shadow-primary/20"
                            >
                              Save Review
                            </button>
                            <button
                              onClick={() => setEditingSpecialReviewId(null)}
                              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : special.review ? (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 italic leading-relaxed">
                            "{special.review}"
                          </p>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingSpecialReviewId(special.id);
                            setTempSpecialReview('');
                          }}
                          className="mt-3 w-full py-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-400 hover:border-primary hover:text-primary transition-colors"
                        >
                          + Add Review
                        </button>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Monthly Goals Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-display font-black text-slate-400 uppercase tracking-tighter">Monthly Goals</h4>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {currentMonthGoals.filter(g => g.completed).length}/{currentMonthGoals.length}
            </span>
          </div>
          
          <div className="space-y-2">
            {currentMonthGoals.map(goal => (
              <div key={goal.id} className="flex items-center justify-between group bg-white dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all">
                <button 
                  onClick={() => toggleGoal(goal.id)}
                  className="flex items-center gap-3 text-left flex-1"
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                  )}
                  <span className={cn(
                    "text-xs font-medium transition-all",
                    goal.completed ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {goal.text}
                  </span>
                </button>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input 
              type="text"
              placeholder="Add goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button 
              onClick={handleAddGoal}
              disabled={!newGoal.trim()}
              className="p-2 bg-slate-900 dark:bg-slate-800 hover:bg-primary text-white rounded-xl transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
