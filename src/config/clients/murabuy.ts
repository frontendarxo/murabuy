import type { ClientConfig } from '../types';

export const clientConfig: ClientConfig = {
  brand: {
    name: 'MURABUY',
  },
  business: {
    locale: 'ru-RU',
  },
  documents: {
    title: 'MURABUY — Расчёт рассрочки',
    heading: 'Расчёт исламской рассрочки',
    subtitle: 'MURABUY · мурабаха без процентной ставки',
    disclaimer:
      'Расчёт предварительный. Итоговые условия рассрочки подтверждает менеджер MURABUY. Для оформления потребуются паспорт покупателя, паспорт поручителя и контактный телефон.',
  },
  features: {
    paymentSchedule: true,
  },
  theme: {
    pdf: {
      text: '#111111',
      surface: '#ffffff',
      mutedText: '#6f6a62',
      primary: '#c9a35a',
      border: '#e8e3db',
      background: '#f2f0eb',
      primaryLight: '#d9bc7d',
      white: '#ffffff',
    },
  },
};
