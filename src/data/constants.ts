/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScientificConstant } from '../types';

export const SCIENTIFIC_CONSTANTS: ScientificConstant[] = [
  {
    symbol: 'c',
    name: 'Speed of Light in Vacuum',
    value: 299792458,
    unit: 'm/s',
    category: 'Fundamental',
    description: 'The maximum speed at which all conventional matter and information in the universe can travel.'
  },
  {
    symbol: 'G',
    name: 'Newtonian Constant of Gravitation',
    value: 6.6743e-11,
    unit: 'm³/(kg·s²)',
    category: 'Fundamental',
    description: 'An empirical physical constant involved in the calculation of gravitational effects in Newton\'s law of universal gravitation.'
  },
  {
    symbol: 'h',
    name: 'Planck Constant',
    value: 6.62607015e-34,
    unit: 'J·s',
    category: 'Fundamental',
    description: 'The quantum of electromagnetic action, which relates the energy carried by a photon to its frequency.'
  },
  {
    symbol: 'ħ',
    name: 'Reduced Planck Constant',
    value: 1.054571817e-34,
    unit: 'J·s',
    category: 'Fundamental',
    description: 'Planck\'s constant divided by 2π, also called the Dirac constant, representing the quantum of angular momentum.'
  },
  {
    symbol: 'g',
    name: 'Standard Gravity',
    value: 9.80665,
    unit: 'm/s²',
    category: 'Fundamental',
    description: 'The nominal gravitational acceleration of an object in a vacuum near the surface of the Earth.'
  },
  {
    symbol: 'ε₀',
    name: 'Vacuum Electric Permittivity',
    value: 8.8541878128e-12,
    unit: 'F/m',
    category: 'Electromagnetic',
    description: 'The capability of a vacuum to permit electric field lines; also known as the permittivity of free space.'
  },
  {
    symbol: 'μ₀',
    name: 'Vacuum Magnetic Permeability',
    value: 1.25663706212e-6,
    unit: 'N/A²',
    category: 'Electromagnetic',
    description: 'A physical constant representing the magnetic permeability in a classical vacuum.'
  },
  {
    symbol: 'e',
    name: 'Elementary Charge',
    value: 1.602176634e-19,
    unit: 'C',
    category: 'Electromagnetic',
    description: 'The electrical charge carried by a single proton, or equivalently, the magnitude of the negative charge of a single electron.'
  },
  {
    symbol: 'Z₀',
    name: 'Impedance of Vacuum',
    value: 376.730313668,
    unit: 'Ω',
    category: 'Electromagnetic',
    description: 'A physical constant relating the magnitudes of the electric and magnetic fields of electromagnetic radiation travelling through vacuum.'
  },
  {
    symbol: 'm_e',
    name: 'Electron Mass',
    value: 9.1093837015e-31,
    unit: 'kg',
    category: 'Atomic & Nuclear',
    description: 'The rest mass of an electron, one of the fundamental constituents of matter.'
  },
  {
    symbol: 'm_p',
    name: 'Proton Mass',
    value: 1.67262192369e-27,
    unit: 'kg',
    category: 'Atomic & Nuclear',
    description: 'The rest mass of a proton, a stable subatomic particle occurring in all atomic nuclei.'
  },
  {
    symbol: 'm_n',
    name: 'Neutron Mass',
    value: 1.67492749804e-27,
    unit: 'kg',
    category: 'Atomic & Nuclear',
    description: 'The rest mass of a neutron, a subatomic particle of about the same mass as a proton but without an electric charge.'
  },
  {
    symbol: 'N_A',
    name: 'Avogadro Constant',
    value: 6.02214076e23,
    unit: 'mol⁻¹',
    category: 'Physicochemical',
    description: 'The number of constituent particles (usually atoms or molecules) that are contained in the amount of substance given by one mole.'
  },
  {
    symbol: 'R',
    name: 'Molar Gas Constant',
    value: 8.314462618,
    unit: 'J/(mol·K)',
    category: 'Physicochemical',
    description: 'The constant of proportionality in the ideal gas law, relating energy scale to temperature scale.'
  },
  {
    symbol: 'k_B',
    name: 'Boltzmann Constant',
    value: 1.380649e-23,
    unit: 'J/K',
    category: 'Physicochemical',
    description: 'A physical constant relating the average relative kinetic energy of particles in a gas with the thermodynamic temperature.'
  },
  {
    symbol: 'σ',
    name: 'Stefan-Boltzmann Constant',
    value: 5.670374419e-8,
    unit: 'W/(m²·K⁴)',
    category: 'Physicochemical',
    description: 'The constant of proportionality in the Stefan-Boltzmann law of black-body radiation.'
  },
  {
    symbol: 'F',
    name: 'Faraday Constant',
    value: 96485.33212,
    unit: 'C/mol',
    category: 'Physicochemical',
    description: 'The amount of electric charge per mole of electrons, used widely in electrochemistry.'
  }
];
