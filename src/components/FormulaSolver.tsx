/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { FORMULAS } from '../data/formulas';
import { Formula, EngineeringCategory } from '../types';
import { Search, Info, Settings, Compass, Calculator, Sparkles } from 'lucide-react';

interface FormulaSolverProps {
  onInsertValue?: (val: string) => void;
}

export default function FormulaSolver({ onInsertValue }: FormulaSolverProps) {
  const [selectedCategory, setSelectedCategory] = useState<EngineeringCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFormulaId, setActiveFormulaId] = useState<string>(FORMULAS[0].id);

  // Solvers track inputs individually per formula
  const [formulaInputs, setFormulaInputs] = useState<Record<string, Record<string, number>>>(() => {
    const initial: Record<string, Record<string, number>> = {};
    FORMULAS.forEach((f) => {
      const vars: Record<string, number> = {};
      f.variables.forEach((v) => {
        vars[v.symbol] = v.defaultValue;
      });
      initial[f.id] = vars;
    });
    return initial;
  });

  // Track the target variable we are currently solving for per formula
  const [formulaTargets, setFormulaTargets] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    FORMULAS.forEach((f) => {
      initial[f.id] = f.variables[0].symbol; // default to first variable as solution target
    });
    return initial;
  });

  // Find active formula
  const activeFormula = useMemo(() => {
    return FORMULAS.find((f) => f.id === activeFormulaId) || FORMULAS[0];
  }, [activeFormulaId]);

  // Handle value modifications
  const handleInputChange = (formulaId: string, symbol: string, value: number) => {
    setFormulaInputs((prev) => ({
      ...prev,
      [formulaId]: {
        ...prev[formulaId],
        [symbol]: value,
      },
    }));
  };

  const setSolveTarget = (formulaId: string, symbol: string) => {
    setFormulaTargets((prev) => ({
      ...prev,
      [formulaId]: symbol,
    }));
  };

  // Filter formulas
  const filteredFormulas = FORMULAS.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get active inputs for current formula
  const currentInputs = formulaInputs[activeFormula.id] || {};
  const currentTarget = formulaTargets[activeFormula.id] || activeFormula.variables[0].symbol;

  // Solve target output
  const solvedResult = useMemo(() => {
    try {
      return activeFormula.solve(currentInputs, currentTarget);
    } catch {
      return 0; // fallback safe
    }
  }, [currentInputs, currentTarget, activeFormula]);

  // Sync result if calculated value can be saved in inputs
  // Note: we calculate dynamically, so to avoid loops we don't save back to state directly.
  // Instead, the display uses solvedResult for the target variable.
  const getVariableDisplayValue = (symbol: string) => {
    if (symbol === currentTarget) {
      return solvedResult;
    }
    return currentInputs[symbol] ?? 0;
  };

  // Render SVG diagrams based on current active inputs
  const renderInteractiveDiagram = () => {
    const inputs = currentInputs;
    
    switch (activeFormula.diagramType) {
      case 'beam': {
        const delta = getVariableDisplayValue('δ') * 1000; // Deflection in mm
        const P = getVariableDisplayValue('P');
        const L = getVariableDisplayValue('L');
        
        // Exaggerate bending offset slightly for display
        const bendOffset = Math.min(Math.max((delta / 20) * 15, 0), 45); 
        
        return (
          <div className="flex flex-col space-y-2 text-center" id="diag-beam-panel">
            <svg viewBox="0 0 400 180" className="w-full bg-slate-950 border border-slate-800 rounded-xl max-h-[220px]" id="beam-svg">
              {/* Title & info text overlay */}
              <text x="20" y="30" fill="#94a3b8" className="text-[11px] font-mono leading-none">Beam Center Deflection Profile</text>
              <text x="20" y="48" fill="#6366f1" className="text-xs font-bold leading-none">Span L = {L.toFixed(2)} m | Force P = {P.toFixed(0)} N</text>

              {/* Supports */}
              <polygon points="50,110 40,130 60,130" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
              <polygon points="350,110 340,130 360,130" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
              <line x1="30" y1="130" x2="370" y2="130" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />

              {/* Bending profile path */}
              <path 
                d={`M 50,110 Q 200,${110 + bendOffset} 350,110`} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />

              {/* Original neutral axis dashed line for contrast */}
              <line x1="50" y1="110" x2="350" y2="110" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

              {/* Downward force Vector block */}
              <g transform={`translate(200, 70)`}>
                <line x1="0" y1="-25" x2="0" y2={15 + bendOffset / 2} stroke="#f43f5e" strokeWidth="3.5" markerEnd="url(#arrow)" />
                <text x="10" y="-12" fill="#f43f5e" className="text-[10px] font-extrabold font-mono font-display">P</text>
              </g>

              {/* Deflection δ label */}
              {bendOffset > 2 && (
                <g transform={`translate(200, ${110 + bendOffset / 1.5})`}>
                  <line x1="0" y1="-5" x2="0" y2="15" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1 1" />
                  <text x="8" y="5" fill="#38bdf8" className="text-[10px] font-mono font-bold">δ = {delta.toFixed(2)} mm</text>
                </g>
              )}

              {/* Definitions for arrow markers */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
              </defs>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">Deflection exaggerated vertically for mechanical visualization.</span>
          </div>
        );
      }
      case 'resonant': {
        const f0 = getVariableDisplayValue('f₀');
        const L = getVariableDisplayValue('L') * 1000; // mH
        const C = getVariableDisplayValue('C') * 1000000; // uF

        return (
          <div className="flex flex-col space-y-2 text-center" id="diag-resonant-panel">
            <svg viewBox="0 0 400 180" className="w-full bg-slate-950 border border-slate-800 rounded-xl max-h-[220px]" id="resonant-svg">
              <text x="20" y="30" fill="#94a3b8" className="text-[11px] font-mono leading-none">Ideal LC Parallel Circuit Schematic</text>
              <text x="20" y="48" fill="#14b8a6" className="text-xs font-bold leading-none">Target Resonance f₀ = {f0.toFixed(2)} Hz</text>

              {/* Wire lines */}
              <path d="M 80,90 H 130" stroke="#475569" strokeWidth="2.5" />
              <path d="M 270,90 H 320" stroke="#475569" strokeWidth="2.5" />
              <path d="M 130,50 V 130" stroke="#475569" strokeWidth="2.5" />
              <path d="M 270,50 V 130" stroke="#475569" strokeWidth="2.5" />

              {/* Upper parallel wire (inductor loop branch) */}
              <path d="M 130,50 H 180" stroke="#14b8a6" strokeWidth="2.5" />
              {/* Inductor coil */}
              <path d="M 180,50 Q 185,42 190,50 Q 195,42 200,50 Q 205,42 210,50 Q 215,42 220,50" fill="none" stroke="#14b8a6" strokeWidth="3" />
              <path d="M 220,50 H 270" stroke="#14b8a6" strokeWidth="2.5" />
              <text x="180" y="37" fill="#14b8a6" className="text-[10px] font-mono font-bold">L = {L.toFixed(1)} mH</text>

              {/* Lower parallel wire (capacitor branch) */}
              <path d="M 130,130 H 195" stroke="#0ea5e9" strokeWidth="2.5" />
              {/* Capacitor plates */}
              <line x1="195" y1="115" x2="195" y2="145" stroke="#0ea5e9" strokeWidth="3.5" />
              <line x1="205" y1="115" x2="205" y2="145" stroke="#0ea5e9" strokeWidth="3.5" />
              <path d="M 205,130 H 270" stroke="#0ea5e9" strokeWidth="2.5" />
              <text x="182" y="160" fill="#0ea5e9" className="text-[10px] font-mono font-bold">C = {C.toFixed(2)} µF</text>

              {/* Source excitation signals */}
              <circle cx="80" cy="90" r="4" fill="#64748b" />
              <circle cx="320" cy="90" r="4" fill="#64748b" />
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">Reactances cancel perfectly at peak resonance.</span>
          </div>
        );
      }
      case 'rc': {
        const tau = getVariableDisplayValue('τ');
        const R = getVariableDisplayValue('R');
        const C = getVariableDisplayValue('C');
        const totalTime = tau * 5;

        // Generate points for charging Curve (V = V0 * (1 - e^-t/tau))
        const points: string[] = [];
        for (let i = 0; i <= 60; i++) {
          const t = (i / 60) * totalTime;
          const pct = 1 - Math.exp(-t / tau);
          const x = 70 + (i / 60) * 280;
          const y = 140 - pct * 90;
          points.push(`${x},${y}`);
        }

        const tauX = 70 + (tau / totalTime) * 280;
        const tauY = 140 - (1 - Math.exp(-1)) * 90;

        return (
          <div className="flex flex-col space-y-2 text-center" id="diag-rc-panel">
            <svg viewBox="0 0 400 180" className="w-full bg-slate-950 border border-slate-800 rounded-xl max-h-[220px]" id="rc-svg">
              <text x="20" y="25" fill="#94a3b8" className="text-[11px] font-mono leading-none">Capacitor Voltage (V) vs Time (t) Curve</text>
              <text x="20" y="42" fill="#818cf8" className="text-xs font-bold leading-none">Constant τ = {tau.toExponential(4)} s (R·C)</text>

              {/* Grid axes */}
              <line x1="70" y1="40" x2="70" y2="140" stroke="#334155" strokeWidth="1.5" />
              <line x1="70" y1="140" x2="360" y2="140" stroke="#334155" strokeWidth="1.5" />
              <text x="60" y="43" fill="#475569" className="text-[9px] font-mono">V₀</text>
              <text x="355" y="152" fill="#475569" className="text-[9px] font-mono">t</text>

              {/* Charging Curve Path */}
              <path d={`M ${points.join(' ')}`} fill="none" stroke="#818cf8" strokeWidth="3" />

              {/* Tau Intersection point */}
              <line x1={tauX} y1="140" x2={tauX} y2={tauY} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="70" y1={tauY} x2={tauX} y2={tauY} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={tauX} cy={tauY} r="4" fill="#f43f5e" />
              <text x={tauX + 6} y={tauY - 10} fill="#f43f5e" className="text-[9px] font-bold font-mono">63.2% V₀ (τ)</text>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">Shows steady-state charge timeline over 5 time constants.</span>
          </div>
        );
      }
      case 'reynolds': {
        const Re = getVariableDisplayValue('Re');
        const v = getVariableDisplayValue('v');
        const isTurbulent = Re > 4000;
        const isLaminar = Re <= 2300;
        
        let flowColor = '#10b981'; // green for laminar
        let flowText = 'Laminar Flow (<2300)';
        if (Re > 2300 && Re <= 4000) {
          flowColor = '#f59e0b'; // orange for transitional
          flowText = 'Transitional Flow (2300 - 4000)';
        } else if (Re > 4000) {
          flowColor = '#f43f5e'; // red for turbulent
          flowText = 'Turbulent Flow (>4000)';
        }

        return (
          <div className="flex flex-col space-y-2 text-center" id="diag-reynolds-panel">
            <svg viewBox="0 0 400 180" className="w-full bg-slate-950 border border-slate-800 rounded-xl" id="reynolds-svg">
              <text x="20" y="30" fill="#94a3b8" className="text-[11px] font-mono leading-none">Internal Pipe Flow Pattern Visualization</text>
              <text x="20" y="48" fill={flowColor} className="text-xs font-bold leading-none">Re = {Re.toFixed(1)} ({flowText})</text>

              {/* Pipe boundaries */}
              <rect x="50" y="70" width="300" height="60" fill="none" stroke="#475569" strokeWidth="3" />

              {/* Interative Flow animations / vector tracks */}
              {isLaminar ? (
                <>
                  <line x1="60" y1="85" x2="340" y2="85" stroke={flowColor} strokeWidth="2.5" markerEnd="url(#flow-head)" />
                  <line x1="60" y1="100" x2="340" y2="100" stroke={flowColor} strokeWidth="2.5" markerEnd="url(#flow-head)" />
                  <line x1="60" y1="115" x2="340" y2="115" stroke={flowColor} strokeWidth="2.5" markerEnd="url(#flow-head)" />
                </>
              ) : Re <= 4000 ? (
                <>
                  {/* Transition waves */}
                  <path d="M 60,85 Q 130,75 200,90 T 340,85" fill="none" stroke={flowColor} strokeWidth="2.5" markerEnd="url(#flow-head)" />
                  <path d="M 60,100 Q 130,110 200,95 T 340,100" fill="none" stroke={flowColor} strokeWidth="2.5" markerEnd="url(#flow-head)" />
                  <path d="M 60,115 Q 130,120 200,110 T 340,115" fill="none" stroke={flowColor} strokeWidth="2.5" markerEnd="url(#flow-head)" />
                </>
              ) : (
                <>
                  {/* Highly chaotic spirals (turbulent) */}
                  <path d="M 60,85 C 90,65 110,135 140,85 C 170,60 190,130 220,90 C 250,60 270,125 340,85" fill="none" stroke={flowColor} strokeWidth="2.5" strokeDasharray="1 1" />
                  <path d="M 60,100 C 90,120 110,60 140,100 C 170,120 190,50 220,100 C 250,120 270,60 340,100" fill="none" stroke={flowColor} strokeWidth="2.5" />
                  <path d="M 60,115 C 90,135 110,65 140,115 C 170,130 190,70 220,115 C 250,130 270,75 340,115" fill="none" stroke={flowColor} strokeWidth="2.5" strokeDasharray="3 1" />
                </>
              )}

              <defs>
                <marker id="flow-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={flowColor} />
                </marker>
              </defs>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">Laminar flows maintain neat parallel streamlines; Turbulent flows yield mixing eddies.</span>
          </div>
        );
      }
      case 'heat': {
        const k = getVariableDisplayValue('k');
        const dT = getVariableDisplayValue('ΔT');
        const L = getVariableDisplayValue('L') * 100; // cm

        return (
          <div className="flex flex-col space-y-2 text-center" id="diag-heat-panel">
            <svg viewBox="0 0 400 180" className="w-full bg-slate-950 border border-slate-800 rounded-xl" id="heat-svg">
              <text x="20" y="30" fill="#94a3b8" className="text-[11px] font-mono leading-none">Steady-State Thermal Heat Transfer Gradients</text>
              <text x="20" y="48" fill="#fb923c" className="text-xs font-bold leading-none">Thermal Conductivity k = {k.toFixed(1)} W/(m·K) | L = {L.toFixed(1)} cm</text>

              {/* Conducting body representing heat flux */}
              <defs>
                <linearGradient id="heat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Solid Slab */}
              <rect x="110" y="65" width="180" height="70" fill="url(#heat-gradient)" stroke="#475569" strokeWidth="2.5" />

              {/* Labels on sides */}
              <text x="50" y="105" fill="#f97316" className="text-xs font-bold font-mono">HOT ({dT}°C)</text>
              <text x="310" y="105" fill="#38bdf8" className="text-xs font-bold font-mono">COLD (0°)</text>

              {/* Energy Flux Vector Arrows */}
              <path d="M 140,100 H 250" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="5 2" markerEnd="url(#heat-vector-head)" />
              <text x="180" y="93" fill="#ffffff" className="text-[10px] font-bold font-mono">Heat flux (q)</text>

              <defs>
                <marker id="heat-vector-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" />
                </marker>
              </defs>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">Gradual temperature drop across the thickness L of conducting material.</span>
          </div>
        );
      }
      case 'gas': {
        const P = getVariableDisplayValue('P');
        const V = getVariableDisplayValue('V');
        const T = getVariableDisplayValue('T');

        // Container volume width based on inputs
        const minW = 100;
        const maxW = 280;
        const width = minW + (V / 0.1) * (maxW - minW);
        const containerW = Math.min(Math.max(width, minW), maxW);

        // Particle speed based on Temperature
        const particleCount = 15;
        const pxOffset = (T / 500) * 8; // dummy visualization speed placeholder

        return (
          <div className="flex flex-col space-y-2 text-center" id="diag-gas-panel">
            <svg viewBox="0 0 400 180" className="w-full bg-slate-950 border border-slate-800 rounded-xl" id="gas-svg">
              <text x="20" y="30" fill="#94a3b8" className="text-[11px] font-mono leading-none">Thermodynamic Piston Chamber Volume</text>
              <text x="20" y="48" fill="#e2e8f0" className="text-xs font-bold leading-none">P = {(P/1000).toFixed(1)} kPa | T = {T.toFixed(1)} K | Vol = {V.toFixed(4)} m³</text>

              {/* Container box (Back wall) */}
              <rect x="60" y="70" width="280" height="70" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="3 3" />

              {/* Piston Chamber bounds */}
              <rect x="60" y="70" width={containerW} height="70" fill="#1e293b" fillOpacity="0.30" stroke="#475569" strokeWidth="3" />

              {/* Piston Head handle */}
              <rect x={60 + containerW} y="60" width="10" height="90" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
              <line x1={70 + containerW} y1="105" x2="360" y2="105" stroke="#64748b" strokeWidth="5" />

              {/* Molecules */}
              <circle cx="75" cy="85" r="4.5" fill="#f43f5e" />
              <circle cx={60 + containerW/2} cy="95" r="4.5" fill="#f43f5e" />
              <circle cx={50 + containerW * 0.7} cy="115" r="4.5" fill="#f43f5e" />
              <circle cx="105" cy="120" r="4.5" fill="#f43f5e" />
              <circle cx={50 + containerW * 0.3} cy="100" r="4.5" fill="#f43f5e" />
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">Piston rod moves horizontally to maintain balance according to the equation P·V = n·R·T.</span>
          </div>
        );
      }
      case 'lift': {
        const L = getVariableDisplayValue('L');
        const v = getVariableDisplayValue('v');
        const Cl = getVariableDisplayValue('Cl');

        // Exaggerate vector sizes
        const liftVectorLen = Math.min(Math.max((L / 20000) * 45, 10), 85);

        return (
          <div className="flex flex-col space-y-2 text-center" id="diag-lift-panel">
            <svg viewBox="0 0 400 180" className="w-full bg-slate-950 border border-slate-800 rounded-xl" id="lift-svg">
              <text x="20" y="30" fill="#94a3b8" className="text-[11px] font-mono leading-none">Aerodynamic Airfoil Wind-Tunnel Simulation</text>
              <text x="20" y="48" fill="#38bdf8" className="text-xs font-bold leading-none">Velocity v = {v.toFixed(1)} m/s | Lift Force L = {L.toFixed(1)} N</text>

              {/* Airflow streams curving around wing */}
              <path d="M 40,80 Q 150,40 330,75" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.4" />
              <path d="M 40,95 Q 160,50 330,95" fill="none" stroke="#22d3ee" strokeWidth="2" strokeOpacity="0.7" />
              <path d="M 40,110 Q 160,115 330,115" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.4" />

              {/* Wing Airfoil Profile (NACA Shape sketch) */}
              <path d="M 120,95 C 130,75 210,75 250,95 C 220,105 160,105 120,95" fill="#334155" stroke="#94a3b8" strokeWidth="2.5" />

              {/* Lift Vector arrow */}
              <line x1="180" y1="85" x2="180" y2={85 - liftVectorLen} stroke="#fbbf24" strokeWidth="4" markerEnd="url(#lift-head)" />
              <text x="190" y={80 - liftVectorLen/2} fill="#fbbf24" className="text-[11px] font-extrabold font-mono font-display">LIFT (L)</text>

              {/* Drag Vector arrow */}
              <line x1="220" y1="92" x2="265" y2="92" stroke="#ef4444" strokeWidth="2" markerEnd="url(#drag-head)" />
              <text x="270" y="96" fill="#ef4444" className="text-[9px] font-mono font-bold">DRAG</text>

              <defs>
                <marker id="lift-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                </marker>
                <marker id="drag-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
              </defs>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">Air moving accelerated over upper camber generates low pressure zones yielding direct lift.</span>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="formula-solver-root">
      {/* Left Sidebar: Formula Library Browser */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4" id="formula-browser">
        <div id="formula-browser-header">
          <h3 className="text-sm font-bold tracking-wide uppercase text-indigo-400 flex items-center gap-2">
            <Compass size={16} /> Formula Explorer
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">Select a category and choose an equation to solve.</p>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-1.5" id="formula-category-chips">
          {['All', 'Electrical', 'Mechanical', 'Civil', 'Chemical & Aerospace'].map((cat) => (
            <button
              key={cat}
              id={`formula-cat-chip-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(cat as EngineeringCategory | 'All')}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] tracking-wide font-extrabold uppercase transition border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-950/40 hover:bg-slate-850 text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              {cat === 'Chemical & Aerospace' ? 'Chem & Aero' : cat}
            </button>
          ))}
        </div>

        {/* Mini Search */}
        <div className="relative" id="formula-browser-search-box">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search equations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition duration-150"
          />
        </div>

        {/* Filtered Formulas List row */}
        <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[300px] lg:max-h-[500px]" id="formula-browser-list">
          {filteredFormulas.map((f) => (
            <button
              key={f.id}
              id={`formula-btn-${f.id}`}
              onClick={() => setActiveFormulaId(f.id)}
              className={`w-full text-left p-3 rounded-xl transition flex flex-col space-y-1 border ${
                activeFormulaId === f.id
                  ? 'bg-indigo-950/20 border-indigo-500/40 text-white'
                  : 'bg-slate-950/20 border-transparent hover:bg-slate-955/30 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold leading-none">{f.name}</span>
                <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500">
                  {f.category === 'Chemical & Aerospace' ? 'Aero/Chem' : f.category}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{f.equationText}</span>
            </button>
          ))}
          {filteredFormulas.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-xs" id="empty-formula-browse">
              No matching equations found.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Dynamic Solvers Interface Sheet */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col space-y-6" id="formula-sheet">
        
        {/* Header Title block */}
        <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-start justify-between gap-4" id="formula-sheet-title">
          <div className="space-y-1 select-text">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400 bg-indigo-950/30 border border-indigo-900/15 px-2.5 py-1 rounded">
              {activeFormula.category} solver
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">{activeFormula.name}</h2>
            <p className="text-slate-400 text-sm">{activeFormula.description}</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-center self-start" id="formula-latex-bubble">
            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider font-semibold">Active Model</span>
            <span className="text-indigo-400 font-mono font-bold text-sm tracking-wide">{activeFormula.equationText}</span>
          </div>
        </div>

        {/* Central interactive bento layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch" id="formula-bento-layout">
          
          {/* Grid Left: Variables Configuration list */}
          <div className="space-y-4 flex flex-col justify-between" id="formula-variables-side">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wide uppercase text-indigo-400">Select Variable to Solve</h3>
                <span className="text-[10px] text-slate-500 flex items-center gap-1"><Info size={11} /> Mark the circular bullet</span>
              </div>

              <div className="space-y-2.5" id="formula-variables-inputs-list">
                {activeFormula.variables.map((v) => {
                  const isSelTarget = v.symbol === currentTarget;
                  const currentVal = getVariableDisplayValue(v.symbol);

                  return (
                    <div
                      key={v.symbol}
                      id={`var-row-${v.symbol}`}
                      className={`p-3 rounded-xl border flex items-center justify-between transition gap-4 ${
                        isSelTarget
                          ? 'bg-indigo-950/15 border-indigo-500/25 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-800'
                      }`}
                    >
                      {/* Check target checkbox and symbol */}
                      <button
                        id={`var-select-btn-${v.symbol}`}
                        onClick={() => setSolveTarget(activeFormula.id, v.symbol)}
                        className="flex items-center space-x-2.5 select-none text-left min-w-0"
                        title={`Select ${v.name} to solve for`}
                      >
                        <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-all ${
                          isSelTarget
                            ? 'border-indigo-500 bg-indigo-600'
                            : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'
                        }`}>
                          {isSelTarget && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-base font-bold font-mono text-white tracking-wide">{v.symbol}</span>
                            <span className="text-slate-400 text-[11px] truncate">{v.name}</span>
                          </div>
                        </div>
                      </button>

                      {/* Inputs field or displays value if solved target */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {isSelTarget ? (
                          <div className="font-mono text-base font-bold text-indigo-300 pr-1 select-all break-all text-right max-w-[120px] truncate" id={`solved-val-display-${v.symbol}`}>
                            {Math.abs(solvedResult) < 1e-6 || Math.abs(solvedResult) > 1e6
                              ? solvedResult.toExponential(4)
                              : Number(solvedResult.toPrecision(6))}
                          </div>
                        ) : (
                          <input
                            type="number"
                            id={`var-input-field-${v.symbol}`}
                            value={isNaN(currentInputs[v.symbol]) ? '' : currentInputs[v.symbol]}
                            onChange={(e) => handleInputChange(activeFormula.id, v.symbol, parseFloat(e.target.value))}
                            className="w-20 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white text-right focus:outline-none focus:border-indigo-500"
                          />
                        )}
                        <span className="text-[10px] text-slate-500 font-mono font-bold uppercase min-w-[28px]">{v.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions for output sending */}
            {onInsertValue && (
              <button
                id="solve-inject-btn"
                onClick={() => onInsertValue(solvedResult.toString())}
                className="w-full mt-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-xl text-xs font-semibold tracking-wide transition duration-150 flex items-center justify-center gap-1.5"
              >
                <Calculator size={14} /> Send Evaluated ({activeFormula.variables.find(v => v.symbol === currentTarget)?.symbol}) = {solvedResult.toFixed(4)} to Main Calculator
              </button>
            )}
          </div>

          {/* Grid Right: Dynamic visual illustration of the formulas components */}
          <div className="flex flex-col justify-center bg-slate-950/20 border border-slate-800/80 p-4 rounded-xl space-y-4 shadow-inner" id="formula-diagrams-side">
            <h3 className="text-xs font-bold tracking-wide uppercase text-indigo-400 flex items-center gap-1">
              <Sparkles size={14} className="stroke-1" /> Vector Graph Visualization
            </h3>
            <div className="flex-1 flex items-center justify-center min-h-[180px]">
              {renderInteractiveDiagram()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
