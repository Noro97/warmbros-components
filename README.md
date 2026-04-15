# @warmbros/components

React component library by [WarmBros](https://github.com/Noro97). CSS Modules, themeable via CSS custom properties, no Tailwind dependency, zero global style pollution.

## Install

```bash
npm install @warmbros/components framer-motion
```

Then import the stylesheet once at your app root:

```tsx
import '@warmbros/components/styles.css';
```

## Components

| Component | Description |
|---|---|
| [`Button`](#button) | Accessible `<button>` with `primary` / `secondary` / `ghost` variants and `sm` / `md` / `lg` sizes |
| [`Pricing`](#pricing) | 3-tier pricing section with monthly/annual toggle |
| [`Footer`](#footer) | Branded footer with socials, nav, legal links, copyright |
| [`ContainerScroll`](#containerscroll) | Scroll-driven 3D reveal — a framed card that tilts flat as you scroll |
| `SplineScene` (subpath) | Lazy wrapper around `@splinetool/react-spline` |
| `Receipt3D` (subpath) | 3D receipt animation with physics |

### Button

```tsx
import { Button } from '@warmbros/components';

<Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
  Click me
</Button>
```

### Pricing

```tsx
import { Pricing } from '@warmbros/components';

const plans = [
  { name: 'STARTER', price: '50', yearlyPrice: '40', period: 'per month',
    features: ['Up to 10 projects', 'Community support'],
    description: 'Perfect for individuals', buttonText: 'Start Free Trial',
    href: '#', isPopular: false },
  // ...
];

<Pricing plans={plans} />
```

### Footer

```tsx
import { Footer } from '@warmbros/components';
import { Github } from 'lucide-react';

<Footer
  brandName="WarmBros"
  socialLinks={[
    { icon: <Github />, href: 'https://github.com/...', label: 'GitHub' },
  ]}
  mainLinks={[{ href: '#about', label: 'About' }]}
  copyright={{ text: '© 2026 WarmBros. All rights reserved.' }}
/>
```

### ContainerScroll

Scroll-driven 3D reveal: a "laptop lid"-style card tilts flat, scales down, and docks into frame as the user scrolls.

```tsx
import { ContainerScroll } from '@warmbros/components';

<ContainerScroll
  titleComponent={<h1>Unleash <span>Scroll Animations</span></h1>}
>
  <img src="/hero.png" alt="" />
</ContainerScroll>
```

### Heavy components (subpath imports)

These pull large runtimes — import from their subpath so consumers who don't use them don't pay the cost:

```tsx
// Pulls ~2MB of Spline runtime — install peers first:
//   npm install @splinetool/react-spline @splinetool/runtime
import { SplineScene } from '@warmbros/components/SplineScene';

// Pulls ~2MB of Rapier physics:
import { Receipt3D }  from '@warmbros/components/Receipt3D';
```

## Theming

All components read from a small set of CSS custom properties. Set them once on an ancestor (e.g. `<body>` or an app-root wrapper):

```css
:root {
  --wb-accent: #B51A2B;        /* brand color */
  --wb-surface: rgba(255, 255, 255, 0.03);
  --wb-border: rgba(255, 255, 255, 0.08);
  --wb-fg: #ffffff;
  --wb-fg-muted: rgba(218, 212, 212, 0.7);

  --wb-font-sans: 'Inter', system-ui, sans-serif;
  --wb-font-display: 'Space Grotesk', system-ui, sans-serif;
  --wb-font-brand: 'Righteous', cursive;
}
```

## Peer dependencies

Required:
- `react` ^18 or ^19
- `react-dom` ^18 or ^19
- `framer-motion` ^11 or ^12

Optional (only if you use the `SplineScene` subpath):
- `@splinetool/react-spline` ^4
- `@splinetool/runtime` ^1

## License

MIT © [Norayr Avetisyan](https://github.com/Noro97)
