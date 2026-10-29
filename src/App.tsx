/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import ScientificCalc from './components/ScientificCalc';
import ConstantsReference from './components/ConstantsReference';
import FormulaSolver from './components/FormulaSolver';
import UnitConverter from './components/UnitConverter';
import { Calculator, Compass, Scale, Clock, Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'formulas' | 'converter'>('calc');
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Trigger object passed to ScientificCalc to append values/constants
  const [insertTrigger, setInsertTrigger] = useState<{ value: string; id: number } | null>(null);

  useEffect(() => {
    // Elegant laboratory laboratory timer representation updating once per second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInsertValue = (val: string) => {
    setInsertTrigger({ value: val, id: Math.random() });
    // Auto-toggle tab back to calculator so user sees the insertion immediately!
    if (activeTab !== 'calc') {
      setActiveTab('calc');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-white" id="app-root">
      
      {/* Sleek Lab Console Header */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur" id="app-header">
        <div id="header-container" className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3.5" id="brand-block">
            <div className="p-2.5 bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 rounded-xl shadow-inner shadow-indigo-600/5 rotate-3 hover:rotate-0 transition duration-150">
              <Cpu size={22} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight font-display flex items-center gap-2">
                Engineering Computational Unit <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-900/10">v4.2</span>
              </h1>
              <p className="text-slate-400 text-xs font-medium">Specialized workspace for multi-discipline equations, constants, and unit scales simulation.</p>
            </div>
          </div>

          {/* Telemetry and System status clocks (strictly static human labels) */}
          <div className="flex items-center space-x-6 text-xs font-mono text-slate-500" id="telemetry-block">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-slate-600 uppercase font-semibold">Engine Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> CLIENT ACTIVE
              </span>
            </div>
            <div className="flex flex-col sm:text-right">
              <span className="text-[10px] text-slate-600 uppercase font-semibold">System Time</span>
              <span className="text-slate-300 font-semibold flex items-center gap-1"><Clock size={12} /> {currentTime || 'Loading...'}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Primary tab switches and control center */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-6" id="app-main">
        
        {/* Workspace Tab Bar selectors */}
        <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-1.5 rounded-2xl" id="tab-controls">
          <div className="flex flex-wrap gap-2" id="tab-chips">
            <button
              id="tab-btn-calc"
              onClick={() => setActiveTab('calc')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                activeTab === 'calc'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Calculator size={16} />
              <span>Standard Workspace</span>
            </button>
            
            <button
              id="tab-btn-formulas"
              onClick={() => setActiveTab('formulas')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                activeTab === 'formulas'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Compass size={16} />
              <span>Formula Solver Library</span>
            </button>

            <button
              id="tab-btn-converter"
              onClick={() => setActiveTab('converter')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                activeTab === 'converter'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Scale size={16} />
              <span>Unit Scales Converter</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-1 px-3 py-1 font-mono text-[10px] text-zinc-500 bg-slate-950 border border-slate-850 rounded-xl" id="workspace-badge">
            <Terminal size={11} /> <span>MATHS_ENV_ISOLATED</span>
          </div>
        </div>

        {/* Workspace Display Grid */}
        <div id="workspace-displays-panel">
          {activeTab === 'calc' && (
            <div className="flex flex-col space-y-6" id="calc-workspace">
              {/* Scientific Calculator with nested log history */}
              <ScientificCalc insertTrigger={insertTrigger} />
              
              {/* Constants Database nested at the base of standard workspace for layout cohesion */}
              <ConstantsReference onInsertValue={handleInsertValue} />
            </div>
          )}

          {activeTab === 'formulas' && (
            <div id="formulas-workspace">
              <FormulaSolver onInsertValue={handleInsertValue} />
            </div>
          )}

          {activeTab === 'converter' && (
            <div id="converter-workspace">
              <UnitConverter onInsertValue={handleInsertValue} />
            </div>
          )}
        </div>

      </main>

      {/* Technical footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950 py-6" id="app-footer">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600" id="footer-container">
          <p id="copyright-para">Designed and compiled off-grid. Free-standing physical calculation workspace.</p>
          <div className="flex items-center space-x-4 font-mono" id="engine-tags">
            <span>FLOAT_REPRESENT_LIMIT_12</span>
            <span>·</span>
            <span>PEMDAS_PARSE_ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
