import React from 'react';
import { Radar, Database, PlusCircle } from 'lucide-react';

interface Props {
  onNewSearch: () => void;
  onHistory: () => void;
  caseCount: number;
}

export const Header: React.FC<Props> = ({ onNewSearch, onHistory, caseCount }) => {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewSearch}>
          <div className="relative">
            <Radar className="w-8 h-8 text-blue-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-slate-100">SENTINELS</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Global Search Network</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={onNewSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            >
              <PlusCircle className="w-3 h-3" />
              New Operation
            </button>
            <div className="w-px h-4 bg-slate-700 mx-1"></div>
            <button 
              onClick={onHistory}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            >
              <Database className="w-3 h-3" />
              Registry ({caseCount})
            </button>
          </nav>
          
          <div className="hidden lg:block">
             <span className="flex items-center gap-1.5 bg-blue-950/50 text-blue-400 text-[10px] font-mono px-2 py-1 rounded border border-blue-900/50">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                SYSTEM ONLINE
             </span>
          </div>
        </div>
      </div>
    </header>
  );
};
