export interface CalculatorInput {
  productCost: number;
  downPayment: number;
  termMonths: number;
  startDate: string;
}

export interface PaymentEntry {
  number: number;
  date: string;
  amount: number;
  remainingDebt: number;
}

export interface CalculationResult {
  productCost: number;
  downPayment: number;
  termMonths: number;
  startDate: string;
  markupPercent: number;
  totalPrice: number;
  monthlyPayment: number;
  totalPayments: number;
  overpayment: number;
  schedule: PaymentEntry[];
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  input: CalculatorInput;
  result: CalculationResult;
}
