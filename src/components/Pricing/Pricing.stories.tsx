import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pricing } from './Pricing';

const meta = {
  title: 'Components/Pricing',
  component: Pricing,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `A 3-tier pricing section with monthly/annual toggle. Pure CSS Modules — no Tailwind, no framer-motion. Themeable via CSS custom properties:

- \`--wb-accent\` (default \`#B51A2B\`) — brand / popular color
- \`--wb-surface\` — card background
- \`--wb-border\` — card & toggle border
- \`--wb-fg\` / \`--wb-fg-muted\` — foreground colors

## Usage

\`\`\`tsx
import '@warmbros/components/styles.css';
import { Pricing } from '@warmbros/components';

<Pricing plans={plans} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Pricing>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
  {
    name: 'STARTER',
    price: '50',
    yearlyPrice: '40',
    period: 'per month',
    features: [
      'Up to 10 projects',
      'Basic analytics',
      '48-hour support response',
      'Limited API access',
      'Community support',
    ],
    description: 'Perfect for individuals and small projects',
    buttonText: 'Start Free Trial',
    href: '#',
    isPopular: false,
  },
  {
    name: 'PROFESSIONAL',
    price: '99',
    yearlyPrice: '79',
    period: 'per month',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      '24-hour support response',
      'Full API access',
      'Priority support',
      'Team collaboration',
    ],
    description: 'Ideal for growing teams and businesses',
    buttonText: 'Get Started',
    href: '#',
    isPopular: true,
  },
  {
    name: 'ENTERPRISE',
    price: '299',
    yearlyPrice: '239',
    period: 'per month',
    features: [
      'Everything in Professional',
      'Custom solutions',
      'Dedicated account manager',
      'SSO Authentication',
      'SLA agreement',
    ],
    description: 'For large organizations',
    buttonText: 'Contact Sales',
    href: '#',
    isPopular: false,
  },
];

export const Default: Story = {
  args: { plans },
};

/** Custom accent color via CSS variable */
export const TealTheme: Story = {
  args: { plans },
  decorators: [
    (Story) => (
      <div style={{ '--wb-accent': '#14b8a6' } as React.CSSProperties}>
        <Story />
      </div>
    ),
  ],
};

export const DefaultToYearly: Story = {
  args: { plans, defaultBilling: 'yearly' },
};
