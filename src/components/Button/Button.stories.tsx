import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A versatile button component with multiple visual variants and sizes.
Extends the native HTML \`<button>\` element, so all standard attributes like \`onClick\`, \`disabled\`, \`type\`, etc. are supported.

## Installation

\`\`\`bash
npm install @warmbros/components
\`\`\`

## Usage

\`\`\`tsx
import '@warmbros/components/styles.css';
import { Button } from '@warmbros/components';

function App() {
  return (
    <Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}
\`\`\`

## Accessibility

- Renders a semantic \`<button>\` element
- Supports all native button attributes (\`aria-label\`, \`tabIndex\`, etc.)
- Keyboard accessible by default (Enter and Space to activate)

## Customization

Pass a custom \`className\` to override or extend styles. The component uses CSS Modules internally, so class names are scoped and won't conflict with your styles.
`,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'The visual style variant',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      description: 'Content inside the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default primary button for main call-to-action. */
export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
};

/** A lower-emphasis button for secondary actions. */
export const Secondary: Story = {
  args: {
    children: 'Click me',
    variant: 'secondary',
  },
};

/** A minimal transparent button for tertiary actions or toolbars. */
export const Ghost: Story = {
  args: {
    children: 'Click me',
    variant: 'ghost',
  },
};

/** Compact button for tight layouts. */
export const Small: Story = {
  args: {
    children: 'Small button',
    size: 'sm',
  },
};

/** Prominent button for hero sections or important actions. */
export const Large: Story = {
  args: {
    children: 'Large button',
    size: 'lg',
  },
};

/** All variants support the native `disabled` attribute. The button becomes non-interactive with reduced opacity. */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};
