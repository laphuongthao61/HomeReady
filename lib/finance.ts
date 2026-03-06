import {
  FEES,
  GROWTH_RATES,
  FIXED_RATE_ANNUAL,
  VARIABLE_SPREAD,
  type City,
  type PropertyType,
} from "./constants";

export type { City, PropertyType };

// --- Money helpers ---
export function parseMoneyInput(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d]/g, "");
  if (!cleaned) return 0;
  return Number(cleaned) || 0;
}

export function formatMoneyInput(value: number): string {
  if (!value || !Number.isFinite(value)) return "";
  const rounded = Math.round(value);
  return rounded
    .toLocaleString("fr-FR")
    .replace(/\u202f/g, " ")
    .replace(/\xa0/g, " ");
}

export function formatVnd(value: number): string {
  const rounded = Math.round(value || 0);
  const formatted = rounded
    .toLocaleString("fr-FR")
    .replace(/\u202f/g, " ")
    .replace(/\xa0/g, " ");
  return `${formatted} đ`;
}

export function calcUpfrontAmt(
  presentPrice: number,
  downPct: number
): number {
  return presentPrice * (downPct + FEES.legalAndTaxPct);
}

export function getGrowthRate(city: string, propertyType: string): number {
  const normalize = (value: string) =>
    value.toLowerCase().trim().replace(/\s+/g, " ");

  const cityKey = normalize(city);
  const typeKey = normalize(propertyType);

  const cityMap: Record<string, City> = {
    hanoi: "Hanoi",
    hcm: "HCM",
    "ho chi minh city": "HCM",
    danang: "DaNang",
    "da nang": "DaNang",
  };

  const typeMap: Record<string, PropertyType> = {
    apartment: "Apartment",
    "ground house": "GroundHouse",
    groundhouse: "GroundHouse",
  };

  const mappedCity = cityMap[cityKey];
  const mappedType = typeMap[typeKey];

  if (!mappedCity || !mappedType) {
    console.warn("Unknown city or property type for growth rate", {
      city,
      propertyType,
    });
    // Fallback: conservative default growth rate
    return 0.06;
  }

  const rate = GROWTH_RATES[mappedCity]?.[mappedType];

  if (typeof rate !== "number") {
    console.warn("Missing growth rate for city/type", {
      city: mappedCity,
      propertyType: mappedType,
    });
    return 0.06;
  }

  return rate;
}

export function calcFuturePrice(
  presentPrice: number,
  growth: number,
  years: number
): number {
  return presentPrice * Math.pow(1 + growth, years);
}

export function calcFutureUpfrontAmt(
  futurePrice: number,
  downPct: number
): number {
  return futurePrice * (downPct + FEES.legalAndTaxPct);
}

export type AmortRow = {
  year: number;
  month: number;
  remaining: number;
  principal: number;
  interest: number;
  payment: number;
};

export function buildAmortSchedule(
  loan: number,
  termYears: number,
  fixedRateAnnual: number,
  variableRateAnnual: number,
  fixedYears: number = 3
): AmortRow[] {
  const rows: AmortRow[] = [];
  const monthlyPrincipal = loan / (termYears * 12);
  let remaining = loan;
  const totalMonths = termYears * 12;

  for (let m = 1; m <= totalMonths; m++) {
    const year = Math.ceil(m / 12);
    const annualRate =
      year <= fixedYears ? fixedRateAnnual : variableRateAnnual;
    const monthlyRate = annualRate / 12;
    const interest = remaining * monthlyRate;
    const principal = Math.min(monthlyPrincipal, remaining);
    const payment = principal + interest;

    rows.push({
      year,
      month: m,
      remaining,
      principal,
      interest,
      payment,
    });

    remaining -= principal;
    if (remaining <= 0) break;
  }

  return rows;
}

export function maxMonthlyPayment(rows: readonly AmortRow[]): number {
  if (rows.length === 0) return 0;
  return Math.max(...rows.map((r) => r.payment));
}

export type DownPaymentCheckInput = {
  presentPrice: number;
  currentSavings: number;
  downPaymentPercentage: number;
};

export type DownPaymentCheckResult = {
  required: number;
  missing: number;
  isEnough: boolean;
};

export function downPaymentCheck(
  input: DownPaymentCheckInput
): DownPaymentCheckResult {
  const { presentPrice, currentSavings, downPaymentPercentage } = input;
  const required = presentPrice * (downPaymentPercentage + 0.015);
  const missing = required - currentSavings;
  const isEnough = missing <= 0;
  return { required, missing, isEnough };
}

