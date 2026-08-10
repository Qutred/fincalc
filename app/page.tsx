import Link from "next/link";
import styles from "./page.module.css";

const calculators = [
  {
    title: "Mortgage Repayment Calculator",
    description:
      "Plan your home loan with confidence. Estimate your monthly repayments, see how interest stacks up over the life of the loan, and explore how different terms and rates affect what you pay.",
    features: [
      "Monthly repayment estimates",
      "Total interest over the loan term",
      "Adjustable loan amount, rate, and term",
    ],
  },
  {
    title: "Compound Interest Calculator",
    description:
      "Watch your savings grow. Project how your money compounds over time with a variety of contribution schedules and frequencies, so you can set realistic goals.",
    features: [
      "Principal and monthly contributions",
      "Customizable compounding frequency",
      "Future value and interest earned projections",
    ],
  },
];

const benefits = [
  {
    title: "Instant results",
    description:
      "Every number updates the moment you change an input. No waiting, no page reloads.",
  },
  {
    title: "Private by design",
    description:
      "Everything is calculated in your browser. Your financial details never leave your device.",
  },
  {
    title: "Free forever",
    description:
      "No accounts, no sign-ups, no paywalls. Just clear numbers, whenever you need them.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandMark} aria-hidden="true">
              %
            </span>
            FinCalc
          </Link>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Smart money, made simple</p>
          <h1 className={styles.title}>
            Financial calculators that cut through the math.
          </h1>
          <p className={styles.subtitle}>
            FinCalc brings together the tools you need to plan your next big
            decision — buying a home or growing your savings — in one
            straightforward place.
          </p>
        </section>

        <section className={styles.calculators}>
          {calculators.map((calc) => (
            <article key={calc.title} className={styles.card}>
              <h2 className={styles.cardTitle}>{calc.title}</h2>
              <p className={styles.cardDescription}>{calc.description}</p>
              <ul className={styles.featureList}>
                {calc.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <span className={styles.comingSoon} aria-hidden="true">
                Coming soon
              </span>
            </article>
          ))}
        </section>

        <section className={styles.benefits}>
          <h2 className={styles.benefitsHeading}>Why FinCalc</h2>
          <div className={styles.benefitGrid}>
            {benefits.map((benefit) => (
              <div key={benefit.title} className={styles.benefit}>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} FinCalc. All rights reserved.</p>
      </footer>
    </div>
  );
}
