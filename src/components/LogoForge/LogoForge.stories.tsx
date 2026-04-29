import type { Meta, StoryObj } from '@storybook/react';
import { LogoForge } from './LogoForge';

const meta = {
  title: 'Components/LogoForge',
  component: LogoForge,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `An interactive 3D logo viewer. Renders an SVG extruded to a real-time WebGL object — every knob is a prop, no built-in UI panel.

Use the **Controls** tab below to tweak materials, environment and lighting in real time.

## Installation

\`\`\`bash
npm install @warmbros/components three @react-three/fiber @react-three/drei
\`\`\`

## Usage

\`\`\`tsx
import '@warmbros/components/styles.css';
import { LogoForge } from '@warmbros/components/LogoForge';

function App() {
  return (
    <LogoForge
      svgUrl="/my-logo.svg"
      color="#0ea5e9"
      materialType="physical"
      metalness={0.8}
      roughness={0.15}
      environment="sunset"
      autoRotate
    />
  );
}
\`\`\`

## Subpath import

This component pulls in three.js, @react-three/fiber and @react-three/drei
(~600KB gzipped). It is intentionally **not** in the main barrel — import it
from the explicit subpath \`@warmbros/components/LogoForge\` so consumers who
don't use it never pay the cost.

## Three pieces

- \`<LogoForge>\` — canvas-only viewer driven by props (this story)
- \`<LogoForgeScene>\` — raw R3F canvas; no chrome, no fallback
- \`<LogoForgeControls>\` — opt-in UI panel; pair with your own state

## Accessibility

- Auto-rotate is disabled when the user has \`prefers-reduced-motion\` set
- OrbitControls are keyboard-accessible (arrow keys when canvas is focused)
`,
      },
    },
  },
  args: {
    // Defaults
    color: '#B51A2B',
    materialType: 'physical',
    depth: 0.45,
    bevelSize: 0.018,
    metalness: 0.6,
    roughness: 0.25,
    transmission: 0.25,
    clearcoat: 0.15,
    emissive: '#000000',
    emissiveIntensity: 0,
    environment: 'city',
    envIntensity: 0.6,
    lightIntensity: 1,
    autoRotate: true,
    rotateSpeed: 0.5,
    background: '#08080f',
    height: 600,
    showChrome: true,
    showDragHint: true,
    chromeLabel: 'logo-forge',
    dragHintLabel: 'drag to orbit · scroll to zoom',
  },
  argTypes: {
    // Source
    svgUrl: {
      control: 'text',
      description: 'URL of an SVG to extrude.',
      table: { category: 'Source' },
    },
    svgString: {
      control: 'text',
      description: 'Inline SVG markup (takes precedence over svgUrl).',
      table: { category: 'Source' },
    },

    // Geometry
    depth: {
      control: { type: 'range', min: 0.05, max: 1.5, step: 0.05 },
      description: 'Extrusion depth in world units.',
      table: { category: 'Geometry', defaultValue: { summary: '0.45' } },
    },
    bevelSize: {
      control: { type: 'range', min: 0, max: 0.05, step: 0.005 },
      description: 'Bevel size. 0 disables.',
      table: { category: 'Geometry', defaultValue: { summary: '0.018' } },
    },
    bevelThickness: {
      control: { type: 'range', min: 0, max: 0.05, step: 0.005 },
      description: 'Bevel thickness.',
      table: { category: 'Geometry', defaultValue: { summary: '0.018' } },
    },
    bevelSegments: {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Number of bevel segments (smoothness).',
      table: { category: 'Geometry', defaultValue: { summary: '3' } },
    },

    // Material
    materialType: {
      control: 'select',
      options: ['physical', 'standard', 'toon', 'wireframe'],
      description: 'Material type.',
      table: { category: 'Material', defaultValue: { summary: 'physical' } },
    },
    color: {
      control: 'color',
      description: 'Base color (hex).',
      table: { category: 'Material', defaultValue: { summary: '#B51A2B' } },
    },
    metalness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Metalness (physical/standard).',
      table: { category: 'Material', defaultValue: { summary: '0.6' } },
    },
    roughness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Roughness (physical/standard).',
      table: { category: 'Material', defaultValue: { summary: '0.25' } },
    },
    transmission: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Transmission — glass-like transparency (physical only).',
      table: { category: 'Material', defaultValue: { summary: '0.25' } },
    },
    clearcoat: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Clearcoat layer (physical only).',
      table: { category: 'Material', defaultValue: { summary: '0.15' } },
    },
    emissive: {
      control: 'color',
      description: 'Emissive color.',
      table: { category: 'Material', defaultValue: { summary: '#000000' } },
    },
    emissiveIntensity: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Emissive intensity (physical/standard).',
      table: { category: 'Material', defaultValue: { summary: '0' } },
    },

    // Environment & lighting
    environment: {
      control: 'select',
      options: [
        'apartment', 'city', 'dawn', 'forest', 'lobby',
        'night', 'park', 'studio', 'sunset', 'warehouse',
      ],
      description: 'drei HDRI environment preset.',
      table: { category: 'Lighting', defaultValue: { summary: 'city' } },
    },
    envIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Env-map intensity.',
      table: { category: 'Lighting', defaultValue: { summary: '0.6' } },
    },
    lightIntensity: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Multiplier on the scene point/ambient lights.',
      table: { category: 'Lighting', defaultValue: { summary: '1' } },
    },

    // Behavior
    autoRotate: {
      control: 'boolean',
      description: 'Auto-rotate around Y. Disabled with prefers-reduced-motion.',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    rotateSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Rotation speed in rad/s.',
      table: { category: 'Behavior', defaultValue: { summary: '0.5' } },
    },

    // Chrome
    background: {
      control: 'color',
      description: 'Canvas background. Use `transparent` to inherit page bg.',
      table: { category: 'Chrome', defaultValue: { summary: '#08080f' } },
    },
    height: {
      control: 'text',
      description: 'CSS height of the container (number → px, or string).',
      table: { category: 'Chrome', defaultValue: { summary: '500' } },
    },
    showChrome: {
      control: 'boolean',
      description: 'Show macOS-style window dots in the top-left.',
      table: { category: 'Chrome', defaultValue: { summary: 'true' } },
    },
    chromeLabel: {
      control: 'text',
      description: 'Label shown next to the chrome dots.',
      table: { category: 'Chrome', defaultValue: { summary: 'logo-forge' } },
    },
    showDragHint: {
      control: 'boolean',
      description: 'Show drag-to-orbit hint in the bottom-right.',
      table: { category: 'Chrome', defaultValue: { summary: 'true' } },
    },
    dragHintLabel: {
      control: 'text',
      description: 'Drag hint text.',
      table: {
        category: 'Chrome',
        defaultValue: { summary: 'drag to orbit · scroll to zoom' },
      },
    },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
} satisfies Meta<typeof LogoForge>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrap = (children: React.ReactNode) => (
  <div style={{ padding: '32px', minHeight: '100vh', background: '#0a0a1a' }}>
    {children}
  </div>
);