// --- savingsPlan ---
export type SavingsPlanParams =
  | {
      presentPrice: number;
      currentSavings: number;
      downPaymentPercentage: number;
      growthRate: number;
      years: number;
    }
  | {
      presentPrice: number;
      currentSavings: number;
      downPaymentPercentage: number;
      city: City;
      propertyType: PropertyType;
      numYears: number;
    };

export type SavingsPlanResult = {
  futurePrice: number;
  futureRequired: number;
  additionalNeeded: number;
  monthlySaving: number;
  futureAmt: number;
  requiredMonthly: number;
  fvCurrent: number;
  projectionData: { year: number; savings: number }[];
};

export function savingsPlan(params: SavingsPlanParams): SavingsPlanResult {
  const { presentPrice, currentSavings, downPaymentPercentage } = params;
  const growthRate =
    "growthRate" in params
      ? params.growthRate
      : getGrowthRate(params.city, params.propertyType);
  const years = "years" in params ? params.years : params.numYears;

  const futurePrice = presentPrice * Math.pow(1 + growthRate, years);
  const futureRequired = futurePrice * (downPaymentPercentage + 0.015);
  const additionalNeeded = futureRequired - currentSavings;
  const monthlySaving = additionalNeeded / (years * 12);

  const projectionData: { year: number; savings: number }[] = [];
  let savings = currentSavings;
  for (let y = 0; y <= years; y++) {
    projectionData.push({ year: y, savings });
    if (y < years) {
      savings += monthlySaving * 12;
    }
  }

  return {
    futurePrice,
    futureRequired,
    additionalNeeded,
    monthlySaving,
    futureAmt: futureRequired,
    requiredMonthly: monthlySaving,
    fvCurrent: currentSavings,
    projectionData,
  };
}

// --- getFundRecommendation ---
export type FundRecommendation = {
  fundName: string;
  expectedReturn: number;
};

export function getFundRecommendation(
  points: number,
  years: number
): FundRecommendation {
  if (points < 8) return { fundName: "VFF", expectedReturn: 0.075 };
  if (years > 10) return { fundName: "VEOF", expectedReturn: 0.178 };
  return { fundName: "VIBF", expectedReturn: 0.138 };
}

// --- mortgageCalculation ---
export type MortgageCalcParams =
  | {
      loan: number;
      termYears: number;
      fixedRate: number;
      variableRate: number;
    }
  | {
      presentPrice: number;
      futurePrice: number;
      downPaymentPercentage: number;
      termYears: number;
      expense: number;
      income: number;
      scenarioA: boolean;
      city: City;
      propertyType: PropertyType;
    };

export type MortgageCalcResult = {
  monthlyPrincipal: number;
  loan: number;
  highestMonthlyPayment: number;
  minimumRequiredIncome: number;
  canAfford: boolean;
  maxAffordablePrice?: number;
};

export function mortgageCalculation(
  params: MortgageCalcParams
): MortgageCalcResult {
  let loan: number;
  let termYears: number;
  let fixedRate: number;
  let variableRate: number;
  let income: number;
  let expense: number;

  if ("loan" in params) {
    ({ loan, termYears, fixedRate, variableRate } = params);
    income = 0;
    expense = 0;
  } else {
    const price = params.scenarioA ? params.presentPrice : params.futurePrice;
    loan = price * (1 - params.downPaymentPercentage - 0.015);
    termYears = params.termYears;
    fixedRate = FIXED_RATE_ANNUAL;
    variableRate = FIXED_RATE_ANNUAL + VARIABLE_SPREAD;
    income = params.income;
    expense = params.expense;
  }

  const monthlyPrincipal = loan / (termYears * 12);
  const rows = buildAmortSchedule(loan, termYears, fixedRate, variableRate);
  const highestMonthlyPayment = maxMonthlyPayment(rows);
  const minimumRequiredIncome = highestMonthlyPayment + expense;
  const canAfford = income >= minimumRequiredIncome;

  let maxAffordablePrice: number | undefined;
  if (!canAfford && income > expense && "downPaymentPercentage" in params) {
    const ddp = params.downPaymentPercentage;
    const maxLoan =
      (income - expense) * (loan / highestMonthlyPayment);
    maxAffordablePrice = maxLoan / (1 - ddp - 0.015);
  }

  return {
    monthlyPrincipal,
    loan,
    highestMonthlyPayment,
    minimumRequiredIncome,
    canAfford,
    maxAffordablePrice,
  };
}

// --- buildBatdongsanUrl ---
export function buildBatdongsanUrl(
  _price: number,
  _city: string,
  _type: string
): string {
  return "https://batdongsan.com.vn";
}
