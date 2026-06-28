import type { CalculationResult, CalculatorInput, PaymentEntry } from '../types/calculator';
import { MAX_MARKUP_PERCENT, MIN_MARKUP_PERCENT, getMarkupPercent } from './markup';

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function buildPaymentAmounts(amountToFinance: number, termMonths: number): number[] {
  const basePayment = Math.floor(amountToFinance / termMonths);
  let remainder = amountToFinance - basePayment * termMonths;
  const payments = Array.from({ length: termMonths }, () => basePayment);

  for (let index = payments.length - 1; index >= 0 && remainder > 0; index -= 1) {
    payments[index] += 1;
    remainder -= 1;
  }

  return payments;
}

export function calculateInstallment(input: CalculatorInput): CalculationResult {
  const fallbackMarkupPercent = getMarkupPercent(input.termMonths);
  const markupPercent = Number.isFinite(input.markupPercent)
    ? Math.min(MAX_MARKUP_PERCENT, Math.max(MIN_MARKUP_PERCENT, input.markupPercent))
    : fallbackMarkupPercent;
  const totalPrice = Math.round(input.productCost * (1 + markupPercent / 100));
  const amountToFinance = Math.max(totalPrice - input.downPayment, 0);
  const paymentAmounts = buildPaymentAmounts(amountToFinance, input.termMonths);
  const startDate = new Date(input.startDate);

  let remainingDebt = amountToFinance;
  const schedule: PaymentEntry[] = paymentAmounts.map((amount, index) => {
    remainingDebt -= amount;

    return {
      number: index + 1,
      date: formatScheduleDate(addMonths(startDate, index + 1)),
      amount,
      remainingDebt: Math.max(remainingDebt, 0),
    };
  });

  const monthlyPayment = paymentAmounts[0] ?? 0;
  const totalPayments = input.downPayment + amountToFinance;

  return {
    productCost: input.productCost,
    downPayment: input.downPayment,
    termMonths: input.termMonths,
    startDate: input.startDate,
    markupPercent,
    totalPrice,
    monthlyPayment,
    totalPayments,
    overpayment: totalPrice - input.productCost,
    schedule,
  };
}

function formatScheduleDate(date: Date): string {
  return date.toLocaleDateString('ru-RU');
}

export function getDefaultStartDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(1);
  return date.toISOString().slice(0, 10);
}
