import React from 'react';
import { AnalysisResult, MissingPersonData } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Map, AlertTriangle, CheckCircle, ExternalLink, Navigation, Search, MapPin } from 'lucide-react';

interface Props {
  data: MissingPersonData;
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisDashboard: React.FC<Props> = ({ data, result, onReset }) => {
  const chartData = result.potentialMatches.map(m => ({
    name: m.id,
    score: m.confidence,
    source: m.source
  }));

  const getScoreColor = (score: number) => {
    if (score > 80) return '#10b981'; // green
    if (score > 50) return '#f59e0b'; // amber
    return '#64748b'; // slate
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Status */}
      <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{data.name.toUpperCase()}</h2>
          <p className="text-slate-500 flex items-center gap-1">
            <Map className="w-4 h-4" /> Last seen near: <span className="font-semibold">{data.lastKnownLocation}</span>
          </p>
        </div>
        <button onClick={onReset} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          New Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image & Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-3 border-b pb-2">Reference Image</h3>
            {data.image ? (
              <img 
                src={URL.createObjectURL(data.image)} 
                alt="Subject" 
                className="w-full h-auto rounded-lg object-cover" 
              />
            ) : (
              <div className="w-full h-64 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400">
                No Image
              </div>
            )}
             <div className="mt-4 space-y-2">
                <div className="bg-slate-50 p-3 rounded-lg text-sm">
                   <p className="font-semibold text-slate-700">AI Biometric Estimates</p>
                   <p className="text-slate-600 mt-1">{result.personOverview.estimatedBiometrics}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-sm">
                   <p className="font-semibold text-slate-700">Clothing Profile</p>
                   <p className="text-slate-600 mt-1">{result.personOverview.clothingAnalysis}</p>
                </div>
             </div>
          </div>

           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Movement Prediction
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {result.movementPrediction.prediction}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3">
              <span>Radius: {result.movementPrediction.radiusKm}km</span>
              <span>Time Delta: {result.movementPrediction.timeElapsedAnalysis}</span>
            </div>
          </div>
        </div>

        {/* Middle/Right: Intelligence & Leads */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search Leads (Using Maps Grounding) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              High Probability Search Areas (Geospatial Intelligence)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.searchLeads.map((lead, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-lg hover:bg-blue-50 transition-colors bg-slate-50">
                  <div className="flex justify-between items-start">
                     <h4 className="font-bold text-slate-700">{lead.locationName}</h4>
                     <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 border border-slate-200 px-1 rounded">{lead.type}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{lead.address}</p>
                  <p className="text-sm text-slate-600 mt-2 italic">"{lead.reason}"</p>
                </div>
              ))}
            </div>
            {result.groundingUrls.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Google Maps References:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.groundingUrls.map((url, i) => (
                      <a key={i} href={url.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:underline bg-blue-50 px-2 py-1 rounded">
                        {url.title || "View on Maps"} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
            )}
          </div>

          {/* Potential Matches */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Potential Matches (Simulated Database)
                </h3>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">DEMO DATA</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                          cursor={{fill: '#f1f5f9'}}
                        />
                        <Bar dataKey="score" barSize={20} radius={[0, 4, 4, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                          ))}
                        </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
                
                {/* Match Details List */}
                <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
                  {result.potentialMatches.map((match, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`} style={{backgroundColor: getScoreColor(match.confidence)}}>
                          {match.confidence}%
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-700 text-sm">{match.id}</h4>
                            <span className="text-xs text-slate-400">• {match.source}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{match.description}</p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                             <MapPin className="w-3 h-3" /> {match.location}
                          </p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg">
             <h3 className="font-bold text-lg mb-2">Recommended Next Steps</h3>
             <ul className="space-y-2 text-sm text-blue-100">
               <li className="flex items-start gap-2">
                 <CheckCircle className="w-4 h-4 mt-0.5 text-green-400" />
                 Dispatch field units to identified Transport Hubs listed in Geospatial Intelligence.
               </li>
               <li className="flex items-start gap-2">
                 <CheckCircle className="w-4 h-4 mt-0.5 text-green-400" />
                 Verify surveillance footage at last known location (Time: {data.lastSeenDate.replace('T', ' ')}).
               </li>
               <li className="flex items-start gap-2">
                 <CheckCircle className="w-4 h-4 mt-0.5 text-green-400" />
                 Contact the specific shelters listed in the Search Areas section with the biometric profile.
               </li>
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
};