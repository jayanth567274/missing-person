import React, { useState } from 'react';
import { Header } from './components/Header';
import { MissingPersonForm } from './components/MissingPersonForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { CaseHistory } from './components/CaseHistory';
import { AppState, MissingPersonData, AnalysisResult, CaseRecord } from './types';
import { analyzeCase } from './services/geminiService';
import { AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.INPUT);
  const [formData, setFormData] = useState<MissingPersonData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<CaseRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: MissingPersonData) => {
    setFormData(data);
    setView(AppState.ANALYZING);
    setError(null);

    try {
      const result = await analyzeCase(data);
      setAnalysisResult(result);
      
      // Add to history
      const newRecord: CaseRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        data: data,
        result: result
      };
      
      setHistory(prev => [newRecord, ...prev]);
      setView(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze case. Please ensure your API key is valid and try again.");
      setView(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setFormData(null);
    setAnalysisResult(null);
    setView(AppState.INPUT);
    setError(null);
  };

  const handleSelectCase = (record: CaseRecord) => {
    setFormData(record.data);
    setAnalysisResult(record.result);
    setView(AppState.RESULTS);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Header 
        onNewSearch={resetApp} 
        onHistory={() => setView(AppState.HISTORY)}
        caseCount={history.length}
      />
      
      <main className="container mx-auto px-4 py-8">
        
        {view === AppState.INPUT && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Intelligent Search & Recovery</h2>
              <p className="text-slate-600">
                Deploying advanced generative AI to analyze biometrics, predict movement, and cross-reference public datasets to accelerate missing person investigations.
              </p>
            </div>
            <MissingPersonForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {view === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
             <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
             <h3 className="text-xl font-semibold text-slate-700">Analyzing Case Data...</h3>
             <div className="max-w-md w-full space-y-2">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 animate-progress origin-left"></div>
                </div>
                <p className="text-xs text-center text-slate-500">Querying Geospatial Data • Processing Biometrics • Predicting Vectors</p>
             </div>
          </div>
        )}

        {view === AppState.RESULTS && formData && analysisResult && (
          <AnalysisDashboard 
            data={formData} 
            result={analysisResult} 
            onReset={resetApp} 
          />
        )}

        {view === AppState.HISTORY && (
          <CaseHistory 
            history={history} 
            onSelectCase={handleSelectCase} 
          />
        )}

        {view === AppState.ERROR && (
           <div className="max-w-md mx-auto bg-red-50 p-6 rounded-lg border border-red-200 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-800 mb-2">System Error</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={() => setView(AppState.INPUT)}
                className="bg-white border border-red-300 text-red-700 px-4 py-2 rounded hover:bg-red-50 transition-colors"
              >
                Return to Dashboard
              </button>
           </div>
        )}

      </main>

      <footer className="bg-slate-900 text-slate-500 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-xs">
          <p className="mb-2">SENTINELS SYSTEM v1.0 • RESTRICTED ACCESS</p>
          <p>
            DISCLAIMER: This is a demonstration of AI capabilities. 
            All "potential matches" are simulated by the AI. 
            Do not use for real-life emergencies. In an emergency, call 911 immediately.
          </p>
        </div>
      </footer>
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
