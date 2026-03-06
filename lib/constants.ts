export const FEES = {
  legalAndTaxPct: 0.015,
} as const;

export type City = "Hanoi" | "HCM" | "DaNang";
export type PropertyType = "Apartment" | "GroundHouse";

export const GROWTH_RATES: Record<City, Record<PropertyType, number>> = {
  Hanoi: { Apartment: 0.1, GroundHouse: 0.05 },
  DaNang: { Apartment: 0.07, GroundHouse: 0.06 },
  HCM: { Apartment: 0.11, GroundHouse: 0.05 },
};

export const FIXED_RATE_ANNUAL = 0.055;
export const VARIABLE_SPREAD = 0.03;
export const DEPOSIT_RATE_24M = 0.049;

export type Fund = {
  name: string;
  avgReturn5y: number;
  fee: number;
};

export const FUND_LIST: readonly Fund[] = [
  { name: "VFF", avgReturn5y: 0.075, fee: 0.0095 },
  { name: "VIBF", avgReturn5y: 0.138, fee: 0.0175 },
  { name: "VEOF", avgReturn5y: 0.178, fee: 0.0175 },
  { name: "VESAF", avgReturn5y: 0.219, fee: 0.0175 },
  { name: "FUEVN100", avgReturn5y: 0.135, fee: 0.0067 },
] as const;
