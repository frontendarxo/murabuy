import type { CalculationResult } from '../types/calculator';
import { formatCurrency } from './format';

const WHATSAPP_PHONE = '+79889033858';

export function buildCalculationMessage(result: CalculationResult): string {
  const scheduleLines = result.schedule
    .map(
      (entry) =>
        `${entry.number}. ${entry.date} — ${formatCurrency(entry.amount)} (остаток: ${formatCurrency(entry.remainingDebt)})`,
    )
    .join('\n');

  return [
    'Условия покупки в рассрочку',
    '',
    `Стоимость товара: ${formatCurrency(result.productCost)}`,
    `Итоговая стоимость: ${formatCurrency(result.totalPrice)}`,
    `Первоначальный взнос: ${formatCurrency(result.downPayment)}`,
    `Срок: ${result.termMonths} мес.`,
    `Ежемесячный платёж: ${formatCurrency(result.monthlyPayment)}`,
    `Общая сумма выплат: ${formatCurrency(result.totalPayments)}`,
    `Переплата: ${formatCurrency(result.overpayment)}`,
    '',
    'График платежей:',
    scheduleLines,
    '',
    'Для оформления прошу предоставить:',
    '— Паспорт покупателя',
    '— Паспорт поручителя',
    '— Контактный номер телефона',
  ].join('\n');
}

export function buildWhatsAppUrl(result: CalculationResult): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildCalculationMessage(result))}`;
}
