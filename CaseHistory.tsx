import React from 'react';
import { CaseRecord } from '../types';
import { Clock, MapPin, User, FileText, ChevronRight, Activity, Database } from 'lucide-react';

interface Props {
  history: CaseRecord[];
  onSelectCase: (record: CaseRecord) => void;
}

export const CaseHistory: React.FC<Props> = ({ history, onSelectCase }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
        <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700">Registry Empty</h3>
        <p className="text-slate-500 mt-2">No active investigations in the current session.</p>
      </div>
    );
  }

  // Calculate stats
  const totalCases = history.length;
  const highConfidenceMatches = history.filter(h => h.result.potentialMatches.some(m => m.confidence > 80)).length;

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Total Operations</p>
            <p className="text-2xl font-bold text-slate-800">{totalCases}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-full">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">High Probability Hits</p>
            <p className="text-2xl font-bold text-slate-800">{highConfidenceMatches}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
           <div className="p-3 bg-purple-50 rounded-full">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Latest Update</p>
            <p className="text-sm font-semibold text-slate-800">
              {new Date(history[0].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Database className="w-5 h-5 text-slate-500" />
        Case Registry
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((record) => {
          const topMatch = record.result.potentialMatches.sort((a, b) => b.confidence - a.confidence)[0];
          
          return (
            <div 
              key={record.id} 
              onClick={() => onSelectCase(record)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden flex"
            >
              {/* Image Section */}
              <div className="w-32 h-auto bg-slate-100 relative shrink-0">
                {record.data.image ? (
                  <img 
                    src={URL.createObjectURL(record.data.image)} 
                    alt="Subject" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-300" />
                  </div>
                )}
                {topMatch && topMatch.confidence > 80 && (
                   <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                     MATCH FOUND
                   </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start">
                     <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                       {record.data.name}
                     </h4>
                     <span className="text-xs text-slate-400 font-mono">
                       #{record.id.slice(-6).toUpperCase()}
                     </span>
                   </div>
                   
                   <div className="mt-2 space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {record.data.lastKnownLocation}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {new Date(record.data.lastSeenDate).toLocaleDateString()}
                      </p>
                   </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Top Lead:</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        (topMatch?.confidence || 0) > 75 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {topMatch ? `${topMatch.confidence}%` : 'N/A'}
                      </span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};