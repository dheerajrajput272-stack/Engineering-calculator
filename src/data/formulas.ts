/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Formula } from '../types';

export const FORMULAS: Formula[] = [
  // ELECTRICAL
  {
    id: 'resonant-frequency',
    name: 'LC Resonant Frequency',
    category: 'Electrical',
    description: 'Calculates the resonant frequency of an ideal LC circuit where capacitive and inductive reactances cancel each other out.',
    equationText: 'f₀ = 1 / (2π · √(L · C))',
    variables: [
      { symbol: 'f₀', name: 'Resonant Frequency', unit: 'Hz', defaultValue: 1000, description: 'The frequency at which electrical oscillation occurs.' },
      { symbol: 'L', name: 'Inductance', unit: 'H', defaultValue: 0.015, description: 'The property of an electrical conductor which opposes a change in current.' },
      { symbol: 'C', name: 'Capacitance', unit: 'F', defaultValue: 0.000001, description: 'The ability of a system to store an electric charge.' }
    ],
    solve: (inputs, targetSymbol) => {
      const f0 = inputs['f₀'];
      const L = inputs['L'];
      const C = inputs['C'];

      if (targetSymbol === 'f₀') {
        if (L <= 0 || C <= 0) return 0;
        return 1 / (2 * Math.PI * Math.sqrt(L * C));
      } else if (targetSymbol === 'L') {
        if (f0 <= 0 || C <= 0) return 0;
        return 1 / (4 * Math.PI * Math.PI * f0 * f0 * C);
      } else if (targetSymbol === 'C') {
        if (f0 <= 0 || L <= 0) return 0;
        return 1 / (4 * Math.PI * Math.PI * f0 * f0 * L);
      }
      return 0;
    },
    diagramType: 'resonant'
  },
  {
    id: 'ohms-law-ac',
    name: 'Ohm\'s Law for AC Circuits',
    category: 'Electrical',
    description: 'Relates Voltage, Current, and total Impedance in an alternating current (AC) circuit.',
    equationText: 'V = I · Z',
    variables: [
      { symbol: 'V', name: 'AC Voltage', unit: 'V', defaultValue: 120, description: 'The root-mean-square electrical potential difference.' },
      { symbol: 'I', name: 'AC Current', unit: 'A', defaultValue: 5, description: 'The root-mean-square electric current flowing in the circuit.' },
      { symbol: 'Z', name: 'Impedance', unit: 'Ω', defaultValue: 24, description: 'The total opposition of a circuit to alternating current.' }
    ],
    solve: (inputs, targetSymbol) => {
      const V = inputs['V'];
      const I = inputs['I'];
      const Z = inputs['Z'];

      if (targetSymbol === 'V') {
        return I * Z;
      } else if (targetSymbol === 'I') {
        if (Z <= 0) return 0;
        return V / Z;
      } else if (targetSymbol === 'Z') {
        if (I === 0) return 0;
        return Math.abs(V / I);
      }
      return 0;
    },
    diagramType: 'rc'
  },
  {
    id: 'rc-charging',
    name: 'RC Time Constant',
    category: 'Electrical',
    description: 'Calculates the response time constant of an RC circuit, representing the time required to charge the capacitor to ~63.2% of its full value.',
    equationText: 'τ = R · C',
    variables: [
      { symbol: 'τ', name: 'Time Constant', unit: 's', defaultValue: 0.1, description: 'The characteristic time constant of the charging/discharging curve.' },
      { symbol: 'R', name: 'Resistance', unit: 'Ω', defaultValue: 10000, description: 'The electrical resistance opposing state current flow.' },
      { symbol: 'C', name: 'Capacitance', unit: 'F', defaultValue: 0.00001, description: 'The electrical capacitance storing charges.' }
    ],
    solve: (inputs, targetSymbol) => {
      const tau = inputs['τ'];
      const R = inputs['R'];
      const C = inputs['C'];

      if (targetSymbol === 'τ') {
        return R * C;
      } else if (targetSymbol === 'R') {
        if (C <= 0) return 0;
        return tau / C;
      } else if (targetSymbol === 'C') {
        if (R <= 0) return 0;
        return tau / R;
      }
      return 0;
    },
    diagramType: 'rc'
  },

  // MECHANICAL
  {
    id: 'reynolds-number',
    name: 'Reynolds Number',
    category: 'Mechanical',
    description: 'Predicts fluid flow patterns (laminary vs. turbulent) based on inertial and viscous forces.',
    equationText: 'Re = (ρ · v · D) / μ',
    variables: [
      { symbol: 'Re', name: 'Reynolds Number', unit: 'dim.', defaultValue: 2100, description: 'Calculated dimensionless flow index (<2300 laminar, >4000 turbulent).' },
      { symbol: 'ρ', name: 'Fluid Density', unit: 'kg/m³', defaultValue: 998, description: 'The volumetric mass density of the moving fluid.' },
      { symbol: 'v', name: 'Mean Velocity', unit: 'm/s', defaultValue: 1.5, description: 'Average flow velocity across the cross-sectional area.' },
      { symbol: 'D', name: 'Hydraulic Diameter', unit: 'm', defaultValue: 0.05, description: 'The inner pipe or channel diameter.' },
      { symbol: 'μ', name: 'Dynamic Viscosity', unit: 'Pa·s', defaultValue: 0.0010016, description: 'Internal fluid shear resistance force (thickness).' }
    ],
    solve: (inputs, targetSymbol) => {
      const Re = inputs['Re'];
      const rho = inputs['ρ'];
      const v = inputs['v'];
      const D = inputs['D'];
      const mu = inputs['μ'];

      if (targetSymbol === 'Re') {
        if (mu <= 0) return 0;
        return (rho * v * D) / mu;
      } else if (targetSymbol === 'ρ') {
        if (v * D === 0) return 0;
        return (Re * mu) / (v * D);
      } else if (targetSymbol === 'v') {
        if (rho * D === 0) return 0;
        return (Re * mu) / (rho * D);
      } else if (targetSymbol === 'D') {
        if (rho * v === 0) return 0;
        return (Re * mu) / (rho * v);
      } else if (targetSymbol === 'μ') {
        if (Re <= 0) return 0;
        return (rho * v * D) / Re;
      }
      return 0;
    },
    diagramType: 'reynolds'
  },
  {
    id: 'heat-conduction',
    name: 'Fourier\'s Law of Heat Conduction',
    category: 'Mechanical',
    description: 'Determines steady-state thermal energy transfer rate through a uniform solid plate.',
    equationText: 'q = (k · A · ΔT) / L',
    variables: [
      { symbol: 'q', name: 'Heat Flow Rate', unit: 'W', defaultValue: 1500, description: 'The conductive thermal power transferring through the solid.' },
      { symbol: 'k', name: 'Thermal Conductivity', unit: 'W/(m·K)', defaultValue: 205, description: 'The ability of the material to conduct heat (e.g., Al ~205).' },
      { symbol: 'A', name: 'Surface Area', unit: 'm²', defaultValue: 2.5, description: 'Cross-sectional area normal to the heat flow vector.' },
      { symbol: 'ΔT', name: 'Temp Difference', unit: 'K', defaultValue: 30, description: 'The temperature difference between the warm and cold faces.' },
      { symbol: 'L', name: 'Material Thickness', unit: 'm', defaultValue: 0.01, description: 'The physical thickness/distance the heat travels.' }
    ],
    solve: (inputs, targetSymbol) => {
      const q = inputs['q'];
      const k = inputs['k'];
      const A = inputs['A'];
      const dT = inputs['ΔT'];
      const L = inputs['L'];

      if (targetSymbol === 'q') {
        if (L <= 0) return 0;
        return (k * A * dT) / L;
      } else if (targetSymbol === 'k') {
        if (A * dT === 0) return 0;
        return (q * L) / (A * dT);
      } else if (targetSymbol === 'A') {
        if (k * dT === 0) return 0;
        return (q * L) / (k * dT);
      } else if (targetSymbol === 'ΔT') {
        if (k * A === 0) return 0;
        return (q * L) / (k * A);
      } else if (targetSymbol === 'L') {
        if (q === 0) return 0;
        return (k * A * dT) / q;
      }
      return 0;
    },
    diagramType: 'heat'
  },

  // CIVIL
  {
    id: 'beam-deflection-ss',
    name: 'Beam Deflection (Simply Supported)',
    category: 'Civil',
    description: 'Calculates the maximum downward elastic deflection at center span for an ideal beam supporting a singular point load.',
    equationText: 'δ = (P · L³) / (48 · E · I)',
    variables: [
      { symbol: 'δ', name: 'Max Deflection', unit: 'm', defaultValue: 0.005, description: 'The maximum displacement from the neutral axis at center.' },
      { symbol: 'P', name: 'Point Load Force', unit: 'N', defaultValue: 10000, description: 'Concentrated load force acting down at the exact center.' },
      { symbol: 'L', name: 'Span Length', unit: 'm', defaultValue: 6.0, description: 'The horizontal clearance span of the beam between supports.' },
      { symbol: 'E', name: 'Modulus of Elasticity', unit: 'Pa', defaultValue: 2.0e11, description: 'Material stiffness/elastic behavior index (Steel is ~200 GPa).' },
      { symbol: 'I', name: 'Area Moment of Inertia', unit: 'm⁴', defaultValue: 0.00015, description: 'Geometric stiffness property representing resistence to bending loads.' }
    ],
    solve: (inputs, targetSymbol) => {
      const delta = inputs['δ'];
      const P = inputs['P'];
      const L = inputs['L'];
      const E = inputs['E'];
      const I = inputs['I'];

      if (targetSymbol === 'δ') {
        const demon = 48 * E * I;
        if (demon === 0) return 0;
        return (P * Math.pow(L, 3)) / demon;
      } else if (targetSymbol === 'P') {
        if (L <= 0) return 0;
        return (48 * E * I * delta) / Math.pow(L, 3);
      } else if (targetSymbol === 'L') {
        if (P === 0) return 0;
        const arg = (48 * E * I * delta) / P;
        return arg > 0 ? Math.cbrt(arg) : 0;
      } else if (targetSymbol === 'E') {
        const demon = 48 * delta * I;
        if (demon === 0) return 0;
        return (P * Math.pow(L, 3)) / demon;
      } else if (targetSymbol === 'I') {
        const demon = 48 * delta * E;
        if (demon === 0) return 0;
        return (P * Math.pow(L, 3)) / demon;
      }
      return 0;
    },
    diagramType: 'beam'
  },

  // CHEMICAL & AEROSPACE
  {
    id: 'ideal-gas',
    name: 'Ideal Gas Equation',
    category: 'Chemical & Aerospace',
    description: 'Expresses state behavior of a hypothetical ideal gas under primary thermodynamic influences.',
    equationText: 'P · V = n · R · T',
    variables: [
      { ...{ symbol: 'P', name: 'Pressure', unit: 'Pa', defaultValue: 101325, description: 'The absolute hydrostatic pressure of the gas.' } },
      { ...{ symbol: 'V', name: 'Volume', unit: 'm³', defaultValue: 0.0224, description: 'Physical volume occupied by the gaseous mass.' } },
      { ...{ symbol: 'n', name: 'Quantity of Gas', unit: 'mol', defaultValue: 1.0, description: 'The chemical amount of gas molecules.' } },
      { ...{ symbol: 'R', name: 'Gas Constant', unit: 'J/(mol·K)', defaultValue: 8.314462, description: 'Universal gas constant of proportionality.' } },
      { ...{ symbol: 'T', name: 'Temperature', unit: 'K', defaultValue: 273.15, description: 'Absolute thermal index in Kelvin.' } }
    ],
    solve: (inputs, targetSymbol) => {
      const P = inputs['P'];
      const V = inputs['V'];
      const n = inputs['n'];
      const R = inputs['R'];
      const T = inputs['T'];

      if (targetSymbol === 'P') {
        if (V <= 0) return 0;
        return (n * R * T) / V;
      } else if (targetSymbol === 'V') {
        if (P <= 0) return 0;
        return (n * R * T) / P;
      } else if (targetSymbol === 'n') {
        if (R * T === 0) return 0;
        return (P * V) / (R * T);
      } else if (targetSymbol === 'R') {
        if (n * T === 0) return 0;
        return (P * V) / (n * T);
      } else if (targetSymbol === 'T') {
        if (n * R === 0) return 0;
        return (P * V) / (n * R);
      }
      return 0;
    },
    diagramType: 'gas'
  },
  {
    id: 'aerodynamic-lift',
    name: 'Aerodynamic Lift Equation',
    category: 'Chemical & Aerospace',
    description: 'Calculates the lifting force generated by a wing advancing through a fluid medium with uniform relative flow.',
    equationText: 'L = 0.5 · ρ · v² · S · Cl',
    variables: [
      { symbol: 'L', name: 'Generated Lift Force', unit: 'N', defaultValue: 12500, description: 'Calculated aerodynamic lift vector opposing gravity.' },
      { symbol: 'ρ', name: 'Air / Fluid Density', unit: 'kg/m³', defaultValue: 1.225, description: 'Density of the atmospheric medium (Default at sea level: 1.225).' },
      { symbol: 'v', name: 'Relative Velocity', unit: 'm/s', defaultValue: 65, description: 'True speed of the wing relative to the steady fluid flow.' },
      { symbol: 'S', name: 'Wing Surface Area', unit: 'm²', defaultValue: 16.5, description: 'Horizontal planform area of the lifting wing.' },
      { symbol: 'Cl', name: 'Lift Coefficient', unit: 'dim.', defaultValue: 0.65, description: 'Dimensionless coefficient based on shape, angle of attack, and viscous profile.' }
    ],
    solve: (inputs, targetSymbol) => {
      const L = inputs['L'];
      const rho = inputs['ρ'];
      const v = inputs['v'];
      const S = inputs['S'];
      const Cl = inputs['Cl'];

      if (targetSymbol === 'L') {
        return 0.5 * rho * v * v * S * Cl;
      } else if (targetSymbol === 'ρ') {
        const denom = 0.5 * v * v * S * Cl;
        if (denom === 0) return 0;
        return L / denom;
      } else if (targetSymbol === 'v') {
        const denom = 0.5 * rho * S * Cl;
        if (denom <= 0 || L < 0) return 0;
        return Math.sqrt(L / denom);
      } else if (targetSymbol === 'S') {
        const denom = 0.5 * rho * v * v * Cl;
        if (denom === 0) return 0;
        return L / denom;
      } else if (targetSymbol === 'Cl') {
        const denom = 0.5 * rho * v * v * S;
        if (denom === 0) return 0;
        return L / denom;
      }
      return 0;
    },
    diagramType: 'lift'
  }
];
