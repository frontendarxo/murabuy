import { useMemo, useState } from 'react';
import type { CalculationResult, CalculatorInput } from '../types/calculator';
import { calculateInstallment, getDefaultStartDate } from '../utils/calculator';
import { clamp } from '../utils/format';
import {
  MAX_DOWN_PAYMENT,
  MAX_PRODUCT_COST,
  MAX_TERM,
  MIN_DOWN_PAYMENT,
  MIN_PRODUCT_COST,
  MIN_TERM,
} from '../utils/markup';

const DEFAULT_INPUT: CalculatorInput = {
  productCost: 100_000,
  downPayment: 25_000,
  termMonths: 6,
  startDate: getDefaultStartDate(),
};

export function useCalculator() {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);

  const result = useMemo(() => calculateInstallment(input), [input]);

  const updateField = <K extends keyof CalculatorInput>(field: K, value: CalculatorInput[K]) => {
    setInput((current) => {
      const next = { ...current, [field]: value };

      if (field === 'productCost' || field === 'downPayment') {
        next.downPayment = clamp(
          next.downPayment,
          MIN_DOWN_PAYMENT,
          Math.min(MAX_DOWN_PAYMENT, next.productCost),
        );
      }

      if (field === 'termMonths') {
        next.termMonths = clamp(Number(value), MIN_TERM, MAX_TERM);
      }

      if (field === 'productCost') {
        next.productCost = clamp(Number(value), MIN_PRODUCT_COST, MAX_PRODUCT_COST);
      }

      return next;
    });
  };

  const applyPreset = (preset: CalculatorInput) => {
    setInput(preset);
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
