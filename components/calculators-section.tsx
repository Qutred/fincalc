"use client";

import { useState } from "react";

import { CompoundInterestCalculator } from "@/components/compound-interest-calculator";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CURRENCIES, type Currency } from "@/lib/calculators";

export function CalculatorsSection() {
  const [currency, setCurrency] = useState<Currency>("GBP");

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <p className="text-sm font-semibold tracking-widest text-[var(--accent-teal)] uppercase">
            Try it now
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Do the math before you decide.
          </h2>
          <p className="text-muted-foreground">
            Every figure updates the moment you move a slider. Nothing is
            stored, and nothing is sent anywhere — the math happens in your
            browser.
          </p>
        </div>
        <ToggleGroup
          value={[currency]}
          onValueChange={(value) => {
            if (value.length > 0) setCurrency(value[0] as Currency);
          }}
          aria-label="Currency"
          className="self-start sm:self-auto"
        >
          {CURRENCIES.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.symbol}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <MortgageCalculator currency={currency} />
        <CompoundInterestCalculator currency={currency} />
      </div>
    </section>
  );
}
