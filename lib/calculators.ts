export type Currency = "GBP" | "USD" | "EUR";

export const CURRENCIES: {
  value: Currency;
  symbol: string;
  label: string;
}[] = [
  { value: "GBP", symbol: "£", label: "GBP" },
  { value: "USD", symbol: "$", label: "USD" },
  { value: "EUR", symbol: "€", label: "EUR" },
];

export function currencySymbol(currency: Currency): string {
  return CURRENCIES.find((c) => c.value === currency)?.symbol ?? "£";
}

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export interface MortgageInput {
  loanAmount: number;
  annualRatePercent: number;
  termYears: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  totalRepaid: number;
  totalInterest: number;
  principalShare: number;
  interestShare: number;
}

export function calculateMortgage({
  loanAmount,
  annualRatePercent,
  termYears,
}: MortgageInput): MortgageResult {
  const monthlyRate = annualRatePercent / 100 / 12;
  const months = termYears * 12;
  const growth = Math.pow(1 + monthlyRate, months);
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate * growth) / (growth - 1);
  const totalRepaid = monthlyPayment * months;
  const totalInterest = totalRepaid - loanAmount;

  return {
    loanAmount,
    monthlyPayment,
    totalRepaid,
    totalInterest,
    principalShare: loanAmount,
    interestShare: Math.max(0, totalInterest),
  };
}

export interface MortgageYearPoint {
  year: number;
  balance: number;
  interestPaid: number;
}

export function mortgageSchedule({
  loanAmount,
  annualRatePercent,
  termYears,
}: MortgageInput): MortgageYearPoint[] {
  const monthlyRate = annualRatePercent / 100 / 12;
  const months = termYears * 12;
  const growth = Math.pow(1 + monthlyRate, months);
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate * growth) / (growth - 1);

  const points: MortgageYearPoint[] = [];
  let balance = loanAmount;
  let cumulativeInterest = 0;

  for (let year = 1; year <= termYears; year++) {
    const monthsInYear = Math.min(12, months - (year - 1) * 12);
    for (let month = 0; month < monthsInYear; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      cumulativeInterest += interest;
    }
    points.push({
      year,
      balance: Math.max(0, balance),
      interestPaid: cumulativeInterest,
    });
  }

  return points;
}

export type CompoundingFrequency = "monthly" | "quarterly" | "yearly";
export type ContributionFrequency = "monthly" | "yearly";

export const COMPOUNDING_OPTIONS: {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: "monthly", label: "Monthly", periodsPerYear: 12 },
  { value: "quarterly", label: "Quarterly", periodsPerYear: 4 },
  { value: "yearly", label: "Yearly", periodsPerYear: 1 },
];

export const CONTRIBUTION_OPTIONS: {
  value: ContributionFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: "monthly", label: "Monthly", periodsPerYear: 12 },
  { value: "yearly", label: "Yearly", periodsPerYear: 1 },
];

export interface CompoundInput {
  principal: number;
  contribution: number;
  annualRatePercent: number;
  years: number;
  compounding: CompoundingFrequency;
  contributionFrequency: ContributionFrequency;
}

export interface CompoundResult {
  futureValue: number;
  totalInvested: number;
  interestEarned: number;
  contributionShare: number;
  interestShare: number;
}

export function calculateCompound({
  principal,
  contribution,
  annualRatePercent,
  years,
  compounding,
  contributionFrequency,
}: CompoundInput): CompoundResult {
  const compoundingPeriods =
    COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ??
    12;
  const contributionPeriods =
    CONTRIBUTION_OPTIONS.find((o) => o.value === contributionFrequency)
      ?.periodsPerYear ?? 12;

  const nominal = annualRatePercent / 100;
  const periodRate =
    Math.pow(
      1 + nominal / compoundingPeriods,
      compoundingPeriods / contributionPeriods,
    ) - 1;
  const periods = contributionPeriods * years;

  let futureValue: number;
  if (periodRate === 0) {
    futureValue = principal + contribution * periods;
  } else {
    const growth = Math.pow(1 + periodRate, periods);
    futureValue =
      principal * growth + contribution * ((growth - 1) / periodRate);
  }

  const totalInvested = principal + contribution * periods;
  const interestEarned = Math.max(0, futureValue - totalInvested);

  return {
    futureValue,
    totalInvested,
    interestEarned,
    contributionShare: totalInvested,
    interestShare: interestEarned,
  };
}

export interface CompoundYearPoint {
  year: number;
  balance: number;
  invested: number;
}

export function compoundSchedule({
  principal,
  contribution,
  annualRatePercent,
  years,
  compounding,
  contributionFrequency,
}: CompoundInput): CompoundYearPoint[] {
  const compoundingPeriods =
    COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ??
    12;
  const contributionPeriods =
    CONTRIBUTION_OPTIONS.find((o) => o.value === contributionFrequency)
      ?.periodsPerYear ?? 12;

  const nominal = annualRatePercent / 100;
  const periodRate =
    Math.pow(
      1 + nominal / compoundingPeriods,
      compoundingPeriods / contributionPeriods,
    ) - 1;

  const points: CompoundYearPoint[] = [];
  for (let year = 1; year <= years; year++) {
    const periods = contributionPeriods * year;
    let balance: number;
    if (periodRate === 0) {
      balance = principal + contribution * periods;
    } else {
      const growth = Math.pow(1 + periodRate, periods);
      balance = principal * growth + contribution * ((growth - 1) / periodRate);
    }
    points.push({
      year,
      balance,
      invested: principal + contribution * periods,
    });
  }

  return points;
}
