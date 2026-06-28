import { useState } from 'react';
import type { CalculatorInput } from '../types/calculator';
import { getDefaultStartDate } from '../utils/calculator';
import { formatCurrency, formatNumber, parseInputNumber } from '../utils/format';
import {
  MAX_MARKUP_PERCENT,
  MAX_PRODUCT_COST,
  MIN_DOWN_PAYMENT,
  MIN_MARKUP_PERCENT,
  MIN_PRODUCT_COST,
  getMarkupPercent,
} from '../utils/markup';
import type { UseCalculatorReturn } from '../hooks/useCalculator';

interface CalculatorFormProps {
  input: CalculatorInput;
  onFieldChange: UseCalculatorReturn['updateField'];
  onApplyPreset: (preset: CalculatorInput) => void;
}

const PRESETS: { label: string; input: Omit<CalculatorInput, 'startDate' | 'markupPercent'> }[] = [
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

type NumericField = 'productCost' | 'downPayment' | 'markupPercent';
type MoneyField = 'productCost' | 'downPayment';

type NumericDrafts = Partial<Record<NumericField, string>>;

const MARKUP_STEP = 1;
const DIGITS_ONLY_PATTERN = '[0-9 ]*';
const NON_DIGIT_REGEXP = /\D/g;

function formatMoneyInput(value: string): string {
  const digits = value.replace(NON_DIGIT_REGEXP, '');
  return digits === '' ? '' : formatNumber(Number(digits));
}

export function CalculatorForm({
  input,
  onFieldChange,
  onApplyPreset,
}: CalculatorFormProps) {
  const [numericDrafts, setNumericDrafts] = useState<NumericDrafts>({});

  const handleNumberChange = (field: NumericField, value: string) => {
    setNumericDrafts((current) => ({ ...current, [field]: value }));

    if (value === '') return;

    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue)) {
      onFieldChange(field, parsedValue);
    }
  };

  const handleMoneyChange = (field: MoneyField, value: string) => {
    const formattedValue = formatMoneyInput(value);
    setNumericDrafts((current) => ({ ...current, [field]: formattedValue }));

    if (formattedValue === '') return;

    onFieldChange(field, parseInputNumber(formattedValue));
  };

  const restoreNumberValue = (field: NumericField) => {
    setNumericDrafts((current) => {
      const nextDrafts = { ...current };
      delete nextDrafts[field];
      return nextDrafts;
    });
  };

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
              type="text"
              inputMode="numeric"
              pattern={DIGITS_ONLY_PATTERN}
              aria-valuemin={MIN_PRODUCT_COST}
              aria-valuemax={MAX_PRODUCT_COST}
              value={numericDrafts.productCost ?? formatNumber(input.productCost)}
              onBlur={() => restoreNumberValue('productCost')}
              onChange={(event) => handleMoneyChange('productCost', event.target.value)}
            />
            <span className="field__suffix">₽</span>
          </div>
        </label>

        <label className="field">
          <span className="field__label">Первоначальный взнос</span>
          <div className="field__control">
            <input
              type="text"
              inputMode="numeric"
              pattern={DIGITS_ONLY_PATTERN}
              aria-valuemin={MIN_DOWN_PAYMENT}
              aria-valuemax={input.productCost}
              value={numericDrafts.downPayment ?? formatNumber(input.downPayment)}
              onBlur={() => restoreNumberValue('downPayment')}
              onChange={(event) => handleMoneyChange('downPayment', event.target.value)}
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
          <span className="field__label">Наценка</span>
          <div className="field__control">
            <input
              type="number"
              min={MIN_MARKUP_PERCENT}
              max={MAX_MARKUP_PERCENT}
              step={MARKUP_STEP}
              value={numericDrafts.markupPercent ?? input.markupPercent}
              onBlur={() => restoreNumberValue('markupPercent')}
              onChange={(event) => handleNumberChange('markupPercent', event.target.value)}
            />
            <span className="field__suffix">%</span>
          </div>
          <span className="field__hint">
            Можно менять вручную. Значение по умолчанию зависит от срока.
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
                    markupPercent: getMarkupPercent(preset.input.termMonths),
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
