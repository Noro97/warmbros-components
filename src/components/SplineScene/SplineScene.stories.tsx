import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplineScene } from './SplineScene';

const meta = {
  title: 'Components/SplineScene',
  component: SplineScene,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A lazy-loaded wrapper around \`@splinetool/react-spline\`. The Spline runtime is split into its own chunk and only fetched when a \`<SplineScene />\` mounts — keeping your initial bundle small.

## Installation

\`\`\`bash
npm install @warmbros/components @splinetool/react-spline
\`\`\`

## Usage

\`\`\`tsx
import { SplineScene } from '@warmbros/components';

<div style={{ width: 600, height: 400 }}>
  <SplineScene scene="https://prod.spline.design/YOUR_SCENE/scene.splinecode" />
</div>
\`\`\`

The wrapper fills its parent — size it from the outside.`,
      },
    },
  },
} satisfies Meta<typeof SplineScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scene: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600, height: 400, background: '#0a0a1a' }}>
        <Story />
      </div>
    ),
  ],
};
