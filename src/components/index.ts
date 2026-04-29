// Light-weight components live in the main barrel.
// Heavy components (SplineScene pulls ~2MB Spline runtime, Receipt3D pulls ~2MB Rapier physics,
// LogoForge pulls ~600KB three.js + drei) are intentionally excluded here — import them from
// their explicit subpath instead:
//   import { SplineScene } from '@warmbros/components/SplineScene';
//   import { Receipt3D }  from '@warmbros/components/Receipt3D';
//   import { LogoForge }  from '@warmbros/components/LogoForge';
// This keeps the main barrel ~50KB and lets consumers opt into 3D explicitly.
export * from './Button';
export * from './Pricing';
export * from './Footer';
export * from './ContainerScroll';
