import { useState } from 'react';
import type { PaymentEntry } from '../types/calculator';
import { formatCurrency } from '../utils/format';

interface PaymentScheduleProps {
  schedule: PaymentEntry[];
}

export function PaymentSchedule({ schedule }: PaymentScheduleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = schedule
      .map(
        (entry) =>
          `${entry.number}. ${entry.date} — ${formatCurrency(entry.amount)} (остаток: ${formatCurrency(entry.remainingDebt)})`,
      )
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="card card--schedule">
      <div className="card__head card__head--row">
        <div>
          <h2>График платежей</h2>
          <p>Даты платежей и остаток задолженности</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={handleCopy}>
          {copied ? 'Скопировано' : 'Копировать график'}
        </button>
      </div>

      <div className="schedule-cards">
        {schedule.map((entry) => (
          <article key={entry.number} className="schedule-card">
            <div className="schedule-card__top">
              <span className="schedule-card__number">Платёж {entry.number}</span>
              <span className="schedule-card__date">{entry.date}</span>
            </div>
            <div className="schedule-card__bottom">
              <div>
                <span className="schedule-card__label">Сумма</span>
                <strong>{formatCurrency(entry.amount)}</strong>
              </div>
              <div>
                <span className="schedule-card__label">Остаток</span>
                <strong>{formatCurrency(entry.remainingDebt)}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="schedule-table-wrap">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Дата платежа</th>
              <th>Сумма</th>
              <th>Остаток долга</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((entry) => (
              <tr key={entry.number}>
                <td>{entry.number}</td>
                <td>{entry.date}</td>
                <td>{formatCurrency(entry.amount)}</td>
                <td>{formatCurrency(entry.remainingDebt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
