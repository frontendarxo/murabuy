import { useCallback, useEffect, useState } from 'react';
import type { CalculatorInput, CalculationResult, HistoryEntry } from '../types/calculator';
import { clearHistory, loadHistory, saveHistoryEntry } from '../utils/history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback((input: CalculatorInput, result: CalculationResult) => {
    const nextHistory = saveHistoryEntry(input, result);
    setHistory(nextHistory);
  }, []);

  const resetHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    resetHistory,
  };
}
