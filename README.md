# FinCalc

A privacy-first, browser-based financial calculator suite built with Next.js. Calculate mortgage repayments and compound interest growth — all calculations run locally in your browser with zero server round-trips.

## Features

### Mortgage Calculator

- **Monthly payment calculation** — See exact repayment amounts for any loan
- **Total cost breakdown** — Principal vs interest over the full term
- **Amortization chart** — Visualize balance declining year by year
- **Adjustable inputs** — Loan amount (£50k–£2M), rate (0–12%), term (1–40 years)
- **Real-time updates** — Sliders and text inputs sync instantly

### Compound Interest Calculator

- **Future value projection** — See what regular saving plus compounding achieves
- **Flexible compounding** — Monthly, quarterly, or yearly frequency
- **Contribution options** — Monthly or yearly contributions
- **Growth visualization** — Stacked area chart showing contributions vs interest earned
- **Adjustable inputs** — Starting amount, contribution, rate (0–20%), horizon (1–60 years)

### Shared Capabilities

- **Multi-currency support** — GBP (£), USD ($), EUR (€)
- **Zero server dependency** — All math runs client-side via Web APIs
- **Responsive design** — Works on mobile, tablet, and desktop
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigation
- **Light/Dark mode** — Automatic via CSS variables

## Tech Stack

| Category      | Technology                                           |
| ------------- | ---------------------------------------------------- |
| Framework     | Next.js 16 (App Router, React 19)                    |
| Language      | TypeScript 5                                         |
| Styling       | Tailwind CSS v4                                      |
| UI Components | shadcn/ui (via `@base-ui/react`), custom components  |
| Charts        | Recharts 3                                           |
| Icons         | Lucide React                                         |
| State/Utils   | `clsx`, `tailwind-merge`, `class-variance-authority` |
| Linting       | ESLint 9 (Next.js config)                            |
| Formatting    | Prettier 3                                           |

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn/pnpm/bun)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fincalc

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

## Project Structure

```
fincalc/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page with both calculators
│   ├── layout.tsx         # Root layout, fonts, metadata
│   ├── globals.css        # Global styles, CSS variables
│   └── page.module.css    # Page-specific styles
├── components/
│   ├── ui/                # shadcn/ui components (button, card, chart, etc.)
│   ├── calculator-input.tsx   # Unified slider + number input
│   ├── calculators-section.tsx  # Layout wrapper for both calculators
│   ├── compound-interest-calculator.tsx
│   └── mortgage-calculator.tsx
├── hooks/
│   └── use-numeric-control.ts  # Shared hook for slider/text sync
├── lib/
│   ├── calculators.ts     # Pure math functions (mortgage + compound)
│   └── utils.ts           # cn() helper for class merging
├── public/                # Static assets
├── components.json        # shadcn/ui config
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## How Calculations Work

All financial math lives in `lib/calculators.ts` — pure TypeScript functions with zero dependencies. This ensures:

- **Testability** — Functions are pure and deterministic
- **Portability** — Can run in any JS environment
- **Transparency** — Formulas are visible and auditable

### Mortgage Formula

Uses the standard amortizing loan formula:

```
monthlyPayment = P × r(1+r)^n / ((1+r)^n - 1)
```

Where:

- `P` = loan principal
- `r` = monthly interest rate (annual/12/100)
- `n` = total months (years × 12)

### Compound Interest Formula

Future value with regular contributions:

```
FV = P(1+r)^n + PMT × ((1+r)^n - 1) / r
```

Where:

- `P` = initial principal
- `PMT` = periodic contribution
- `r` = effective rate per contribution period
- `n` = total contribution periods

Compounding frequency and contribution frequency can differ — the code derives an effective per-contribution rate.

## Privacy

**No data leaves your browser.** No analytics, no tracking, no server-side calculation endpoints. The entire application is static after build — deployable to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

## Deployment

```bash
npm run build
```

The `out/` directory (or `.next/` for SSR) contains production-ready assets. Deploy to any platform supporting Next.js.

### Static Export (optional)

Add to `next.config.ts` for fully static hosting:

```ts
export default {
  output: "export",
  images: { unoptimized: true },
};
```

Then `npm run build` produces a self-contained `out/` folder.

## License

MIT — free to use, modify, and distribute.
