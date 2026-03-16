/**
 * @file tax-data.constant.ts
 * @description Static configuration for US Federal Tax brackets.
 * This data is separated from logic to allow easy updates for inflation adjustments
 * or new tax years without modifying the core service algorithms.
 */

export interface TaxBracket {
  rate: number;
  min: number;
  max: number;
}

export interface TaxConfig {
  standardDeduction: number;
  brackets: TaxBracket[];
}

// Historical Tax Data (2019-2024) for Single Filers
export const TAX_DATA: Record<number, TaxConfig> = {
  2024: {
    standardDeduction: 14600,
    brackets: [
      { rate: 0.1, min: 0, max: 11600 },
      { rate: 0.12, min: 11600, max: 47150 },
      { rate: 0.22, min: 47150, max: 100525 },
      { rate: 0.24, min: 100525, max: 191950 },
      { rate: 0.32, min: 191950, max: 243725 },
      { rate: 0.35, min: 243725, max: 609350 },
      { rate: 0.37, min: 609350, max: Infinity },
    ],
  },
  2023: {
    standardDeduction: 13850,
    brackets: [
      { rate: 0.1, min: 0, max: 11000 },
      { rate: 0.12, min: 11000, max: 44725 },
      { rate: 0.22, min: 44725, max: 95375 },
      { rate: 0.24, min: 95375, max: 182100 },
      { rate: 0.32, min: 182100, max: 231250 },
      { rate: 0.35, min: 231250, max: 578125 },
      { rate: 0.37, min: 578125, max: Infinity },
    ],
  },
  2022: {
    standardDeduction: 12950,
    brackets: [
      { rate: 0.1, min: 0, max: 10275 },
      { rate: 0.12, min: 10275, max: 41775 },
      { rate: 0.22, min: 41775, max: 89075 },
      { rate: 0.24, min: 89075, max: 170050 },
      { rate: 0.32, min: 170050, max: 215950 },
      { rate: 0.35, min: 215950, max: 539900 },
      { rate: 0.37, min: 539900, max: Infinity },
    ],
  },
  2021: {
    standardDeduction: 12550,
    brackets: [
      { rate: 0.1, min: 0, max: 9950 },
      { rate: 0.12, min: 9950, max: 40525 },
      { rate: 0.22, min: 40525, max: 86375 },
      { rate: 0.24, min: 86375, max: 164925 },
      { rate: 0.32, min: 164925, max: 209425 },
      { rate: 0.35, min: 209425, max: 523600 },
      { rate: 0.37, min: 523600, max: Infinity },
    ],
  },
  2020: {
    standardDeduction: 12400,
    brackets: [
      { rate: 0.1, min: 0, max: 9875 },
      { rate: 0.12, min: 9875, max: 40125 },
      { rate: 0.22, min: 40125, max: 85525 },
      { rate: 0.24, min: 85525, max: 163300 },
      { rate: 0.32, min: 163300, max: 207350 },
      { rate: 0.35, min: 207350, max: 518400 },
      { rate: 0.37, min: 518400, max: Infinity },
    ],
  },
  2019: {
    standardDeduction: 12200,
    brackets: [
      { rate: 0.1, min: 0, max: 9700 },
      { rate: 0.12, min: 9700, max: 39475 },
      { rate: 0.22, min: 39475, max: 84200 },
      { rate: 0.24, min: 84200, max: 160725 },
      { rate: 0.32, min: 160725, max: 204100 },
      { rate: 0.35, min: 204100, max: 510300 },
      { rate: 0.37, min: 510300, max: Infinity },
    ],
  },
};
