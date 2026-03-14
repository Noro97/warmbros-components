import type { Meta, StoryObj } from '@storybook/react';
import { Receipt3D } from './Receipt3D';

const meta = {
  title: 'Components/Receipt3D',
  component: Receipt3D,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `An interactive 3D receipt component powered by WebGL with real-time cloth physics simulation. Users can grab and drag the receipt to see realistic paper deformation.

## Installation

\`\`\`bash
npm install @warmbros/components
\`\`\`

## Usage

\`\`\`tsx
import '@warmbros/components/styles.css';
import { Receipt3D } from '@warmbros/components';

function App() {
  return (
    <Receipt3D
      storeName="MY STORE"
      address="123 Main St, City"
      items={[
        { name: 'Widget', price: 9.99 },
        { name: 'Gadget', price: 14.50 },
      ]}
      taxRate={0.08}
      width={600}
      height={700}
    />
  );
}
\`\`\`

## How It Works

The component uses three layers of technology:

1. **2D Canvas** — Generates the receipt texture by drawing text, dividers, and totals onto an offscreen canvas
2. **WebGL** — Renders a 3D mesh textured with the receipt image, with real-time lighting
3. **Cloth Physics** — A particle-constraint system simulates realistic paper behavior with wind and gravity

## Items and Pricing

The \`items\` prop accepts an array of \`{ name, price }\` objects. The component automatically calculates subtotal, tax, and total.

\`\`\`ts
type ReceiptItem = {
  name: string;   // displayed on the left
  price: number;  // displayed on the right as $X.XX
};
\`\`\`

## Browser Support

Requires WebGL support (all modern browsers). Runs at ~60fps with 1,250 particles.
`,
      },
    },
  },
  argTypes: {
    storeName: {
      description: 'Store/shop name displayed at the top of the receipt',
      table: { defaultValue: { summary: 'THE STORE' } },
    },
    address: {
      description: 'Address line below the store name',
      table: { defaultValue: { summary: '42 Mesh Lane, WebGL City' } },
    },
    phone: {
      description: 'Phone number line',
      table: { defaultValue: { summary: 'Tel: (555) 042-1337' } },
    },
    date: {
      description: 'Date string displayed on the receipt',
      table: { defaultValue: { summary: 'today' } },
    },
    orderNumber: {
      description: 'Order number displayed on the receipt',
      table: { defaultValue: { summary: '#00001' } },
    },
    items: {
      description: 'Array of `{ name, price }` objects listed on the receipt',
      table: { defaultValue: { summary: '[]' } },
    },
    taxRate: {
      control: { type: 'number', min: 0, max: 1, step: 0.01 },
      description: 'Tax rate as decimal (e.g. 0.08 for 8%)',
      table: { defaultValue: { summary: '0.08' } },
    },
    footerMessage: {
      description: 'Footer message at the bottom of the receipt',
      table: { defaultValue: { summary: 'Thank you for visiting!' } },
    },
    footerSubText: {
      description: 'Smaller text below the footer message',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the scene (hex)',
      table: { defaultValue: { summary: '#e5e5e5' } },
    },
    hintText: {
      description: 'Hint text shown below the receipt. Set to `""` to hide.',
      table: { defaultValue: { summary: 'Grab and drag the receipt' } },
    },
    width: {
      control: 'text',
      description: 'Width of the container (number for px, or string like "100%")',
      table: { defaultValue: { summary: '100%' } },
    },
    height: {
      control: 'number',
      description: 'Height of the container in pixels',
      table: { defaultValue: { summary: '500' } },
    },
    className: {
      description: 'Additional CSS class for the outer container',
    },
    style: {
      description: 'Additional inline styles for the outer container',
    },
  },
} satisfies Meta<typeof Receipt3D>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A fully configured receipt with multiple items, tax, and footer. Grab and drag to interact! */
export const Default: Story = {
  args: {
    storeName: 'THE FLORNRM SHOP',
    address: '42 Mesh Lane, WebGL City',
    phone: 'Tel: (555) 042-1337',
    date: '2026-02-23  14:17',
    orderNumber: '#00382',
    items: [
      { name: 'Vertex Shader', price: 4.2 },
      { name: 'Fragment Shader', price: 3.5 },
      { name: 'Normal Map', price: 2.8 },
      { name: 'UV Unwrap', price: 1.5 },
      { name: 'Cloth Simulation', price: 6.0 },
    ],
    taxRate: 0.08,
    footerMessage: 'Thank you for visiting!',
    footerSubText: 'github.com/flornkm',
    width: 600,
    height: 700,
  },
};

/** Custom branding with a warm background color and coffee shop items. */
export const CoffeeShop: Story = {
  args: {
    storeName: 'WARM BROS COFFEE',
    address: '15 Bean Street, Portland',
    phone: 'Tel: (503) 555-0199',
    date: '2026-03-14',
    orderNumber: '#01042',
    items: [
      { name: 'Espresso', price: 3.5 },
      { name: 'Croissant', price: 4.0 },
      { name: 'Latte', price: 5.5 },
    ],
    taxRate: 0.1,
    footerMessage: 'See you next time!',
    backgroundColor: '#d4c5a9',
    width: 600,
    height: 700,
  },
};

/** A bare-minimum receipt — just a title and two items. All other fields use sensible defaults. */
export const Minimal: Story = {
  args: {
    storeName: 'RECEIPT',
    items: [
      { name: 'Item A', price: 10.0 },
      { name: 'Item B', price: 20.0 },
    ],
    width: 500,
    height: 600,
  },
};
