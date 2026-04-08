import { Zap, Brain, Users } from 'lucide-react';
import { SpecialTag } from '../types/calendar';

export const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Jan - Operating System
  "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Feb - Database
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200", // Mar - C++
  "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Apr - Web Development
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200", // May - Computer Networks
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1200", // Jun - OOPs
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200", // Jul - React js
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Aug - Docker
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200", // Sep - Microservices
  "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1200", // Oct - GitHub
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200", // Nov - API
  "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Dec - Java
];

export const SPECIAL_TAGS: { tag: SpecialTag; icon: any; color: string }[] = [
  { tag: 'OA', icon: Zap, color: 'text-yellow-500' },
  { tag: 'Mock test', icon: Brain, color: 'text-orange-500' },
  { tag: 'Interview', icon: Users, color: 'text-green-500' }
];

export const THEMES = [
  "bg-blue-50 text-blue-900 border-blue-200",
  "bg-emerald-50 text-emerald-900 border-emerald-200",
  "bg-rose-50 text-rose-900 border-rose-200",
  "bg-amber-50 text-amber-900 border-amber-200",
  "bg-indigo-50 text-indigo-900 border-indigo-200",
  "bg-teal-50 text-teal-900 border-teal-200",
  "bg-orange-50 text-orange-900 border-orange-200",
  "bg-purple-50 text-purple-900 border-purple-200",
  "bg-cyan-50 text-cyan-900 border-cyan-200",
  "bg-lime-50 text-lime-900 border-lime-200",
  "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200",
  "bg-slate-50 text-slate-900 border-slate-200",
];
