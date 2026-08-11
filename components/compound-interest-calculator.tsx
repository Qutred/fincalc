"use client";

import { useMemo, useState } from "react";
import { PiggyBank } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { CalculatorInput } from "@/components/calculator-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNumericControl } from "@/hooks/use-numeric-control";
import {
  COMPOUNDING_OPTIONS,
  CONTRIBUTION_OPTIONS,
  calculateCompound,
  compoundSchedule,
  currencySymbol,
  formatCompact,
  formatMoney,
  type CompoundingFrequency,
  type ContributionFrequency,
  type Currency,
} from "@/lib/calculators";

const chartConfig = {
  invested: {
    label: "You put in",
    theme: { light: "#0f766e", dark: "#2dd4bf" },
  },
  interest: {
    label: "Interest earned",
    theme: { light: "#d97706", dark: "#fbbf24" },
  },
} satisfies ChartConfig;

interface CompoundInterestCalculatorProps {
  currency: Currency;
}

export function CompoundInterestCalculator({
  currency,
}: CompoundInterestCalculatorProps) {
  const principal = useNumericControl(10000, 0, 500000, 1000);
  const contribution = useNumericControl(200, 0, 5000, 50);
  const rate = useNumericControl(7, 0, 20, 0.25);
  const years = useNumericControl(20, 1, 60, 1);

  const [compounding, setCompounding] =
    useState<CompoundingFrequency>("monthly");
  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>("monthly");

  const input = useMemo(
    () => ({
      principal: principal.value,
      contribution: contribution.value,
      annualRatePercent: rate.value,
      years: years.value,
      compounding,
      contributionFrequency,
    }),
    [
      principal.value,
      contribution.value,
      rate.value,
      years.value,
      compounding,
      contributionFrequency,
    ],
  );

  const result = useMemo(() => calculateCompound(input), [input]);
  const schedule = useMemo(() => compoundSchedule(input), [input]);

  const total = result.contributionShare + result.interestShare;
  const investedPct =
    total > 0 ? (result.contributionShare / total) * 100 : 100;
  const interestPct = Math.max(0, 100 - investedPct);

  const chartData = useMemo(
    () =>
      schedule.map((point) => ({
        year: point.year,
        invested: Math.round(point.invested),
        interest: Math.round(Math.max(0, point.balance - point.invested)),
      })),
    [schedule],
  );

  const contributionLabel =
    contributionFrequency === "monthly"
      ? "Monthly contribution"
      : "Yearly contribution";

  return (
    <Card className="h-full [--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex size-7 items-center justify-center rounded-md bg-[var(--accent-amber-soft)] text-[var(--accent-amber)]">
            <PiggyBank className="size-4" aria-hidden="true" />
          </span>
          Compound interest
        </CardTitle>
        <CardDescription>
          Project how far regular saving plus compounding can take you.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <FieldGroup className="gap-6">
          <CalculatorInput
            id="compound-principal"
            label="Starting amount"
            prefix={currencySymbol(currency)}
            text={principal.text}
            onTextChange={principal.setFromText}
            value={principal.value}
            onValueChange={principal.setFromSlider}
            min={0}
            max={500000}
            step={1000}
          />
          <CalculatorInput
            id="compound-contribution"
            label={contributionLabel}
            prefix={currencySymbol(currency)}
            text={contribution.text}
            onTextChange={contribution.setFromText}
            value={contribution.value}
            onValueChange={contribution.setFromSlider}
            min={0}
            max={5000}
            step={50}
          />
          <CalculatorInput
            id="compound-rate"
            label="Expected return"
            text={rate.text}
            onTextChange={rate.setFromText}
            value={rate.value}
            onValueChange={rate.setFromSlider}
            min={0}
            max={20}
            step={0.25}
            suffix="%"
          />
          <CalculatorInput
            id="compound-years"
            label="Time horizon"
            text={years.text}
            onTextChange={years.setFromText}
            value={years.value}
            onValueChange={years.setFromSlider}
            min={1}
            max={60}
            step={1}
            suffix="yrs"
          />

          <Field>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <FieldLabel>Interest compounds</FieldLabel>
              <ToggleGroup
                value={[compounding]}
                onValueChange={(value) => {
                  if (value.length > 0)
                    setCompounding(value[0] as CompoundingFrequency);
                }}
                aria-label="How often interest compounds"
              >
                {COMPOUNDING_OPTIONS.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </Field>

          <Field>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <FieldLabel>Contribute</FieldLabel>
              <ToggleGroup
                value={[contributionFrequency]}
                onValueChange={(value) => {
                  if (value.length > 0)
                    setContributionFrequency(value[0] as ContributionFrequency);
                }}
                aria-label="How often you contribute"
              >
                {CONTRIBUTION_OPTIONS.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </Field>
        </FieldGroup>

        <Separator />

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Final balance
              </span>
              <span className="font-mono text-3xl font-semibold tracking-tight text-[var(--accent-teal)] tabular-nums">
                {formatMoney(result.futureValue, currency)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              After {years.value} years at {rate.value.toLocaleString("en-GB")}%
              compounded{" "}
              {compounding === "monthly"
                ? "monthly"
                : compounding === "quarterly"
                  ? "quarterly"
                  : "yearly"}
            </p>

            <div
              className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label="Proportion of the final balance that comes from your own contributions versus interest"
            >
              <div
                className="h-full bg-[var(--accent-teal)]"
                style={{ width: `${investedPct}%` }}
              />
              <div
                className="h-full bg-[var(--accent-amber)]"
                style={{ width: `${interestPct}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full bg-[var(--accent-teal)]"
                  aria-hidden="true"
                />
                You put in {formatMoney(result.contributionShare, currency)}
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full bg-[var(--accent-amber)]"
                  aria-hidden="true"
                />
                Interest {formatMoney(result.interestShare, currency)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-muted/40 p-3">
              <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                You put in
              </span>
              <span className="mt-1 block font-mono text-lg font-medium tabular-nums">
                {formatMoney(result.totalInvested, currency)}
              </span>
            </div>
            <div className="rounded-lg border bg-muted/40 p-3">
              <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                Interest earned
              </span>
              <span className="mt-1 block font-mono text-lg font-medium tabular-nums text-[var(--accent-amber)]">
                {formatMoney(result.interestEarned, currency)}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Balance growth over time
            </p>
            <ChartContainer
              config={chartConfig}
              className="aspect-[16/6] w-full"
            >
              <AreaChart
                data={chartData}
                margin={{ left: 4, right: 4, top: 4 }}
              >
                <defs>
                  <linearGradient
                    id="compound-invested-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-invested)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-invested)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickMargin={4}
                  tickFormatter={(value) => formatCompact(Number(value))}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const key = String(name);
                        const label =
                          key === "invested" ? "You put in" : "Interest earned";
                        return (
                          <div className="flex w-full items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                              {label}
                            </span>
                            <span className="font-mono font-medium text-foreground tabular-nums">
                              {formatMoney(Number(value), currency)}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Area
                  dataKey="invested"
                  stackId="growth"
                  type="monotone"
                  fill="url(#compound-invested-fill)"
                  stroke="var(--color-invested)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="interest"
                  stackId="growth"
                  type="monotone"
                  fill="var(--color-interest)"
                  stroke="var(--color-interest)"
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
