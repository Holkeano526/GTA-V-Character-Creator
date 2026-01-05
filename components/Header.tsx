
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/20">
            <span className="text-slate-900 font-black text-xl">V</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">
              Character <span className="text-yellow-400">Creator</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">GTA V RAGE ENGINE EMULATOR</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-widest">
            Powered by Gemini 2.5 Flash
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
