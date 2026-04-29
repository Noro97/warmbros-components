import type {
  EnvPreset,
  LogoForgeConfig,
  LogoForgeLabels,
  MaterialPreset,
} from './types';

export const DEFAULT_CONFIG: LogoForgeConfig = {
  depth: 0.45,
  bevelSize: 0.018,
  bevelThickness: 0.018,
  bevelSegments: 3,
  materialType: 'physical',
  color: '#B51A2B',
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
};

export const DEFAULT_LABELS: LogoForgeLabels = {
  uploadTitle: 'SVG Source',
  uploadDefault: 'Default logo',
  uploadHint: 'Drop SVG file or click to browse',

  presetsTitle: 'Material Presets',

  materialTitle: 'Material',
  materialPhysical: 'Physical',
  materialStandard: 'Standard',
  materialToon: 'Toon',
  materialWireframe: 'Wire',

  colorTitle: 'Base Color',

  envTitle: 'HDRI Environment',

  rotateTitle: 'Auto-rotate',
  rotateOn: 'ON',
  rotateOff: 'OFF',

  sliderDepth: 'Extrude Depth',
  sliderBevel: 'Bevel',
  sliderMetalness: 'Metalness',
  sliderRoughness: 'Roughness',
  sliderTransmission: 'Transmission',
  sliderClearcoat: 'Clearcoat',
  sliderEmissive: 'Emissive',
  sliderLightIntensity: 'Light Intensity',
  sliderEnvIntensity: 'Env Intensity',

  resetAction: 'Reset all',

  errorNotSvg: 'Please upload an SVG file',

  canvasDragHint: 'drag to orbit · scroll to zoom',

  envCity: 'City',
  envStudio: 'Studio',
  envSunset: 'Sunset',
  envDawn: 'Dawn',
  envNight: 'Night',
  envForest: 'Forest',
  envApartment: 'Apartment',
  envWarehouse: 'Warehouse',
  envPark: 'Park',
  envLobby: 'Lobby',
};

export const DEFAULT_PRESETS: MaterialPreset[] = [
  {
    id: 'crimson-glass',
    label: 'Crimson Glass',
    swatch: '#B51A2B',
    config: {
      color: '#B51A2B',
      materialType: 'physical',
      metalness: 0.6,
      roughness: 0.25,
      transmission: 0.25,
      clearcoat: 0.15,
      emissive: '#000000',
      emissiveIntensity: 0,
      environment: 'city',
    },
  },
  {
    id: 'liquid-metal',
    label: 'Liquid Metal',
    swatch: '#d8d8d8',
    config: {
      color: '#d8d8d8',
      materialType: 'physical',
      metalness: 1,
      roughness: 0.08,
      transmission: 0,
      clearcoat: 1,
      emissive: '#000000',
      emissiveIntensity: 0,
      environment: 'studio',
    },
  },
  {
    id: 'holographic',
    label: 'Holographic',
    swatch: '#a78bfa',
    config: {
      color: '#a78bfa',
      materialType: 'physical',
      metalness: 0.85,
      roughness: 0.1,
      transmission: 0.55,
      clearcoat: 1,
      emissive: '#3b0764',
      emissiveIntensity: 0.3,
      environment: 'sunset',
    },
  },
  {
    id: 'toon-pop',
    label: 'Toon Pop',
    swatch: '#ef4444',
    config: {
      color: '#ef4444',
      materialType: 'toon',
      emissive: '#000000',
      emissiveIntensity: 0,
      environment: 'studio',
    },
  },
  {
    id: 'neon-wire',
    label: 'Neon Wire',
    swatch: '#10b981',
    config: {
      color: '#10b981',
      materialType: 'wireframe',
      emissive: '#10b981',
      emissiveIntensity: 1.5,
      environment: 'night',
    },
  },
  {
    id: 'matte-black',
    label: 'Matte Black',
    swatch: '#1a1a1a',
    config: {
      color: '#1a1a1a',
      materialType: 'standard',
      metalness: 0,
      roughness: 1,
      emissive: '#000000',
      emissiveIntensity: 0,
      environment: 'apartment',
    },
  },
  {
    id: 'gold-bar',
    label: 'Gold Bar',
    swatch: '#fbbf24',
    config: {
      color: '#fbbf24',
      materialType: 'physical',
      metalness: 1,
      roughness: 0.18,
      transmission: 0,
      clearcoat: 0.6,
      emissive: '#000000',
      emissiveIntensity: 0,
      environment: 'sunset',
    },
  },
  {
    id: 'frosted-glass',
    label: 'Frosted Glass',
    swatch: '#ffffff',
    config: {
      color: '#ffffff',
      materialType: 'physical',
      metalness: 0.1,
      roughness: 0.4,
      transmission: 0.95,
      clearcoat: 0.8,
      emissive: '#000000',
      emissiveIntensity: 0,
      environment: 'lobby',
    },
  },
];

export const ENV_PRESETS: { value: EnvPreset; labelKey: keyof LogoForgeLabels }[] = [
  { value: 'city', labelKey: 'envCity' },
  { value: 'studio', labelKey: 'envStudio' },
  { value: 'sunset', labelKey: 'envSunset' },
  { value: 'dawn', labelKey: 'envDawn' },
  { value: 'night', labelKey: 'envNight' },
  { value: 'forest', labelKey: 'envForest' },
  { value: 'apartment', labelKey: 'envApartment' },
  { value: 'warehouse', labelKey: 'envWarehouse' },
  { value: 'park', labelKey: 'envPark' },
  { value: 'lobby', labelKey: 'envLobby' },
];

/** Built-in fallback SVG used when no logo is uploaded and no `defaultLogoUrl` is provided. */
export const BUILTIN_DEFAULT_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 4 L62 38 L98 38 L69 60 L80 96 L50 74 L20 96 L31 60 L2 38 L38 38 Z" fill="black" />
</svg>`;
