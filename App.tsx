
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import { transformToGTA } from './services/geminiService';
import { AppState, TransformationResult } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    transformedImage: null,
    isLoading: false,
    error: null,
    history: [],
  });
  const [prompt, setPrompt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ 
          ...prev, 
          originalImage: reader.result as string,
          transformedImage: null,
          error: null 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransform = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const resultImageUrl = await transformToGTA(state.originalImage, prompt);
      
      const newResult: TransformationResult = {
        imageUrl: resultImageUrl,
        timestamp: Date.now(),
        promptUsed: prompt || "Standard GTA Transformation",
      };

      setState(prev => ({
        ...prev,
        transformedImage: resultImageUrl,
        isLoading: false,
        history: [newResult, ...prev.history],
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Upload & Input */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-xs">1</span>
                Input Image
              </h2>
              
              <div 
                onClick={triggerFileInput}
                className={`relative group cursor-pointer border-2 border-dashed rounded-xl transition-all duration-300 overflow-hidden ${
                  state.originalImage 
                    ? 'border-slate-700 aspect-square' 
                    : 'border-slate-800 hover:border-yellow-400/50 hover:bg-slate-800/50 p-12 text-center'
                }`}
              >
                {state.originalImage ? (
                  <>
                    <img src={state.originalImage} alt="Original" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white font-medium text-sm">Click to Replace</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-yellow-400/20 group-hover:scale-110 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 group-hover:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12 a2 2 0 002-2v-1m-5-9l-5 5m0 0l-5-5m5 5V3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-300 font-medium">Select a character portrait</p>
                      <p className="text-slate-500 text-sm mt-1">PNG, JPG or WEBP supported</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-xs">2</span>
                Instructions (Optional)
              </h2>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Add a leather jacket, make him look like a mob boss, change the time of day to sunset..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 min-h-[120px] resize-none"
              />
              <button 
                onClick={handleTransform}
                disabled={!state.originalImage || state.isLoading}
                className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-yellow-400/10 active:scale-[0.98] uppercase tracking-wider"
              >
                {state.isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Simulating RAGE Engine...
                  </div>
                ) : 'Execute Transformation'}
              </button>
              
              {state.error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{state.error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl min-h-[400px] flex flex-col">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-xs">3</span>
                Render Output
              </h2>
              {state.transformedImage && (
                <a 
                  href={state.transformedImage} 
                  download="gta-character.png" 
                  className="text-xs font-bold text-yellow-400 hover:text-yellow-300 uppercase tracking-widest flex items-center gap-1"
                >
                  Download HD
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              )}
            </div>
            
            <div className="flex-1 relative flex items-center justify-center bg-slate-950 group">
              {state.transformedImage ? (
                <img 
                  src={state.transformedImage} 
                  alt="Transformed Character" 
                  className="w-full h-full object-contain p-4"
                />
              ) : state.isLoading ? (
                <div className="text-center p-8 space-y-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center text-yellow-400 font-bold">V</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm animate-pulse">Rendering Character...</p>
                    <p className="text-slate-500 text-xs max-w-[200px]">Generating high-fidelity textures and full-body skeletal geometry.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 space-y-4">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <p className="text-slate-600 text-sm font-medium">Character preview will appear here once rendering is complete.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* History Section */}
        {state.history.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white/90">
              Your <span className="text-yellow-400">Vault</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.history.map((item) => (
                <div 
                  key={item.timestamp} 
                  className="group relative aspect-square bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-yellow-400/50 transition-all shadow-lg"
                  onClick={() => setState(prev => ({ ...prev, transformedImage: item.imageUrl }))}
                >
                  <img src={item.imageUrl} alt="History item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="text-[10px] text-yellow-400 font-bold uppercase truncate">{item.promptUsed}</p>
                    <p className="text-[8px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="py-8 px-4 border-t border-slate-800 text-center text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-slate-800"></span>
            <div className="text-slate-500 font-bold italic uppercase text-xs tracking-[0.2em]">Los Santos District</div>
            <span className="h-px w-8 bg-slate-800"></span>
          </div>
          <p className="text-[10px] uppercase tracking-widest leading-loose">
            This tool uses Gemini AI to transform imagery. All renders are synthetic and intended for creative exploration.<br/>
            &copy; {new Date().getFullYear()} RAGE EMULATOR CORE.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
