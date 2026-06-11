import type { CalculatorInput } from '../types/calculator';
import { getDefaultStartDate } from '../utils/calculator';
import { formatCurrency } from '../utils/format';
import { getMarkupPercent } from '../utils/markup';
import type { UseCalculatorReturn } from '../hooks/useCalculator';

interface CalculatorFormProps {
  input: CalculatorInput;
  markupPercent: number;
  onFieldChange: UseCalculatorReturn['updateField'];
  onApplyPreset: (preset: CalculatorInput) => void;
}

const PRESETS: { label: string; input: Omit<CalculatorInput, 'startDate'> }[] = [
  {
    label: '100 000 ₽ · взнос 25 000 ₽ · 6 мес.',
    input: {
      productCost: 100_000,
      downPayment: 25_000,
      termMonths: 6,
    },
  },
  {
    label: '100 000 ₽ · взнос 15 000 ₽ · 3 мес.',
    input: {
      productCost: 100_000,
      downPayment: 15_000,
      termMonths: 3,
    },
  },
];

export function CalculatorForm({
  input,
  markupPercent,
  onFieldChange,
  onApplyPreset,
}: CalculatorFormProps) {
  return (
    <section className="card card--form">
      <div className="card__head">
        <h2>Параметры расчёта</h2>
        <p>Укажите стоимость товара, взнос и срок рассрочки</p>
      </div>

      <div className="form-grid">
        <label className="field">
          <span className="field__label">Стоимость товара / услуги</span>
          <div className="field__control">
            <input
              type="number"
              min={1}
              max={10_000_000}
              step={1000}
              value={input.productCost}
              onChange={(event) => onFieldChange('productCost', Number(event.target.value))}
            />
            <span className="field__suffix">₽</span>
          </div>
        </label>

        <label className="field">
          <span className="field__label">Первоначальный взнос</span>
          <div className="field__control">
            <input
              type="number"
              min={0}
              max={input.productCost}
              step={1000}
              value={input.downPayment}
              onChange={(event) => onFieldChange('downPayment', Number(event.target.value))}
            />
            <span className="field__suffix">₽</span>
          </div>
          <span className="field__hint">От 0 ₽ до стоимости товара</span>
        </label>

        <label className="field">
          <span className="field__label">Срок рассрочки</span>
          <div className="field__control field__control--range">
            <input
              type="range"
              min={1}
              max={24}
              value={input.termMonths}
              onChange={(event) => onFieldChange('termMonths', Number(event.target.value))}
            />
            <output>{input.termMonths} мес.</output>
          </div>
        </label>

        <label className="field">
          <span className="field__label">Наценка по сроку</span>
          <div className="field__readonly">{markupPercent}%</div>
          <span className="field__hint">
            Фиксированная наценка {markupPercent}% для {input.termMonths} мес.
          </span>
        </label>

        <label className="field field--full">
          <span className="field__label">Дата начала платежей</span>
          <div className="field__control">
            <input
              type="date"
              value={input.startDate}
              onChange={(event) => onFieldChange('startDate', event.target.value)}
            />
          </div>
        </label>
      </div>

      <div className="examples">
        <span className="examples__title">Примеры расчёта</span>
        <div className="examples__list">
          {PRESETS.map((preset) => {
            const markup = getMarkupPercent(preset.input.termMonths);
            const total = Math.round(preset.input.productCost * (1 + markup / 100));

            return (
              <button
                key={preset.label}
                type="button"
                className="example-chip"
                onClick={() =>
                  onApplyPreset({
                    ...preset.input,
                    startDate: input.startDate || getDefaultStartDate(),
                  })
                }
              >
                {preset.label} · {formatCurrency(total)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
