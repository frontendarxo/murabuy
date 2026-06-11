import type { HistoryEntry } from '../types/calculator';
import { formatCurrency } from '../utils/format';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <section className="card card--history">
        <div className="card__head">
          <h2>История расчётов</h2>
          <p>Сохранённые расчёты появятся здесь после отправки заявки</p>
        </div>
        <div className="history-empty">История пока пуста</div>
      </section>
    );
  }

  return (
    <section className="card card--history">
      <div className="card__head card__head--row">
        <div>
          <h2>История расчётов</h2>
          <p>Последние сохранённые расчёты</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onClear}>
          Очистить
        </button>
      </div>

      <ul className="history-list">
        {history.map((entry) => (
          <li key={entry.id}>
            <button type="button" className="history-item" onClick={() => onSelect(entry)}>
              <span className="history-item__date">
                {new Date(entry.createdAt).toLocaleString('ru-RU')}
              </span>
              <span className="history-item__title">
                {formatCurrency(entry.result.productCost)} · {entry.result.termMonths} мес.
              </span>
              <span className="history-item__meta">
                Платёж {formatCurrency(entry.result.monthlyPayment)} · Итого{' '}
                {formatCurrency(entry.result.totalPayments)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
