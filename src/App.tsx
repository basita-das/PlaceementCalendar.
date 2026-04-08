/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import Calendar from './components/Calendar/Calendar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Goal, SpecialEvent } from './types/calendar';

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('calendar-notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('calendar-goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [specials, setSpecials] = useState<SpecialEvent[]>(() => {
    const saved = localStorage.getItem('calendar-specials');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('calendar-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('calendar-specials', JSON.stringify(specials));
  }, [specials]);

  return (
    <main className="min-h-screen">
      <Navbar 
        notes={notes} 
        goals={goals}
        setGoals={setGoals}
        specials={specials}
        onDateChange={setCurrentMonth} 
      />
      <Calendar 
        currentMonth={currentMonth} 
        setCurrentMonth={setCurrentMonth}
        notes={notes}
        setNotes={setNotes}
        goals={goals}
        setGoals={setGoals}
        specials={specials}
        setSpecials={setSpecials}
      />
      <Footer />
    </main>
  );
}
