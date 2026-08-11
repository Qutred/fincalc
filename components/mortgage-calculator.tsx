"use client";

import { useMemo } from "react";
import { Home } from "lucide-react";
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useNumericControl } from "@/hooks/use-numeric-control";
import {
  calculateMortgage,
  currencySymbol,
  formatCompact,
  formatMoney,
  mortgageSchedule,
  type Currency,
} from "@/lib/calculators";

const chartConfig = {
  balance: {
    label: "Balance outstanding",
    theme: { light: "#0f766e", dark: "#2dd4bf" },
  },
} satisfies ChartConfig;

interface MortgageCalculatorProps {
  currency: Currency;
}

export function MortgageCalculator({ currency }: MortgageCalculatorProps) {
  const loan = useNumericControl(300000, 50000, 2000000, 5000);
  const rate = useNumericControl(5, 0, 12, 0.05);
  const term = useNumericControl(25, 1, 40, 1);

  const input = useMemo(
    () => ({
      loanAmount: loan.value,
      annualRatePercent: rate.value,
      termYears: term.value,
    }),
    [loan.value, rate.value, term.value],
  );

  const result = useMemo(() => calculateMortgage(input), [input]);
  const schedule = useMemo(() => mortgageSchedule(input), [input]);

  const total = result.principalShare + result.interestShare;
  const principalPct = total > 0 ? (result.principalShare / total) * 100 : 100;
  const interestPct = Math.max(0, 100 - principalPct);

  const chartData = useMemo(
    () =>
      schedule.map((point) => ({
        year: point.year,
        balance: Math.round(point.balance),
      })),
    [schedule],
  );

  return (
    <Card className="h-full [--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex size-7 items-center justify-center rounded-md bg-[var(--accent-teal-soft)] text-[var(--accent-teal)]">
            <Home className="size-4" aria-hidden="true" />
          </span>
          Mortgage repayments
        </CardTitle>
        <CardDescription>
          See your monthly payment and what the loan really costs over time.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <FieldGroup className="gap-6">
          <CalculatorInput
            id="mortgage-loan"
            label="Loan amount"
            prefix={currencySymbol(currency)}
            text={loan.text}
            onTextChange={loan.setFromText}
            value={loan.value}
            onValueChange={loan.setFromSlider}
            min={50000}
            max={2000000}
            step={5000}
          />
          <CalculatorInput
            id="mortgage-rate"
            label="Interest rate"
            text={rate.text}
            onTextChange={rate.setFromText}
            value={rate.value}
            onValueChange={rate.setFromSlider}
            min={0}
            max={12}
            step={0.05}
            suffix="%"
          />
          <CalculatorInput
            id="mortgage-term"
            label="Loan term"
            text={term.text}
            onTextChange={term.setFromText}
            value={term.value}
            onValueChange={term.setFromSlider}
            min={1}
            max={40}
            step={1}
            suffix="yrs"
          />
        </FieldGroup>

        <Separator />

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Monthly repayment
              </span>
              <span className="font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                {formatMoney(result.monthlyPayment, currency)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {term.value} years at {rate.value.toLocaleString("en-GB")}% —
              {formatMoney(result.monthlyPayment * 12, currency)} a year
            </p>

            <div
              className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label="Proportion of total cost that is principal versus interest"
            >
              <div
                className="h-full bg-[var(--accent-teal)]"
                style={{ width: `${principalPct}%` }}
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
                Principal {formatMoney(result.principalShare, currency)}
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
                Total repaid
              </span>
              <span className="mt-1 block font-mono text-lg font-medium tabular-nums">
                {formatMoney(result.totalRepaid, currency)}
              </span>
            </div>
            <div className="rounded-lg border bg-muted/40 p-3">
              <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                Total interest
              </span>
              <span className="mt-1 block font-mono text-lg font-medium tabular-nums text-[var(--accent-amber)]">
                {formatMoney(result.totalInterest, currency)}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Balance over the term
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
                    id="mortgage-balance-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-balance)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-balance)"
                      stopOpacity={0.02}
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
                      formatter={(value) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            Balance outstanding
                          </span>
                          <span className="font-mono font-medium text-foreground tabular-nums">
                            {formatMoney(Number(value), currency)}
                          </span>
                        </div>
                      )}
                      nameKey="balance"
                    />
                  }
                />
                <Area
                  dataKey="balance"
                  type="monotone"
                  fill="url(#mortgage-balance-fill)"
                  stroke="var(--color-balance)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
