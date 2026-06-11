import type { CalculatorInput, CalculationResult, HistoryEntry } from '../types/calculator';

const STORAGE_KEY = 'murabuy_calculation_history';
const MAX_HISTORY_ITEMS = 20;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryEntry(input: CalculatorInput, result: CalculationResult): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    result,
  };

  const nextHistory = [entry, ...loadHistory()].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
  return nextHistory;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
