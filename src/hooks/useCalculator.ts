import { useMemo, useState } from 'react';
import type { CalculationResult, CalculatorInput } from '../types/calculator';
import { calculateInstallment, getDefaultStartDate } from '../utils/calculator';
import { clamp } from '../utils/format';
import {
  MAX_DOWN_PAYMENT,
  MAX_MARKUP_PERCENT,
  MAX_PRODUCT_COST,
  MAX_TERM,
  MIN_DOWN_PAYMENT,
  MIN_MARKUP_PERCENT,
  MIN_PRODUCT_COST,
  MIN_TERM,
  getMarkupPercent,
} from '../utils/markup';

const DEFAULT_TERM_MONTHS = 6;

const DEFAULT_INPUT: CalculatorInput = {
  productCost: 100_000,
  downPayment: 25_000,
  termMonths: DEFAULT_TERM_MONTHS,
  markupPercent: getMarkupPercent(DEFAULT_TERM_MONTHS),
  startDate: getDefaultStartDate(),
};

function toFiniteNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeMarkupPercent(markupPercent: unknown, termMonths: number): number {
  const fallbackMarkupPercent = getMarkupPercent(termMonths);
  const safeMarkupPercent = toFiniteNumber(markupPercent, fallbackMarkupPercent);
  return clamp(safeMarkupPercent, MIN_MARKUP_PERCENT, MAX_MARKUP_PERCENT);
}

export function useCalculator() {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);

  const result = useMemo(() => calculateInstallment(input), [input]);

  const updateField = <K extends keyof CalculatorInput>(field: K, value: CalculatorInput[K]) => {
    setInput((current) => {
      const next = { ...current, [field]: value };

      if (field === 'productCost') {
        next.productCost = clamp(
          toFiniteNumber(value, current.productCost),
          MIN_PRODUCT_COST,
          MAX_PRODUCT_COST,
        );
        next.downPayment = clamp(
          next.downPayment,
          MIN_DOWN_PAYMENT,
          Math.min(MAX_DOWN_PAYMENT, next.productCost),
        );
      }

      if (field === 'termMonths') {
        next.termMonths = clamp(toFiniteNumber(value, current.termMonths), MIN_TERM, MAX_TERM);
        const previousDefaultMarkupPercent = getMarkupPercent(current.termMonths);

        if (current.markupPercent === previousDefaultMarkupPercent) {
          next.markupPercent = getMarkupPercent(next.termMonths);
        }
      }

      if (field === 'downPayment') {
        next.downPayment = clamp(
          toFiniteNumber(value, current.downPayment),
          MIN_DOWN_PAYMENT,
          Math.min(MAX_DOWN_PAYMENT, next.productCost),
        );
      }

      if (field === 'markupPercent') {
        next.markupPercent = normalizeMarkupPercent(value, next.termMonths);
      }

      return next;
    });
  };

  const applyPreset = (preset: CalculatorInput) => {
    const nextMarkupPercent = normalizeMarkupPercent(
      (preset as Partial<CalculatorInput>).markupPercent,
      preset.termMonths,
    );

    setInput({ ...preset, markupPercent: nextMarkupPercent });
  };

  return {
    input,
    result,
    updateField,
    applyPreset,
  };
}

export type UseCalculatorReturn = ReturnType<typeof useCalculator> & {
  result: CalculationResult;
};
