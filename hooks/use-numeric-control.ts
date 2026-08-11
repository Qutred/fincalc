"use client";

import { useCallback, useState } from "react";

export function useNumericControl(
  initial: number,
  min: number,
  max: number,
  step: number,
) {
  const [value, setValue] = useState(initial);
  const [text, setText] = useState(String(initial));

  const clamp = useCallback(
    (n: number) => {
      if (Number.isNaN(n)) return initial;
      const snapped = Math.round(n / step) * step;
      return Math.min(max, Math.max(min, snapped));
    },
    [min, max, step, initial],
  );

  const setFromText = useCallback(
    (raw: string) => {
      setText(raw);
      if (raw === "" || raw === "-" || raw === "." || raw === "+") return;
      const n = Number(raw);
      if (Number.isNaN(n)) return;
      setValue(clamp(n));
    },
    [clamp],
  );

  const setFromSlider = useCallback(
    (n: number) => {
      const clamped = clamp(n);
      setValue(clamped);
      setText(String(clamped));
    },
    [clamp],
  );

  return { value, text, setFromText, setFromSlider };
}
