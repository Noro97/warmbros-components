import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `A branded footer with logo, socials, nav links, and copyright. Pure CSS Modules — icons come from you (pass any ReactNode). Themeable via CSS custom properties:

- \`--wb-accent\` — brand color
- \`--wb-border\` — separators
- \`--wb-surface\` — social button background
- \`--wb-fg\` — foreground

## Usage

\`\`\`tsx
import { Footer } from '@warmbros/components';
import { Github, Linkedin } from 'lucide-react';

<Footer
  brandName="WarmBros"
  socialLinks={[
    { icon: <Github />, href: '...', label: 'GitHub' },
  ]}
  mainLinks={[{ href: '#about', label: 'About' }]}
  copyright={{ text: '© 2026 WarmBros. All rights reserved.' }}
/>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple inline SVG icons for stories (keeps the lib icon-agnostic).
const iconStyle: React.CSSProperties = { width: 18, height: 18 };
const GithubIcon = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.3a11.4 11.4 0 0 1 6 0C17.3 4.3 18.3 4.6 18.3 4.6c.7 1.7.3 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.7-2.9 5.7-5.6 6 .5.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);
const TwitterIcon = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h3l-7 8 8 12h-7l-5-7-6 7H1l8-9L0 2h7l4 6 7-6Z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-2 6h4v12H2V10Zm6 0h4v2a4 4 0 0 1 7 3v7h-4v-6a2 2 0 0 0-4 0v6H8V10Z" />
  </svg>
);

export const Default: Story = {
  args: {
    brandName: 'WarmBros',
    socialLinks: [
      { icon: <GithubIcon />, href: 'https://github.com', label: 'GitHub' },
      { icon: <TwitterIcon />, href: 'https://twitter.com', label: 'Twitter' },
      { icon: <LinkedinIcon />, href: 'https://linkedin.com', label: 'LinkedIn' },
    ],
    mainLinks: [
      { href: '#features', label: 'Features' },
      { href: '#about', label: 'About' },
      { href: '#pricing', label: 'Pricing' },
      { href: '#contact', label: 'Contact' },
    ],
    legalLinks: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/cookies', label: 'Cookies' },
    ],
    copyright: {
      text: '© 2026 WarmBros. All rights reserved.',
      license: 'Built with passion and purpose',
    },
  },
};

export const Minimal: Story = {
  args: {
    brandName: 'Brand',
    copyright: { text: '© 2026 Brand' },
  },
};
