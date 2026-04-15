import type { ReactNode } from 'react';
import styles from './Footer.module.css';

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterSocialLink {
  icon: ReactNode;
  href: string;
  label: string;
}

export interface FooterProps {
  /** Logo mark (typically an SVG or image) */
  logo?: ReactNode;
  /** Brand wordmark */
  brandName: string;
  /** Social icon links (rendered as circular icon buttons) */
  socialLinks?: FooterSocialLink[];
  /** Primary navigation links */
  mainLinks?: FooterLink[];
  /** Secondary / legal links */
  legalLinks?: FooterLink[];
  /** Copyright block */
  copyright: {
    text: string;
    /** Optional sub-line (e.g. "Built with passion") */
    license?: string;
  };
  /** Extra class on the root element */
  className?: string;
}

export function Footer({
  logo,
  brandName,
  socialLinks = [],
  mainLinks = [],
  legalLinks = [],
  copyright,
  className,
}: FooterProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  return (
    <footer className={rootClass}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <a href="/" className={styles.brand} aria-label={brandName}>
            {logo && <span className={styles.logo}>{logo}</span>}
            <span className={styles.brandName}>{brandName}</span>
          </a>
          {socialLinks.length > 0 && (
            <ul className={styles.socials}>
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={styles.socialBtn}
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.copyright}>
            <div>{copyright.text}</div>
            {copyright.license && (
              <div className={styles.license}>{copyright.license}</div>
            )}
          </div>

          {mainLinks.length > 0 && (
            <nav aria-label="Main">
              <ul className={styles.linkList}>
                {mainLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className={styles.mainLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {legalLinks.length > 0 && (
            <nav aria-label="Legal">
              <ul className={styles.linkList}>
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className={styles.legalLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
