import React from 'react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-slate-800/50 mt-12 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-slate-500 text-sm font-medium tracking-wide">
          made by{' '}
          <a 
            href="https://www.linkedin.com/in/basita-das-b70932316/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover transition-all duration-300 font-bold"
          >
            Basita Das
          </a>
        </p>
      </div>
    </footer>
  );
}
