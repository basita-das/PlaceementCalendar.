import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { TextScramble } from '@/src/components/ui/text-scramble';

interface CalendarHeroProps {
  image: string;
  monthName: string;
}

export default function CalendarHero({ image, monthName }: CalendarHeroProps) {
  const year = new Date().getFullYear();

  return (
    <div className="relative w-full group">
      {/* Spiral Binding Visual */}
      <div className="absolute -top-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2 z-20 px-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className="w-1 h-5 sm:w-1.5 sm:h-6 bg-gradient-to-b from-slate-400 to-slate-900 rounded-full shadow-md shrink-0" 
          />
        ))}
        <div className="hidden sm:flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-6 bg-gradient-to-b from-slate-400 to-slate-900 rounded-full shadow-md shrink-0" 
            />
          ))}
        </div>
      </div>

      <div className="relative aspect-[16/9] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-t-3xl lg:rounded-tr-none shadow-2xl border-x-4 border-t-4 lg:border-t-0 border-slate-200 dark:border-slate-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={image}
              alt={monthName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Clean Month/Year Overlay */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 text-right z-10">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-white text-lg sm:text-3xl font-black tracking-tighter mb-0 sm:mb-1">
                  {year}
                </p>
                <h1 className="text-primary text-2xl sm:text-7xl font-black uppercase tracking-tighter leading-none">
                  {monthName}
                </h1>
              </motion.div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
