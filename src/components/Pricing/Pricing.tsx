import { useState, type ReactNode } from 'react';
import styles from './Pricing.module.css';

export interface PricingPlan {
  /** Plan name (e.g. "STARTER") */
  name: string;
  /** Monthly price as a string, without currency symbol */
  price: string;
  /** Yearly price (per month) as a string */
  yearlyPrice: string;
  /** Period label (e.g. "per month") */
  period: string;
  /** Feature bullet list */
  features: string[];
  /** Short subtitle shown under the CTA */
  description: string;
  /** CTA button text */
  buttonText: string;
  /** CTA button href */
  href: string;
  /** Highlight this plan as "popular" */
  isPopular?: boolean;
}

export interface PricingProps {
  plans: PricingPlan[];
  /** Section title (renders above the toggle) */
  title?: string;
  /** Section description */
  description?: string;
  /** Label for monthly billing toggle */
  monthlyLabel?: string;
  /** Label for yearly billing toggle */
  yearlyLabel?: string;
  /** Default billing mode */
  defaultBilling?: 'monthly' | 'yearly';
  /** Currency symbol prefix */
  currency?: string;
  /** Optional badge icon for the popular plan */
  popularBadge?: ReactNode;
  /** Extra class on the root element */
  className?: string;
}

export function Pricing({
  plans,
  title = 'Simple, Transparent Pricing',
  description = 'Choose the plan that works for you.',
  monthlyLabel = 'Monthly',
  yearlyLabel = 'Annual',
  defaultBilling = 'monthly',
  currency = '$',
  popularBadge = '★ Popular',
  className,
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(defaultBilling === 'monthly');

  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  return (
    <section className={rootClass}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </header>

      <div className={styles.toggle} role="group" aria-label="Billing period">
        <button
          type="button"
          className={`${styles.toggleBtn} ${isMonthly ? styles.toggleActive : ''}`}
          onClick={() => setIsMonthly(true)}
          aria-pressed={isMonthly}
        >
          {monthlyLabel}
        </button>
        <button
          type="button"
          className={`${styles.toggleBtn} ${!isMonthly ? styles.toggleActive : ''}`}
          onClick={() => setIsMonthly(false)}
          aria-pressed={!isMonthly}
        >
          {yearlyLabel}
        </button>
      </div>

      <div className={styles.grid}>
        {plans.map((plan, i) => {
          const price = isMonthly ? plan.price : plan.yearlyPrice;
          const cardClass = [
            styles.card,
            plan.isPopular ? styles.popular : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <article key={`${plan.name}-${i}`} className={cardClass}>
              {plan.isPopular && (
                <span className={styles.popularBadge}>{popularBadge}</span>
              )}
              <p className={styles.planName}>{plan.name}</p>
              <div className={styles.priceRow}>
                <span className={styles.currency}>{currency}</span>
                <span className={styles.price}>{price}</span>
                <span className={styles.period}>/ {plan.period}</span>
              </div>
              <p className={styles.billingNote}>
                {isMonthly ? 'billed monthly' : 'billed annually'}
              </p>
              <ul className={styles.features}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.feature}>
                    <span className={styles.check} aria-hidden="true">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`${styles.cta} ${plan.isPopular ? styles.ctaPopular : ''}`}
              >
                {plan.buttonText}
              </a>
              <p className={styles.subDescription}>{plan.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
