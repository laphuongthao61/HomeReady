"use client";

import { useState, useMemo, useEffect } from "react";
import Stepper from "@/components/Stepper";
import FormField from "@/components/FormField";
import ResultCard from "@/components/ResultCard";
import { listings } from "@/lib/data";
import {
  downPaymentCheck,
  savingsPlan,
  getFundRecommendation,
  mortgageCalculation,
  buildBatdongsanUrl,
  formatVnd,
  parseMoneyInput,
  formatMoneyInput,
  type City,
  type PropertyType,
} from "@/lib/finance";

export default function PlannerPage() {
  const [step, setStep] = useState(0);

  // Step 1.1
  const [presentPrice, setPresentPrice] = useState(3000000000);
  const [currentSavings, setCurrentSavings] = useState(500000000);
  const [downPaymentPct, setDownPaymentPct] = useState(0.2);
  const [presentPriceInput, setPresentPriceInput] = useState(
    formatMoneyInput(3000000000)
  );
  const [currentSavingsInput, setCurrentSavingsInput] = useState(
    formatMoneyInput(500000000)
  );

  // Step 1.2 (Scenario B)
  const [numYears, setNumYears] = useState(5);
  const [city, setCity] = useState<City>("Hanoi");
  const [propertyType, setPropertyType] = useState<PropertyType>("Apartment");

  // Step 1.3
  const [quizAnswers, setQuizAnswers] = useState<number[]>([0, 0, 0, 0]);

  // Step 2
  const [termYears, setTermYears] = useState(20);
  const [expense, setExpense] = useState(10000000);
  const [income, setIncome] = useState(30000000);
  const [expenseInput, setExpenseInput] = useState(
    formatMoneyInput(10000000)
  );
  const [incomeInput, setIncomeInput] = useState(
    formatMoneyInput(30000000)
  );

  // Shared: selected property for calculations
  const [selectedListingId, setSelectedListingId] = useState<string>("");

  const normalizeKey = (value: string) =>
    value.toLowerCase().trim().replace(/\s+/g, " ");

  const matchingListings = useMemo(
    () =>
      listings.filter(
        (l) =>
          normalizeKey(l.city) === normalizeKey(city) &&
          normalizeKey(l.propertyType) === normalizeKey(propertyType)
      ),
    [city, propertyType]
  );

  // Auto-select property when there is an obvious choice
  useEffect(() => {
    if (matchingListings.length === 1) {
      setSelectedListingId(matchingListings[0].id);
    } else if (
      matchingListings.length > 1 &&
      !matchingListings.some((l) => l.id === selectedListingId)
    ) {
      // Consistently pick the first when none selected or previous selection no longer valid
      setSelectedListingId(matchingListings[0].id);
    } else if (matchingListings.length === 0) {
      setSelectedListingId("");
    }
  }, [matchingListings, selectedListingId]);

  // When a property is selected, use its price as the base presentPrice
  useEffect(() => {
    const selected = matchingListings.find((l) => l.id === selectedListingId);
    if (!selected) return;
    setPresentPrice(selected.priceVnd);
    setPresentPriceInput(formatMoneyInput(selected.priceVnd));
  }, [matchingListings, selectedListingId]);

  const dpResult = downPaymentCheck({
    presentPrice,
    currentSavings,
    downPaymentPercentage: downPaymentPct,
  });

  const savingsResult = dpResult.isEnough
    ? null
    : savingsPlan({
        presentPrice,
        currentSavings,
        downPaymentPercentage: downPaymentPct,
        numYears,
        city,
        propertyType,
      });

  const quizPoints = quizAnswers.reduce((a, b) => a + b, 0);
  const fundRec = getFundRecommendation(quizPoints, numYears);

  const futurePrice = dpResult.isEnough
    ? presentPrice
    : savingsResult?.futurePrice ?? presentPrice;

  const mortgageResult = mortgageCalculation({
    presentPrice,
    futurePrice,
    downPaymentPercentage: downPaymentPct,
    termYears,
    expense,
    income,
    scenarioA: dpResult.isEnough,
    city,
    propertyType,
  });

  // Stepper: Scenario A = 2 steps, Scenario B = 4 steps
  const stepperSteps = dpResult.isEnough
    ? [
        { id: "downpayment", label: "Down Payment" },
        { id: "mortgage", label: "Mortgage" },
      ]
    : [
        { id: "downpayment", label: "Down Payment" },
        { id: "savings", label: "Savings Plan" },
        { id: "fund", label: "Fund Quiz" },
        { id: "mortgage", label: "Mortgage" },
      ];

  const stepperIndex = dpResult.isEnough
    ? step === 0 ? 0 : 1
    : step;

  const handleNext = () => {
    if (dpResult.isEnough) {
      if (step === 0) setStep(1);
    } else {
      if (step < 3) setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const setQuizAnswer = (index: number, value: number) => {
    setQuizAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        HomeReady Planner
      </h1>
      <p className="text-slate-600 mb-10">
        Plan your home purchase with down payment and mortgage calculations.
      </p>

      <Stepper steps={stepperSteps} currentStep={stepperIndex} />

      {/* Step 0: Down Payment Check */}
      {step === 0 && (
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Property price (VND)
            </label>
            <div className="relative">
              <input
                type="text"
                value={presentPriceInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  const numeric = parseMoneyInput(raw);
                  setPresentPrice(numeric);
                  setPresentPriceInput(
                    raw === "" ? "" : formatMoneyInput(numeric)
                  );
                }}
                placeholder="e.g. 3 000 000 000"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Current savings (VND)
            </label>
            <div className="relative">
              <input
                type="text"
                value={currentSavingsInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  const numeric = parseMoneyInput(raw);
                  setCurrentSavings(numeric);
                  setCurrentSavingsInput(
                    raw === "" ? "" : formatMoneyInput(numeric)
                  );
                }}
                placeholder="e.g. 500 000 000"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>
          </div>
          <FormField
            label="Down payment %"
            type="number"
            value={downPaymentPct}
            onChange={(value) => setDownPaymentPct(Number(value))}
              min={0.1}
            max={0.5}
            step={0.05}
          />

          <div className="bg-slate-50 rounded-xl p-6 space-y-4">
            <ResultCard
              title="Required amount (price × down% + 1.5%)"
              value={formatVnd(dpResult.required)}
            />
            {dpResult.isEnough ? (
              <ResultCard
                title="Status"
                value="You have enough for down payment"
                variant="success"
              />
            ) : (
              <ResultCard
                title="Missing amount"
                value={formatVnd(dpResult.missing)}
                variant="warning"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition"
            >
              {dpResult.isEnough ? "Continue to Mortgage" : "Savings Plan →"}
            </button>
          </div>
        </div>
      )}

      {/* Step 1 for Scenario B: Savings Plan */}
      {step === 1 && !dpResult.isEnough && savingsResult && (
        <div className="space-y-6">
          <FormField
            label="Years to save"
            type="number"
            value={numYears}
            onChange={(v) => setNumYears(Number(v))}
            min={1}
            max={20}
          />
          <FormField
            label="City"
            type="select"
            value={city}
            onChange={(v) => setCity(v as City)}
            options={[
              { value: "Hanoi", label: "Hanoi" },
              { value: "HCM", label: "HCM" },
              { value: "DaNang", label: "Da Nang" },
            ]}
          />
          <FormField
            label="Property type"
            type="select"
            value={propertyType}
            onChange={(v) => setPropertyType(v as PropertyType)}
            options={[
              { value: "Apartment", label: "Apartment" },
              { value: "Ground House", label: "Ground House" },
            ]}
          />

          {matchingListings.length > 0 ? (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Select property
              </label>
              <select
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              >
                {matchingListings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title} — {listing.district}, {listing.city} (
                    {formatVnd(listing.priceVnd)})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No matching properties found for this city and type. Using your
              custom property price instead.
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <ResultCard
              title="Future price"
              value={formatVnd(savingsResult.futurePrice)}
            />
            <ResultCard
              title="Future down payment needed"
              value={formatVnd(savingsResult.futureAmt)}
            />
            <ResultCard
              title="Current savings FV"
              value={formatVnd(savingsResult.fvCurrent)}
            />
            <ResultCard
              title="Monthly contribution"
              value={formatVnd(Math.ceil(savingsResult.requiredMonthly))}
              variant="warning"
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Savings growth projection
            </h3>
            <div className="flex items-end gap-1 h-32">
              {savingsResult.projectionData.map((d) => (
                <div
                  key={d.year}
                  className="flex-1 bg-primary-500 rounded-t min-h-[4px] hover:bg-primary-600 transition"
                  style={{
                    height: `${
                      (d.savings /
                        Math.max(
                          ...savingsResult.projectionData.map((x) => x.savings)
                        )) *
                      100
                    }%`,
                  }}
                  title={`Year ${d.year}: ${formatVnd(d.savings)}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              {savingsResult.projectionData.map((d) => (
                <span key={d.year}>Y{d.year}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition"
            >
              Fund Quiz →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 for Scenario B: Fund Quiz */}
      {step === 2 && !dpResult.isEnough && (
        <div className="space-y-6">
          <h3 className="font-semibold text-slate-900">
            Fund Recommendation Quiz (1-4 points each)
          </h3>
          {[
            "How familiar are you with investing?",
            "What is your risk tolerance?",
            "How much time can you dedicate to monitoring?",
            "What is your investment experience?",
          ].map((q, i) => (
            <FormField
              key={i}
              label={q}
              type="select"
              value={quizAnswers[i]}
              onChange={(v) => setQuizAnswer(i, Number(v))}
              options={[
                { value: "0", label: "Select..." },
                { value: "1", label: "1 - Low" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4 - High" },
              ]}
            />
          ))}
          <ResultCard
            title="Recommended funds"
            value={`${fundRec.fundName} (${(fundRec.expectedReturn * 100).toFixed(1)}% expected)`}
            subtitle={`Points: ${quizPoints} | Horizon: ${numYears} years`}
            variant="success"
          />
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition"
            >
              Mortgage →
            </button>
          </div>
        </div>
      )}

      {/* Mortgage: Step 1 for Scenario A, Step 3 for Scenario B */}
      {(step === 1 && dpResult.isEnough) || (step === 3 && !dpResult.isEnough) ? (
        <div className="space-y-6">
          <FormField
            label="Loan term (years)"
            type="number"
            value={termYears}
            onChange={(v) => setTermYears(Number(v))}
            min={5}
            max={30}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Monthly expenses (VND)
            </label>
            <div className="relative">
              <input
                type="text"
                value={expenseInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  const numeric = parseMoneyInput(raw);
                  setExpense(numeric);
                  setExpenseInput(
                    raw === "" ? "" : formatMoneyInput(numeric)
                  );
                }}
                placeholder="e.g. 10 000 000"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Monthly income (VND)
            </label>
            <div className="relative">
              <input
                type="text"
                value={incomeInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  const numeric = parseMoneyInput(raw);
                  setIncome(numeric);
                  setIncomeInput(
                    raw === "" ? "" : formatMoneyInput(numeric)
                  );
                }}
                placeholder="e.g. 30 000 000"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <ResultCard
              title="Loan amount"
              value={formatVnd(mortgageResult.loan)}
            />
            <ResultCard
              title="Highest monthly payment"
              value={formatVnd(mortgageResult.highestMonthlyPayment)}
            />
            <ResultCard
              title="Min required income"
              value={formatVnd(mortgageResult.minimumRequiredIncome)}
            />
            <ResultCard
              title="Status"
              value={mortgageResult.canAfford ? "Can afford" : "Below threshold"}
              variant={mortgageResult.canAfford ? "success" : "warning"}
            />
          </div>

          {mortgageResult.canAfford ? (
            <a
              href="#"
              className="inline-block px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
            >
              Apply BIDV
            </a>
          ) : (
            mortgageResult.maxAffordablePrice !== undefined && (
              <a
                href={buildBatdongsanUrl(
                  mortgageResult.maxAffordablePrice,
                  city,
                  propertyType
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition"
              >
                Browse properties up to {formatVnd(mortgageResult.maxAffordablePrice)}
              </a>
            )
          )}

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
            >
              ← Back
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
