/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SCIENTIFIC_CONSTANTS } from '../data/constants';
import { ScientificConstant } from '../types';
import { Search, Copy, Check, Plus, Filter } from 'lucide-react';

interface ConstantsReferenceProps {
  onInsertValue?: (val: string) => void;
}

export default function ConstantsReference({ onInsertValue }: ConstantsReferenceProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const categories = ['All', 'Fundamental', 'Electromagnetic', 'Atomic & Nuclear', 'Physicochemical'];

  const filteredConstants = SCIENTIFIC_CONSTANTS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (constant: ScientificConstant) => {
    navigator.clipboard.writeText(constant.value.toString());
    setCopiedSymbol(constant.symbol);
    setTimeout(() => setCopiedSymbol(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col space-y-6" id="constants-ref-root">
      {/* Header and Search Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="constants-header-block">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">Scientific Constants Library</h2>
          <p className="text-slate-400 text-sm">Review precise reference constants and insert physical weights directly into equations.</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full" id="constants-search-box">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search constants (name, symbol, desc)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition duration-150"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4" id="constants-category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-chip-${cat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800/80 hover:text-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List of Constants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="constants-grid">
        {filteredConstants.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col justify-center items-center text-center text-slate-500" id="empty-constants-visual">
            <Filter size={32} className="text-slate-700 mb-2 stroke-1" />
            <p className="text-sm font-semibold">No constants matched your search query</p>
            <p className="text-xs text-slate-600 mt-1">Try resetting the standard filters or searching for alternative terms</p>
          </div>
        ) : (
          filteredConstants.map((constant) => (
            <div
              key={constant.symbol}
              className="bg-slate-950/40 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between space-y-4 transition duration-150 group shadow-sm hover:shadow-md"
              id={`constant-card-${constant.symbol.replace(/₀/g, '0').replace(/_/, '')}`}
            >
              {/* Card Upper Info */}
              <div className="space-y-1.5">
                <div className="flex items-start justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400 bg-indigo-950/35 px-2 py-0.5 rounded border border-indigo-900/15">
                    {constant.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(constant)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-820 hover:text-white text-slate-400 transition"
                      title="Copy exact numeric value to clipboard"
                    >
                      {copiedSymbol === constant.symbol ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                    {/* Insert to Calculator Button */}
                    {onInsertValue && (
                      <button
                        onClick={() => onInsertValue(constant.value.toString())}
                        className="p-1.5 rounded-lg bg-indigo-950/20 border border-indigo-900/30 hover:bg-indigo-600 hover:text-white text-indigo-400 transition"
                        title="Insert exact value into Scientific Calculator"
                      >
                        <Plus size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-bold font-mono text-white tracking-wide">{constant.symbol}</h3>
                  <span className="text-xs text-slate-400 font-medium font-sans truncate">{constant.name}</span>
                </div>

                <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-2">
                  {constant.description}
                </p>
              </div>

              {/* Value display block with copy button */}
              <div className="bg-slate-950 border border-slate-800/65 rounded-lg p-2.5 flex items-center justify-between font-mono text-xs select-all overflow-x-hidden min-w-0" id={`constant-value-cell-${constant.symbol}`}>
                <span className="text-indigo-300 font-semibold break-all mr-2">
                  {constant.value.toExponential()}
                </span>
                <span className="text-slate-500 shrink-0 font-medium text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {constant.unit}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
