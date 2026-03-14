import type { Meta, StoryObj } from '@storybook/react';
import { Receipt3D } from './Receipt3D';

const meta = {
  title: 'Components/Receipt3D',
  component: Receipt3D,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    width: { control: 'text' },
    height: { control: 'number' },
    taxRate: { control: { type: 'number', min: 0, max: 1, step: 0.01 } },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Receipt3D>;

export default meta;
type Story = StoryObj<typeof meta>;

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
