import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type { CalculationResult } from '../types/calculator';
import { formatCurrency } from '../utils/format';
import { registerPdfFonts } from './fonts';

registerPdfFonts();

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Manrope',
    fontSize: 10,
    color: '#111111',
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 140,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: '#3a3a3a',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 10,
    color: '#c9a35a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e3db',
  },
  rowLabel: {
    color: '#3a3a3a',
    flex: 1,
  },
  rowValue: {
    fontWeight: 700,
    textAlign: 'right',
    flex: 1,
  },
  partiesBox: {
    padding: 14,
    backgroundColor: '#f2f0eb',
    borderRadius: 8,
    marginBottom: 18,
  },
  partyRow: {
    marginBottom: 8,
  },
  partyLabel: {
    fontSize: 8,
    color: '#6f6a62',
    marginBottom: 3,
  },
  partyName: {
    fontSize: 11,
    fontWeight: 700,
  },
  highlight: {
    padding: 14,
    backgroundColor: '#111111',
    borderRadius: 8,
    marginBottom: 18,
  },
  highlightLabel: {
    color: '#d9bc7d',
    fontSize: 9,
    marginBottom: 4,
  },
  highlightValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 700,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f0eb',
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontWeight: 700,
    fontSize: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e3db',
  },
  colNumber: { width: '8%' },
  colDate: { width: '32%' },
  colAmount: { width: '30%' },
  colDebt: { width: '30%', textAlign: 'right' },
  disclaimer: {
    marginTop: 16,
    fontSize: 8,
    color: '#6f6a62',
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 12,
    fontSize: 8,
    color: '#6f6a62',
  },
});

interface MurabuyPdfDocumentProps {
  result: CalculationResult;
  buyerName: string;
  guarantorName: string;
  logoUrl: string;
  generatedAt: Date;
}

function formatGeneratedDate(date: Date): string {
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatStartDate(value: string): string {
  return new Date(value).toLocaleDateString('ru-RU');
}

export function MurabuyPdfDocument({
  result,
  buyerName,
  guarantorName,
  logoUrl,
  generatedAt,
}: MurabuyPdfDocumentProps) {
  const metrics = [
    ['Стоимость товара / услуги', formatCurrency(result.productCost)],
    ['Первоначальный взнос', formatCurrency(result.downPayment)],
    ['Срок рассрочки', `${result.termMonths} мес.`],
    ['Наценка', `${result.markupPercent}%`],
    ['Итоговая стоимость', formatCurrency(result.totalPrice)],
    ['Общая сумма выплат', formatCurrency(result.totalPayments)],
    ['Размер переплаты', formatCurrency(result.overpayment)],
    ['Дата начала платежей', formatStartDate(result.startDate)],
  ];

  return (
    <Document title="MURABUY — Расчёт рассрочки">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logoUrl} style={styles.logo} />
          <Text style={styles.title}>Расчёт исламской рассрочки</Text>
          <Text style={styles.subtitle}>MURABUY · мурабаха без процентной ставки</Text>
        </View>

        <View style={styles.partiesBox}>
          <View style={styles.partyRow}>
            <Text style={styles.partyLabel}>Покупатель (ФИО)</Text>
            <Text style={styles.partyName}>{buyerName}</Text>
          </View>
          <View>
            <Text style={styles.partyLabel}>Поручитель (ФИО)</Text>
            <Text style={styles.partyName}>{guarantorName}</Text>
          </View>
        </View>

        <View style={styles.highlight}>
          <Text style={styles.highlightLabel}>Ежемесячный платёж</Text>
          <Text style={styles.highlightValue}>{formatCurrency(result.monthlyPayment)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Условия расчёта</Text>
          {metrics.map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>График платежей</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colNumber}>№</Text>
            <Text style={styles.colDate}>Дата</Text>
            <Text style={styles.colAmount}>Сумма</Text>
            <Text style={styles.colDebt}>Остаток</Text>
          </View>
          {result.schedule.map((entry) => (
            <View key={entry.number} style={styles.tableRow}>
              <Text style={styles.colNumber}>{entry.number}</Text>
              <Text style={styles.colDate}>{entry.date}</Text>
              <Text style={styles.colAmount}>{formatCurrency(entry.amount)}</Text>
              <Text style={styles.colDebt}>{formatCurrency(entry.remainingDebt)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          Расчёт предварительный. Итоговые условия рассрочки подтверждает менеджер MURABUY.
          Для оформления потребуются паспорт покупателя, паспорт поручителя и контактный телефон.
        </Text>
        <Text style={styles.footer}>Документ сформирован: {formatGeneratedDate(generatedAt)}</Text>
      </Page>
    </Document>
  );
}
