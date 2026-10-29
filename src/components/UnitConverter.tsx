/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { UNIT_CATEGORIES, convertTemperature, TEMP_UNITS } from '../data/conversions';
import { Search, ArrowLeftRight, HelpCircle, Copy, Check, Scale, Ruler, Zap, Gauge, Activity, Flame, Waves, Thermometer } from 'lucide-react';

interface UnitConverterProps {
  onInsertValue?: (val: string) => void;
}

export default function UnitConverter({ onInsertValue }: UnitConverterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>(''); // Will initialize on category change
  const [toUnit, setToUnit] = useState<string>('');     // Will initialize on category change
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  // Map category icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ruler': return <Ruler size={18} />;
      case 'Scale': return <Scale size={18} />;
      case 'Zap': return <Zap size={18} />;
      case 'Gauge': return <Gauge size={18} />;
      case 'Activity': return <Activity size={18} />;
      case 'Flame': return <Flame size={18} />;
      case 'Waves': return <Waves size={18} />;
      default: return <HelpCircle size={18} />;
    }
  };

  // Safe category retrieval
  const category = useMemo(() => {
    return UNIT_CATEGORIES.find(c => c.id === activeCategory);
  }, [activeCategory]);

  // Set default units when category changes
  const initializedUnits = useMemo(() => {
    if (activeCategory === 'temperature') {
      return {
        from: fromUnit && TEMP_UNITS.some(u => u.symbol === fromUnit) ? fromUnit : 'C',
        to: toUnit && TEMP_UNITS.some(u => u.symbol === toUnit) ? toUnit : 'F',
        list: TEMP_UNITS
      };
    }

    if (category) {
      const units = category.units;
      const f = units[0].symbol;
      const t = units[1] ? units[1].symbol : units[0].symbol;
      return {
        from: fromUnit && units.some(u => u.symbol === fromUnit) ? fromUnit : f,
        to: toUnit && units.some(u => u.symbol === toUnit) ? toUnit : t,
        list: units
      };
    }

    return { from: '', to: '', list: [] };
  }, [category, activeCategory, fromUnit, toUnit]);

  // Handle active states of unit choice
  const selectedFrom = initializedUnits.from;
  const selectedTo = initializedUnits.to;

  // Sync state if out of bounds (can't set automatically in render to avoid state loops, so we handle internally)
  const currentFrom = selectedFrom;
  const currentTo = selectedTo;

  // Perform active conversions
  const conversionResult = useMemo(() => {
    if (isNaN(inputValue)) return 0;
    if (activeCategory === 'temperature') {
      return convertTemperature(inputValue, currentFrom, currentTo);
    }

    if (!category) return 0;
    const fromUnitObj = category.units.find(u => u.symbol === currentFrom);
    const toUnitObj = category.units.find(u => u.symbol === currentTo);

    if (!fromUnitObj || !toUnitObj) return 0;

    // Convert to base, then to target
    const baseValue = inputValue * fromUnitObj.toBase;
    return baseValue * toUnitObj.fromBase;
  }, [inputValue, currentFrom, currentTo, activeCategory, category]);

  // Complete conversion list for comparison grid
  const fullGridResults = useMemo(() => {
    if (isNaN(inputValue) || !currentFrom) return [];

    if (activeCategory === 'temperature') {
      return TEMP_UNITS.map(u => ({
        symbol: u.symbol,
        name: u.name,
        val: convertTemperature(inputValue, currentFrom, u.symbol)
      }));
    }

    if (!category) return [];
    const fromUnitObj = category.units.find(u => u.symbol === currentFrom);
    if (!fromUnitObj) return [];

    const baseValue = inputValue * fromUnitObj.toBase;

    return category.units.map(u => ({
      symbol: u.symbol,
      name: u.name,
      val: baseValue * u.fromBase
    }));
  }, [inputValue, currentFrom, activeCategory, category]);

  const handleSwapUnits = () => {
    const temp = currentFrom;
    setFromUnit(currentTo);
    setToUnit(temp);
  };

  const handleCopyGrid = (sym: string, val: number) => {
    navigator.clipboard.writeText(val.toString());
    setCopiedUnit(sym);
    setTimeout(() => setCopiedUnit(null), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col space-y-6" id="unit-converter-root">
      
      {/* Category selector slider/grids */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="converters-header-block">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">Multi-Dimensional Unit Converter</h2>
          <p className="text-slate-400 text-sm">Convert dimensional quantities instantly with automatic scales comparison.</p>
        </div>
      </div>

      {/* Categories Selector Carousel Bar */}
      <div className="flex overflow-x-auto gap-2 pb-2 -mx-2 px-2 scrollbar-none" id="converter-categories-bar">
        {UNIT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`converter-cat-${cat.id}`}
            onClick={() => {
              setActiveCategory(cat.id);
              setFromUnit('');
              setToUnit('');
            }}
            className={`flex items-center space-x-2 shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition border ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border-indigo-500'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border-slate-800/80 hover:text-slate-100'
            }`}
          >
            {getCategoryIcon(cat.icon)}
            <span>{cat.name}</span>
          </button>
        ))}

        {/* Custom entry for Temperature offsets */}
        <button
          key="temperature"
          id="converter-cat-temperature"
          onClick={() => {
            setActiveCategory('temperature');
            setFromUnit('C');
            setToUnit('F');
          }}
          className={`flex items-center space-x-2 shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition border ${
            activeCategory === 'temperature'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 border-indigo-500'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border-slate-800/80 hover:text-slate-100'
          }`}
        >
          <Thermometer size={18} />
          <span>Temperature Scale</span>
        </button>
      </div>

      {/* Main Responsive Converter Widget */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center" id="converter-dual-panel">
        
        {/* Source Unit Panel */}
        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3" id="convert-from-box">
          <label id="convert-from-lbl" className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">From (Source)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="converter-input-val"
              value={isNaN(inputValue) ? '' : inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value))}
              placeholder="Enter numeric quantity..."
              className="flex-1 min-w-0 bg-transparent border-none text-2xl font-bold text-white focus:outline-none focus:ring-0 select-all font-mono"
            />
            <select
              id="converter-select-from"
              value={currentFrom}
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 transition duration-150"
            >
              {initializedUnits.list.map((u) => (
                <option key={u.symbol} value={u.symbol}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button Column */}
        <div className="md:col-span-1 flex justify-center py-2 md:py-0" id="converter-swap-panel">
          <button
            id="converter-swap-btn"
            onClick={handleSwapUnits}
            className="p-3 bg-slate-950 hover:bg-slate-850 text-indigo-400 hover:text-indigo-300 border border-slate-800/80 hover:border-slate-700 rounded-xl transition duration-150 hover:scale-105 active:scale-95 shadow-lg"
            title="Swap source and target units"
          >
            <ArrowLeftRight size={18} className="rotate-90 md:rotate-0" />
          </button>
        </div>

        {/* Target Unit Panel */}
        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3" id="convert-to-box">
          <div className="flex justify-between items-center">
            <label id="convert-to-lbl" className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">To (Result)</label>
            {onInsertValue && (
              <button
                onClick={() => onInsertValue(conversionResult.toString())}
                className="text-[10px] text-indigo-400 font-bold hover:underline"
                title="Send output result to scientific calculator"
              >
                + Inject Result
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 min-w-0 text-2xl font-mono font-bold text-indigo-300 select-all py-1 break-all">
              {Number(conversionResult.toPrecision(10))}
            </div>
            <select
              id="converter-select-to"
              value={currentTo}
              onChange={(e) => setToUnit(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 transition duration-150"
            >
              {initializedUnits.list.map((u) => (
                <option key={u.symbol} value={u.symbol}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complete Comparisons Grid Reference Section */}
      <div className="space-y-3 border-t border-slate-800/80 pt-6" id="comparison-grid-sec">
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-indigo-400">All Equivalent Scaled Values</h3>
          <p className="text-xs text-slate-500">Quickly refer to computed parameters across all standard measurements in this dimension.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" id="comparison-grid">
          {fullGridResults.map((u) => (
            <div
              key={u.symbol}
              className={`border rounded-xl p-3 flex flex-col justify-between space-y-2 transition relative group ${
                u.symbol === currentTo
                  ? 'bg-slate-950 border-indigo-500/30 shadow'
                  : 'bg-slate-950/40 border-slate-800/70 hover:border-slate-700'
              }`}
              id={`conversion-grid-cell-${u.symbol}`}
            >
              {/* Variable Symbol Header */}
              <div className="flex justify-between items-center text-[10px]" id={`grid-hdr-${u.symbol}`}>
                <span className="font-semibold text-slate-500 truncate mr-2" id={`grid-lbl-${u.symbol}`}>{u.name}</span>
                <span className="font-bold text-slate-400 uppercase font-mono px-1 bg-slate-900 border border-slate-800 rounded">{u.symbol}</span>
              </div>

              {/* Exact converted value block */}
              <div className="font-mono text-[13px] text-white font-semibold flex items-center justify-between min-w-0" id={`grid-val-${u.symbol}`}>
                <span className="truncate pr-4 select-all" title={u.val.toString()}>
                  {Math.abs(u.val) < 1e-6 || Math.abs(u.val) > 1e6
                    ? Number(u.val.toPrecision(6)).toExponential()
                    : Number(u.val.toPrecision(7))}
                </span>
                {/* Actions overlay */}
                <div className="flex space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleCopyGrid(u.symbol, u.val)}
                    className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                    title="Copy value"
                  >
                    {copiedUnit === u.symbol ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
