"use client";

import React, { createContext, useContext, useState } from "react";

export type PlanInputs = {
  presentPrice: number;
  currentSavings: number;
  downPaymentPct: number;
  yearsToSave: number;
  city: "Hanoi" | "HCM" | "DaNang";
  propertyType: "Apartment" | "GroundHouse";
  savingMethod: "bank" | "fund";
  income: number;
  expense: number;
  mortgageTermYears: number;
  riskAnswers?: { q1: number; q2: number; q3: number; q4: number };
};

const defaultInputs: PlanInputs = {
  presentPrice: 0,
  currentSavings: 0,
  downPaymentPct: 20,
  yearsToSave: 5,
  city: "Hanoi",
  propertyType: "Apartment",
  savingMethod: "bank",
  income: 0,
  expense: 0,
  mortgageTermYears: 20,
};

type AppStateContextValue = {
  inputs: PlanInputs;
  setInputs: React.Dispatch<React.SetStateAction<PlanInputs>>;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<PlanInputs>(defaultInputs);

  return (
    <AppStateContext.Provider value={{ inputs, setInputs }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}