/** Default configuration — open the **Controls** tab to tweak every parameter live. */
export const Default: Story = {
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Glass-like material with high transmission and clearcoat. */
export const CrimsonGlass: Story = {
  args: {
    color: '#B51A2B',
    materialType: 'physical',
    metalness: 0.6,
    roughness: 0.25,
    transmission: 0.25,
    clearcoat: 0.15,
    environment: 'city',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Polished chrome look — high metalness, low roughness, full clearcoat. */
export const LiquidMetal: Story = {
  args: {
    color: '#d8d8d8',
    materialType: 'physical',
    metalness: 1,
    roughness: 0.08,
    transmission: 0,
    clearcoat: 1,
    environment: 'studio',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Iridescent glass with violet emissive glow against a sunset HDRI. */
export const Holographic: Story = {
  args: {
    color: '#a78bfa',
    materialType: 'physical',
    metalness: 0.85,
    roughness: 0.1,
    transmission: 0.55,
    clearcoat: 1,
    emissive: '#3b0764',
    emissiveIntensity: 0.5,
    environment: 'sunset',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Cel-shaded look using `MeshToonMaterial`. */
export const ToonPop: Story = {
  args: {
    color: '#ef4444',
    materialType: 'toon',
    environment: 'studio',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Glowing wireframe against a night HDRI — synthwave vibes. */
export const NeonWire: Story = {
  args: {
    color: '#10b981',
    materialType: 'wireframe',
    emissive: '#10b981',
    emissiveIntensity: 1.5,
    environment: 'night',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Flat matte black — high roughness, zero metalness. */
export const MatteBlack: Story = {
  args: {
    color: '#1a1a1a',
    materialType: 'standard',
    metalness: 0,
    roughness: 1,
    environment: 'apartment',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Solid gold against sunset HDRI. */
export const GoldBar: Story = {
  args: {
    color: '#fbbf24',
    materialType: 'physical',
    metalness: 1,
    roughness: 0.18,
    transmission: 0,
    clearcoat: 0.6,
    environment: 'sunset',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Frosted/diffused glass with high transmission. */
export const FrostedGlass: Story = {
  args: {
    color: '#ffffff',
    materialType: 'physical',
    metalness: 0.1,
    roughness: 0.4,
    transmission: 0.95,
    clearcoat: 0.8,
    environment: 'lobby',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Custom inline SVG — pass any markup as the `svgString` prop. */
export const InlineSvg: Story = {
  args: {
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 L90 50 L50 90 L10 50 Z M50 30 L70 50 L50 70 L30 50 Z" fill-rule="evenodd"/>
    </svg>`,
    color: '#0ea5e9',
    materialType: 'physical',
    metalness: 0.7,
    roughness: 0.2,
    environment: 'studio',
  },
  render: (args) => wrap(<LogoForge {...args} />),
};

/** Minimal headless mode — no chrome, no hint, transparent background. */
export const Minimal: Story = {
  args: {
    showChrome: false,
    showDragHint: false,
    background: 'transparent',
    height: 400,
  },
  render: (args) => wrap(<LogoForge {...args} />),
};
