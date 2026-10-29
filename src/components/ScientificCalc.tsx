/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalcHistoryEntry } from '../types';
import { Delete, Trash2, History, Copy, HelpCircle } from 'lucide-react';

interface ScientificCalcProps {
  insertTrigger?: { value: string; id: number } | null;
}

export default function ScientificCalc({ insertTrigger }: ScientificCalcProps) {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isDeg, setIsDeg] = useState<boolean>(true);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<CalcHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handle value injection from the outer workspace
  React.useEffect(() => {
    if (insertTrigger) {
      setExpression(prev => prev + insertTrigger.value);
      setErrorMessage('');
    }
  }, [insertTrigger]);

  // Safe and robust math parser
  const evaluateExpression = (exprToEval: string) => {
    if (!exprToEval.trim()) return;

    // Clean up equation visual symbols
    let sanitized = exprToEval
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/\^/g, '**');

    // Balance open parenthesis if user forgot to close them
    const openCount = (sanitized.match(/\(/g) || []).length;
    const closeCount = (sanitized.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      sanitized += ')'.repeat(openCount - closeCount);
    }

    // Mathematical environment scope
    const pi = Math.PI;
    const E = Math.E;
    const degToRad = Math.PI / 180;
    const radToDeg = 180 / Math.PI;

    const sin = isDeg ? (x: number) => Math.sin(x * degToRad) : Math.sin;
    const cos = isDeg ? (x: number) => Math.cos(x * degToRad) : Math.cos;
    const tan = isDeg ? (x: number) => Math.tan(x * degToRad) : Math.tan;
    const asin = isDeg ? (x: number) => Math.asin(x) * radToDeg : Math.asin;
    const acos = isDeg ? (x: number) => Math.acos(x) * radToDeg : Math.acos;
    const atan = isDeg ? (x: number) => Math.atan(x) * radToDeg : Math.atan;

    const ln = Math.log;
    const log = Math.log10;
    const sqrt = Math.sqrt;
    const cbrt = Math.cbrt;

    try {
      // Safe dynamic function constructor
      const evaluator = new Function(
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', 'sqrt', 'cbrt', 'pi', 'E',
        `return (${sanitized});`
      );

      const computedValue = evaluator(sin, cos, tan, asin, acos, atan, ln, log, sqrt, cbrt, pi, E);

      if (typeof computedValue !== 'number' || isNaN(computedValue) || !isFinite(computedValue)) {
        throw new Error('Mathematical Error');
      }

      // Convert scientific notation smoothly if too small/large, otherwise round nicely
      const finalResult = Math.abs(computedValue) < 1e-12 && computedValue !== 0
        ? '0'
        : Number(computedValue.toPrecision(12)).toString();

      setResult(finalResult);
      setErrorMessage('');

      // Add to history
      const newEntry: CalcHistoryEntry = {
        id: Math.random().toString(36).substring(2, 9),
        expression: exprToEval,
        result: finalResult,
        timestamp: new Date(),
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 30));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Syntax Error');
      setResult('');
    }
  };

  const handleKeyPress = (btn: string) => {
    setErrorMessage('');
    if (btn === 'C') {
      setExpression('');
      setResult('');
    } else if (btn === '⌫') {
      setExpression(prev => prev.slice(0, -1));
    } else if (btn === '=') {
      evaluateExpression(expression);
    } else if (['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'ln(', 'log(', 'sqrt(', 'cbrt('].includes(btn)) {
      setExpression(prev => prev + btn);
    } else {
      setExpression(prev => prev + btn);
    }
  };

  const handleMemory = (op: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
    const currentValue = parseFloat(result || expression || '0');
    if (isNaN(currentValue)) return;

    switch (op) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setExpression(prev => prev + memory.toString());
        break;
      case 'M+':
        setMemory(prev => prev + currentValue);
        break;
      case 'M-':
        setMemory(prev => prev - currentValue);
        break;
      case 'MS':
        setMemory(currentValue);
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden" id="scientific-calc-root">
      
      {/* Calculator Main Section */}
      <div className="lg:col-span-2 flex flex-col space-y-4" id="calc-main-section">
        
        {/* Upper Screen with DEG/RAD and Memory Indicator */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative flex flex-col justify-end min-h-[140px] shadow-inner font-mono text-right" id="calc-screen">
          <div className="absolute top-3 left-3 flex items-center space-x-2 text-xs">
            <button 
              id="deg-toggle-btn"
              onClick={() => setIsDeg(!isDeg)}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                isDeg ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              DEG
            </button>
            <button 
              id="rad-toggle-btn"
              onClick={() => setIsDeg(!isDeg)}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                !isDeg ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              RAD
            </button>
            {memory !== 0 && (
              <span id="mem-indicator" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold tracking-wider uppercase text-[10px]">
                M = {Number(memory.toPrecision(6))}
              </span>
            )}
          </div>

          <button
            id="history-drawer-toggle"
            onClick={() => setShowHistory(!showHistory)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800 transition"
            title="Toggle calculation history"
          >
            <History size={16} />
          </button>

          {/* Expressions list line */}
          <div id="calc-expr-line" className="text-slate-400 text-sm md:text-base break-all max-h-[48px] overflow-y-auto mb-1 tracking-wide">
            {expression || '0'}
          </div>

          {/* Large display value */}
          <div id="calc-result-line" className="text-2xl md:text-4xl text-white font-semibold leading-normal font-mono break-all tracking-wide">
            {result ? result : '='}
          </div>

          {/* Syntax Error banner */}
          {errorMessage && (
            <div id="calc-error-banner" className="text-rose-400 text-xs text-left absolute bottom-1 left-3 font-semibold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Memory and Backspace Quick Row */}
        <div className="grid grid-cols-6 gap-2" id="calc-quick-row">
          <button id="mem-mc" onClick={() => handleMemory('MC')} className="py-2 rounded-lg bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition">MC</button>
          <button id="mem-mr" onClick={() => handleMemory('MR')} className="py-2 rounded-lg bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition">MR</button>
          <button id="mem-mplus" onClick={() => handleMemory('M+')} className="py-2 rounded-lg bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition">M+</button>
          <button id="mem-mminus" onClick={() => handleMemory('M-')} className="py-2 rounded-lg bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition">M-</button>
          <button id="mem-ms" onClick={() => handleMemory('MS')} className="py-2 rounded-lg bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition">MS</button>
          <button id="key-backspace" onClick={() => handleKeyPress('⌫')} className="py-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-400 border border-indigo-900/20 text-xs font-bold transition flex items-center justify-center">
            <Delete size={14} />
          </button>
        </div>

        {/* Buttons Grid layout */}
        <div className="grid grid-cols-5 md:grid-cols-6 gap-2" id="calc-button-grid">
          {/* Column 1: Trig / Advanced */}
          <button id="key-sin" onClick={() => handleKeyPress('sin(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">sin</button>
          <button id="key-cos" onClick={() => handleKeyPress('cos(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">cos</button>
          <button id="key-tan" onClick={() => handleKeyPress('tan(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">tan</button>
          <button id="key-pi" onClick={() => handleKeyPress('π')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-teal-400 border border-slate-800 text-xs md:text-sm font-semibold transition">π</button>
          <button id="key-e" onClick={() => handleKeyPress('E')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-teal-400 border border-slate-800 text-xs md:text-sm font-semibold transition">e</button>

          {/* Column 2: Advanced Inverse / Log */}
          <button id="key-asin" onClick={() => handleKeyPress('asin(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">asin</button>
          <button id="key-acos" onClick={() => handleKeyPress('acos(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">acos</button>
          <button id="key-atan" onClick={() => handleKeyPress('atan(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">atan</button>
          <button id="key-open-paren" onClick={() => handleKeyPress('(')} className="py-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs md:text-sm font-semibold transition">(</button>
          <button id="key-close-paren" onClick={() => handleKeyPress(')')} className="py-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs md:text-sm font-semibold transition">)</button>

          {/* Column 3: Exponential / Radicals */}
          <button id="key-ln" onClick={() => handleKeyPress('ln(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">ln</button>
          <button id="key-log" onClick={() => handleKeyPress('log(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">log₁₀</button>
          <button id="key-sqrt" onClick={() => handleKeyPress('sqrt(')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">√</button>
          <button id="key-square" onClick={() => handleKeyPress('^2')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">x²</button>
          <button id="key-power" onClick={() => handleKeyPress('^')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs md:text-sm font-semibold transition">xʸ</button>

          {/* Numbers: 7, 8, 9, ÷, C */}
          <button id="key-num-7" onClick={() => handleKeyPress('7')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">7</button>
          <button id="key-num-8" onClick={() => handleKeyPress('8')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">8</button>
          <button id="key-num-9" onClick={() => handleKeyPress('9')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">9</button>
          <button id="key-op-divide" onClick={() => handleKeyPress('÷')} className="py-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-400 border border-indigo-900/15 text-lg font-bold transition">÷</button>
          <button id="key-clear" onClick={() => handleKeyPress('C')} className="py-3 rounded-xl bg-rose-955/40 hover:bg-rose-900/40 text-rose-400 border border-rose-900/15 text-sm font-bold transition">C</button>

          {/* Numbers: 4, 5, 6, × */}
          <button id="key-num-4" onClick={() => handleKeyPress('4')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">4</button>
          <button id="key-num-5" onClick={() => handleKeyPress('5')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">5</button>
          <button id="key-num-6" onClick={() => handleKeyPress('6')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">6</button>
          <button id="key-op-multiply" onClick={() => handleKeyPress('×')} className="py-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-400 border border-indigo-900/15 text-lg font-bold transition">×</button>
          <div className="hidden md:block py-3"></div> {/* spacer on large screens */}

          {/* Numbers: 1, 2, 3, - */}
          <button id="key-num-1" onClick={() => handleKeyPress('1')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">1</button>
          <button id="key-num-2" onClick={() => handleKeyPress('2')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">2</button>
          <button id="key-num-3" onClick={() => handleKeyPress('3')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">3</button>
          <button id="key-op-subtract" onClick={() => handleKeyPress('-')} className="py-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-400 border border-indigo-900/15 text-lg font-bold transition">-</button>
          <div className="hidden md:block py-3"></div> {/* spacer on large screens */}

          {/* Numbers: 0, ., =, + */}
          <button id="key-num-0" onClick={() => handleKeyPress('0')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-base font-medium transition">0</button>
          <button id="key-decimal" onClick={() => handleKeyPress('.')} className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 text-white border border-slate-800 text-lg font-medium transition">.</button>
          <button id="key-equals" onClick={() => handleKeyPress('=')} className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 text-lg font-bold transition md:col-span-2 col-span-1">=</button>
          <button id="key-op-add" onClick={() => handleKeyPress('+')} className="py-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-400 border border-indigo-900/15 text-lg font-bold transition">+</button>
        </div>

        <div className="text-slate-500 text-[11px] flex justify-between px-1" id="calc-hint">
          <span>* Paren elements are auto-closed during evaluation</span>
          <span>Press constants to insert values</span>
        </div>
      </div>

      {/* History and Quick Guides Side Section */}
      <div className={`flex flex-col space-y-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 ${showHistory ? 'block' : 'hidden lg:flex'}`} id="calc-sidebar">
        <div className="flex items-center justify-between" id="calc-sidebar-header">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-indigo-400 flex items-center gap-2">
            <History size={16} /> History Log
          </h3>
          {history.length > 0 && (
            <button 
              id="clear-history-btn" 
              onClick={() => setHistory([])}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1 text-[11px] font-semibold border border-transparent hover:border-rose-950/30 px-2 py-0.5 rounded transition"
            >
              <Trash2 size={12} /> Clear Log
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto max-h-[300px] lg:max-h-[352px] space-y-2 pr-2" id="calc-history-list">
          {history.length === 0 ? (
            <div className="h-48 flex flex-col justify-center items-center text-center text-slate-500" id="empty-history-visual">
              <History size={28} className="text-slate-700 mb-2 stroke-1" />
              <p className="text-xs">No previous calculations</p>
              <p className="text-[10px] text-slate-600 mt-1">Calculations in this tab will appear here</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-950/65 border border-slate-800/70 p-3 rounded-lg flex flex-col space-y-1 hover:border-slate-700 transition duration-150 relative group"
              >
                <div className="text-slate-400 text-xs font-mono break-all line-clamp-2 pr-6">
                  {item.expression}
                </div>
                <div className="text-indigo-300 font-mono font-medium text-sm text-right break-all">
                  = {item.result}
                </div>
                <div className="absolute right-2 top-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => {
                      setExpression(item.expression);
                      setResult('');
                      setErrorMessage('');
                    }}
                    title="Load expression"
                    className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 transition"
                  >
                    <HelpCircle size={10} />
                  </button>
                  <button
                    onClick={() => {
                      setExpression(prev => prev + item.result);
                      setErrorMessage('');
                    }}
                    title="Insert result"
                    className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-850 text-indigo-400 transition font-mono text-[10px]"
                  >
                    +Res
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dynamic Formula Solver Helper Widget */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2" id="formula-quick-guide">
          <h4 className="font-semibold text-slate-300 tracking-wide">Scientific Tips</h4>
          <ul className="space-y-1.5 text-slate-400 list-disc pl-4 leading-relaxed">
            <li>Choose <span className="text-indigo-400 font-bold">DEG</span> or <span className="text-indigo-400 font-bold font-mono">RAD</span> mode at the top for trigonometric arguments.</li>
            <li>Use the constants list below to instantly insert physical constants.</li>
            <li>Operations follow standard mathematical order (PEMDAS).</li>
            <li>Click history buttons to reload equations or append solutions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
