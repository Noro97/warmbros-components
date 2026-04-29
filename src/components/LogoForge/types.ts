export type MaterialType = 'physical' | 'standard' | 'toon' | 'wireframe';

export type EnvPreset =
  | 'apartment'
  | 'city'
  | 'dawn'
  | 'forest'
  | 'lobby'
  | 'night'
  | 'park'
  | 'studio'
  | 'sunset'
  | 'warehouse';

export interface LogoForgeConfig {
  /** Extrusion depth (world units) */
  depth: number;
  /** Bevel size (world units). 0 disables beveling. */
  bevelSize: number;
  /** Bevel thickness (world units) */
  bevelThickness: number;
  /** Number of bevel segments (1–5) */
  bevelSegments: number;

  /** Material type */
  materialType: MaterialType;
  /** Base color (hex) */
  color: string;
  /** Metalness 0–1 (physical/standard) */
  metalness: number;
  /** Roughness 0–1 (physical/standard) */
  roughness: number;
  /** Transmission 0–1 (physical only) */
  transmission: number;
  /** Clearcoat 0–1 (physical only) */
  clearcoat: number;
  /** Emissive color (hex) */
  emissive: string;
  /** Emissive intensity 0–3 */
  emissiveIntensity: number;

  /** drei Environment HDRI preset */
  environment: EnvPreset;
  /** Env-map intensity 0–2 */
  envIntensity: number;
  /** Multiplier on the scene lights 0–3 */
  lightIntensity: number;

  /** Auto-rotate the logo around Y-axis */
  autoRotate: boolean;
  /** Rotation speed (rad/s) */
  rotateSpeed: number;
}

export interface LogoSource {
  /** Display name (file name or label) */
  name: string;
  /** Inline SVG string. When null, the scene loads `defaultLogoUrl` (or built-in). */
  svgString: string | null;
}

export interface MaterialPreset {
  id: string;
  /** Either a `LogoForgeLabels.preset…` key, or a literal label */
  label: string;
  /** Visible swatch in the preset button */
  swatch: string;
  /** Patch applied to the current config when the preset is clicked */
  config: Partial<LogoForgeConfig>;
}

export interface LogoForgeLabels {
  uploadTitle: string;
  uploadDefault: string;
  uploadHint: string;

  presetsTitle: string;

  materialTitle: string;
  materialPhysical: string;
  materialStandard: string;
  materialToon: string;
  materialWireframe: string;

  colorTitle: string;

  envTitle: string;

  rotateTitle: string;
  rotateOn: string;
  rotateOff: string;

  sliderDepth: string;
  sliderBevel: string;
  sliderMetalness: string;
  sliderRoughness: string;
  sliderTransmission: string;
  sliderClearcoat: string;
  sliderEmissive: string;
  sliderLightIntensity: string;
  sliderEnvIntensity: string;

  resetAction: string;

  errorNotSvg: string;

  canvasDragHint: string;

  envCity: string;
  envStudio: string;
  envSunset: string;
  envDawn: string;
  envNight: string;
  envForest: string;
  envApartment: string;
  envWarehouse: string;
  envPark: string;
  envLobby: string;
}
