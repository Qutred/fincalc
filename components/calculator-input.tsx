"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface CalculatorInputProps {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  text: string;
  onTextChange: (raw: string) => void;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export function CalculatorInput({
  id,
  label,
  prefix,
  suffix,
  text,
  onTextChange,
  value,
  onValueChange,
  min,
  max,
  step,
}: CalculatorInputProps) {
  return (
    <Field>
      <div className="flex w-full items-center justify-between gap-4">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <div className="flex items-center gap-1">
          {prefix ? (
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {prefix}
            </span>
          ) : null}
          <Input
            id={id}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            onBlur={() => onTextChange(String(value))}
            className="h-7 w-28 rounded-md text-right font-mono text-sm tabular-nums"
          />
          {suffix ? (
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(next) =>
          onValueChange(Array.isArray(next) ? next[0] : next)
        }
      />
    </Field>
  );
}
