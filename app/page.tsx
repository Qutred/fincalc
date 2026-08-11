import Link from "next/link";
import { Gift, Lock, Zap } from "lucide-react";
import { CalculatorsSection } from "@/components/calculators-section";
import styles from "./page.module.css";

const benefits = [
  {
    title: "Instant results",
    description:
      "Every number updates the moment you change an input. No waiting, no page reloads.",
    icon: Zap,
  },
  {
    title: "Private by design",
    description:
      "Everything is calculated in your browser. Your financial details never leave your device.",
    icon: Lock,
  },
  {
    title: "Free forever",
    description:
      "No accounts, no sign-ups, no paywalls. Just clear numbers, whenever you need them.",
    icon: Gift,
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
          <p className={styles.brandTag}>Mortgage &amp; savings calculators</p>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>
            Two decisions. Two calculators. Zero guesswork.
          </p>
          <h1 className={styles.title}>
            The numbers behind{" "}
            <span className={styles.accentTeal}>buying a home</span> — and{" "}
            <span className={styles.accentAmber}>growing your savings</span>.
          </h1>
          <p className={styles.subtitle}>
            FinCalc is a pair of honest, browser-only calculators: mortgage
            repayments and compound interest. Drag a slider, read the answer.
            Every figure updates instantly, and nothing you type ever leaves
            this page.
          </p>
        </section>

        <CalculatorsSection />

        <section className={styles.benefits}>
          <h2 className={styles.benefitsHeading}>Why FinCalc</h2>
          <div className={styles.benefitGrid}>
            {benefits.map((benefit) => (
              <div key={benefit.title} className={styles.benefit}>
                <span className={styles.benefitIcon} aria-hidden="true">
                  <benefit.icon className={styles.benefitIconSvg} />
                </span>
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
