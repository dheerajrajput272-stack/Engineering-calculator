/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EngineeringCategory = 'Electrical' | 'Mechanical' | 'Civil' | 'Chemical & Aerospace';

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit: string;
  defaultValue: number;
  description: string;
}

export interface Formula {
  id: string;
  name: string;
  category: EngineeringCategory;
  description: string;
  equationText: string;
  variables: FormulaVariable[];
  // Re-arrangeable solver: solves for a selected variable given the other variables.
  solve: (inputs: Record<string, number>, targetSymbol: string) => number;
  // Dynamic diagram parameter for visualization
  diagramType: 'beam' | 'resonant' | 'rc' | 'heat' | 'reynolds' | 'gas' | 'lift';
}

export interface ScientificConstant {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  category: 'Fundamental' | 'Electromagnetic' | 'Atomic & Nuclear' | 'Physicochemical';
  description: string;
}

export interface UnitCategory {
  id: string;
  name: string;
  icon: string;
  units: {
    symbol: string;
    name: string;
    toBase: number; // Multiply by this to get to the base unit
    fromBase: number; // Multiply the base unit by this to get to this unit
  }[];
}

export interface CalcHistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}
