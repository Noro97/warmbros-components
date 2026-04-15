import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContainerScroll } from './ContainerScroll';

const meta = {
  title: 'Components/ContainerScroll',
  component: ContainerScroll,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'warmbros' },
    docs: {
      description: {
        component: `A scroll-driven 3D reveal. The framed content tilts flat (rotateX 20deg → 0deg) and scales as the section scrolls into view, while the title slides up.

## Installation

\`\`\`bash
npm install @warmbros/components framer-motion
\`\`\`

## Usage

\`\`\`tsx
import { ContainerScroll } from '@warmbros/components';

<ContainerScroll
  titleComponent={
    <h1>Unleash the power of <br /><span>Scroll Animations</span></h1>
  }
>
  <img src="/hero.png" alt="" />
</ContainerScroll>
\`\`\`

Any ReactNode works as children — images, videos, iframes, <canvas>, etc.

## Responsive

Below 768px, the scale ramp shifts to \`[0.7, 0.9]\` (shrinks slightly instead of enlarging) for better fit on narrow viewports.`,
      },
    },
  },
} satisfies Meta<typeof ContainerScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    titleComponent: (
      <>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Unleash the power of <br />
          <span
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            Scroll Animations
          </span>
        </h1>
      </>
    ),
    children: (
      <img
        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80"
        alt="Dashboard preview"
        draggable={false}
      />
    ),
  },
};

export const WithVideo: Story = {
  args: {
    titleComponent: (
      <h1
        style={{
          fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          fontWeight: 600,
          margin: 0,
          color: 'var(--wb-accent, #B51A2B)',
        }}
      >
        Motion that matters
      </h1>
    ),
    children: (
      <video
        src="https://cdn.coverr.co/videos/coverr-typing-on-laptop-4720/1080p.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    ),
  },
};
