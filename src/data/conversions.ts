/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UnitCategory } from '../types';

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length & Dim.',
    icon: 'Ruler',
    units: [
      { symbol: 'm', name: 'Meter', toBase: 1, fromBase: 1 },
      { symbol: 'mm', name: 'Millimeter', toBase: 1e-3, fromBase: 1e3 },
      { symbol: 'cm', name: 'Centimeter', toBase: 1e-2, fromBase: 1e2 },
      { symbol: 'km', name: 'Kilometer', toBase: 1e3, fromBase: 1e-3 },
      { symbol: 'in', name: 'Inch', toBase: 0.0254, fromBase: 1 / 0.0254 },
      { symbol: 'ft', name: 'Foot', toBase: 0.3048, fromBase: 1 / 0.3048 },
      { symbol: 'yd', name: 'Yard', toBase: 0.9144, fromBase: 1 / 0.9144 },
      { symbol: 'mi', name: 'Mile', toBase: 1609.344, fromBase: 1 / 1609.344 },
    ]
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    icon: 'Scale',
    units: [
      { symbol: 'kg', name: 'Kilogram', toBase: 1, fromBase: 1 },
      { symbol: 'g', name: 'Gram', toBase: 1e-3, fromBase: 1e3 },
      { symbol: 'mg', name: 'Milligram', toBase: 1e-6, fromBase: 1e6 },
      { symbol: 'lb', name: 'Pound (avdp)', toBase: 0.45359237, fromBase: 1 / 0.45359237 },
      { symbol: 'oz', name: 'Ounce (avdp)', toBase: 0.028349523, fromBase: 1 / 0.028349523 },
      { symbol: 'ton', name: 'Metric Ton', toBase: 1e3, fromBase: 1e-3 },
    ]
  },
  {
    id: 'force',
    name: 'Force & Load',
    icon: 'Zap',
    units: [
      { symbol: 'N', name: 'Newton', toBase: 1, fromBase: 1 },
      { symbol: 'kN', name: 'Kilonewton', toBase: 1e3, fromBase: 1e-3 },
      { symbol: 'lbf', name: 'Pound-force', toBase: 4.448221615, fromBase: 1 / 4.448221615 },
      { symbol: 'kgf', name: 'Kilogram-force', toBase: 9.80665, fromBase: 1 / 9.80665 },
      { symbol: 'dyne', name: 'Dyne', toBase: 1e-5, fromBase: 1e5 },
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure & Stress',
    icon: 'Gauge',
    units: [
      { symbol: 'Pa', name: 'Pascal', toBase: 1, fromBase: 1 },
      { symbol: 'kPa', name: 'Kilopascal', toBase: 1e3, fromBase: 1e-3 },
      { symbol: 'MPa', name: 'Megapascal', toBase: 1e6, fromBase: 1e-6 },
      { symbol: 'bar', name: 'Bar', toBase: 1e5, fromBase: 1e-5 },
      { symbol: 'psi', name: 'Pounds per sq in', toBase: 6894.75729, fromBase: 1 / 6894.75729 },
      { symbol: 'atm', name: 'Standard Atmosphere', toBase: 101325, fromBase: 1 / 101325 },
      { symbol: 'mmHg', name: 'Millimeter of Mercury', toBase: 133.3224, fromBase: 1 / 133.3224 },
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Work',
    icon: 'Activity',
    units: [
      { symbol: 'J', name: 'Joule', toBase: 1, fromBase: 1 },
      { symbol: 'kJ', name: 'Kilojoule', toBase: 1e3, fromBase: 1e-3 },
      { symbol: 'MJ', name: 'Megajoule', toBase: 1e6, fromBase: 1e-6 },
      { symbol: 'Wh', name: 'Watt-hour', toBase: 3600, fromBase: 1 / 3600 },
      { symbol: 'kWh', name: 'Kilowatt-hour', toBase: 3.6e6, fromBase: 1 / 3.6e6 },
      { symbol: 'BTU', name: 'British Thermal Unit', toBase: 1055.056, fromBase: 1 / 1055.056 },
      { symbol: 'cal', name: 'Calorie (th)', toBase: 4.184, fromBase: 1 / 4.184 },
      { symbol: 'kcal', name: 'Kilocalorie', toBase: 4184, fromBase: 1 / 4184 },
    ]
  },
  {
    id: 'power',
    name: 'Power & Heat Flow',
    icon: 'Flame',
    units: [
      { symbol: 'W', name: 'Watt', toBase: 1, fromBase: 1 },
      { symbol: 'kW', name: 'Kilowatt', toBase: 1e3, fromBase: 1e-3 },
      { symbol: 'MW', name: 'Megawatt', toBase: 1e6, fromBase: 1e-6 },
      { symbol: 'hp', name: 'Horsepower (mech)', toBase: 745.69987, fromBase: 1 / 745.69987 },
      { symbol: 'BTU/hr', name: 'BTU per Hour', toBase: 0.293071, fromBase: 1 / 0.293071 },
      { symbol: 'ton_ref', name: 'Ton of Refrigeration', toBase: 3516.853, fromBase: 1 / 3516.853 },
    ]
  },
  {
    id: 'flow',
    name: 'Flow Rate',
    icon: 'Waves',
    units: [
      { symbol: 'm³/s', name: 'Cubic Meter/Sec', toBase: 1, fromBase: 1 },
      { symbol: 'L/s', name: 'Liter per Second', toBase: 1e-3, fromBase: 1e3 },
      { symbol: 'L/min', name: 'Liter per Minute', toBase: 1.66667e-5, fromBase: 60000 },
      { symbol: 'gpm', name: 'US Gallon/Minute', toBase: 6.30901964e-5, fromBase: 1 / 6.30901964e-5 },
      { symbol: 'ft³/s', name: 'Cubic Foot/Sec', toBase: 0.028316846592, fromBase: 1 / 0.028316846592 },
      { symbol: 'm³/hr', name: 'Cubic Meter/Hour', toBase: 2.77778e-4, fromBase: 3600 },
    ]
  }
];

// Special Temperature conversion function since it uses linear offsets instead of plain ratios
export const convertTemperature = (value: number, from: string, to: string): number => {
  // First convert from original scale to Kelvin
  let kelvin = 0;
  switch (from) {
    case 'C':
      kelvin = value + 273.15;
      break;
    case 'F':
      kelvin = (value - 32) * (5 / 9) + 273.15;
      break;
    case 'K':
      kelvin = value;
      break;
    case 'R':
      kelvin = value * (5 / 9);
      break;
    default:
      kelvin = value;
  }

  // Convert from Kelvin to target scale
  switch (to) {
    case 'C':
      return kelvin - 273.15;
    case 'F':
      return (kelvin - 273.15) * (9 / 5) + 32;
    case 'K':
      return kelvin;
    case 'R':
      return kelvin * (9 / 5);
    default:
      return kelvin;
  }
};

export const TEMP_UNITS = [
  { symbol: 'C', name: 'Celsius (°C)' },
  { symbol: 'F', name: 'Fahrenheit (°F)' },
  { symbol: 'K', name: 'Kelvin (K)' },
  { symbol: 'R', name: 'Rankine (°R)' }
];
