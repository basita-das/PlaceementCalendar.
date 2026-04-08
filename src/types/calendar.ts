export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  month: string; // YYYY-MM
}

export interface CalendarRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarNote {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  content: string;
}

export type SpecialTag = 'OA' | 'Mock test' | 'Interview';

export interface SpecialEvent {
  id: string;
  date: string; // YYYY-MM-DD
  tag: SpecialTag;
  company: string;
  mode: string;
  time: string;
  review: string;
}

export interface MonthData {
  month: number;
  year: number;
  image: string;
  theme: string;
}
