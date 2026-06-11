import type { CalculationResult } from '../types/calculator';
import { formatCurrency } from '../utils/format';

interface ResultsPanelProps {
  result: CalculationResult;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <section className="card card--results">
      <div className="card__head">
        <h2>Результат расчёта</h2>
        <p>Итоговые условия рассрочки по принципам мурабаха</p>
      </div>

      <div className="result-highlight">
        <span className="result-highlight__label">Ежемесячный платёж</span>
        <strong className="result-highlight__value">{formatCurrency(result.monthlyPayment)}</strong>
        <span className="result-highlight__meta">
          × {result.termMonths} {getMonthsLabel(result.termMonths)}
        </span>
      </div>

      <dl className="metrics">
        <div className="metrics__item">
          <dt>Итоговая стоимость</dt>
          <dd>{formatCurrency(result.totalPrice)}</dd>
        </div>
        <div className="metrics__item">
          <dt>Стоимость товара</dt>
          <dd>{formatCurrency(result.productCost)}</dd>
        </div>
        <div className="metrics__item">
          <dt>Первоначальный взнос</dt>
          <dd>{formatCurrency(result.downPayment)}</dd>
        </div>
        <div className="metrics__item">
          <dt>Общая сумма выплат</dt>
          <dd>{formatCurrency(result.totalPayments)}</dd>
        </div>
        <div className="metrics__item metrics__item--accent">
          <dt>Размер переплаты</dt>
          <dd>{formatCurrency(result.overpayment)}</dd>
        </div>
        <div className="metrics__item">
          <dt>Наценка</dt>
          <dd>{result.markupPercent}%</dd>
        </div>
      </dl>

      <p className="disclaimer">
        Расчёт предварительный. Итоговые условия подтверждает менеджер MURABUY.
      </p>
    </section>
  );
}

function getMonthsLabel(months: number): string {
  const mod10 = months % 10;
  const mod100 = months % 100;

  if (mod100 >= 11 && mod100 <= 14) return 'месяцев';
  if (mod10 === 1) return 'месяц';
  if (mod10 >= 2 && mod10 <= 4) return 'месяца';
  return 'месяцев';
}
