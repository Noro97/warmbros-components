import { Suspense, useMemo } from 'react';
import styles from './LogoForge.module.css';
import { LogoForgeScene } from './LogoForgeScene';
import { DEFAULT_CONFIG } from './presets';
import type {
  EnvPreset,
  LogoForgeConfig,
  LogoSource,
  MaterialType,
} from './types';

export interface LogoForgeProps {
  // ─── Source ─────────────────────────────────────────────
  /** URL of an SVG to extrude. Used when `svgString` isn't provided. */
  svgUrl?: string;
  /** Inline SVG markup. Takes precedence over `svgUrl`. */
  svgString?: string;

  // ─── Geometry ──────────────────────────────────────────
  /** Extrusion depth (world units). Default 0.45. */
  depth?: number;
  /** Bevel size (world units). 0 disables. Default 0.018. */
  bevelSize?: number;
  /** Bevel thickness. Default 0.018. */
  bevelThickness?: number;
  /** Bevel segments (1–5). Default 3. */
  bevelSegments?: number;

  // ─── Material ──────────────────────────────────────────
  /** Material type. Default `physical`. */
  materialType?: MaterialType;
  /** Base color (hex). Default `#B51A2B`. */
  color?: string;
  /** Metalness 0–1 (physical/standard). Default 0.6. */
  metalness?: number;
  /** Roughness 0–1 (physical/standard). Default 0.25. */
  roughness?: number;
  /** Transmission 0–1 (physical only). Default 0.25. */
  transmission?: number;
  /** Clearcoat 0–1 (physical only). Default 0.15. */
  clearcoat?: number;
  /** Emissive color (hex). Default `#000000`. */
  emissive?: string;
  /** Emissive intensity 0–3. Default 0. */
  emissiveIntensity?: number;

  // ─── Environment & lighting ────────────────────────────
  /** drei Environment HDRI preset. Default `city`. */
  environment?: EnvPreset;
  /** Env-map intensity 0–2. Default 0.6. */
  envIntensity?: number;
  /** Scene light multiplier 0–3. Default 1. */
  lightIntensity?: number;

  // ─── Behavior ──────────────────────────────────────────
  /** Auto-rotate around Y. Default true (respects `prefers-reduced-motion`). */
  autoRotate?: boolean;
  /** Rotation speed (rad/s). Default 0.5. */
  rotateSpeed?: number;

  // ─── Container chrome ──────────────────────────────────
  /** Show "macOS window" chrome dots in the top-left. Default true. */
  showChrome?: boolean;
  /** Show drag-to-orbit hint in the bottom-right. Default true. */
  showDragHint?: boolean;
  /** Drag hint text. Default `"drag to orbit · scroll to zoom"`. */
  dragHintLabel?: string;
  /** Chrome window label. Default `"logo-forge"`. */
  chromeLabel?: string;
  /** Canvas background color. Default `#08080f`. Pass `transparent` to inherit. */
  background?: string;
  /** Container height (CSS). Default `500px`. */
  height?: string | number;
  /** Extra class on the root element. */
  className?: string;
  /** Additional inline styles on the root. */
  style?: React.CSSProperties;
}

/**
 * Interactive 3D logo viewer. Renders an SVG extruded to a real-time WebGL
 * object with full material, environment and lighting control via props.
 *
 * The component is canvas-only (no built-in UI panel) — drive every parameter
 * through props. For a self-assembled UI use the lower-level `LogoForgeScene`
 * directly, or compose with the bundled `LogoForgeControls`.
 */
export function LogoForge({
  svgUrl,
  svgString,

  depth,
  bevelSize,
  bevelThickness,
  bevelSegments,

  materialType,
  color,
  metalness,
  roughness,
  transmission,
  clearcoat,
  emissive,
  emissiveIntensity,

  environment,
  envIntensity,
  lightIntensity,

  autoRotate,
  rotateSpeed,

  showChrome = true,
  showDragHint = true,
  dragHintLabel = 'drag to orbit · scroll to zoom',
  chromeLabel = 'logo-forge',
  background = '#08080f',
  height = 500,
  className,
  style,
}: LogoForgeProps) {
  const config = useMemo<LogoForgeConfig>(
    () => ({
      depth: depth ?? DEFAULT_CONFIG.depth,
      bevelSize: bevelSize ?? DEFAULT_CONFIG.bevelSize,
      bevelThickness: bevelThickness ?? DEFAULT_CONFIG.bevelThickness,
      bevelSegments: bevelSegments ?? DEFAULT_CONFIG.bevelSegments,
      materialType: materialType ?? DEFAULT_CONFIG.materialType,
      color: color ?? DEFAULT_CONFIG.color,
      metalness: metalness ?? DEFAULT_CONFIG.metalness,
      roughness: roughness ?? DEFAULT_CONFIG.roughness,
      transmission: transmission ?? DEFAULT_CONFIG.transmission,
      clearcoat: clearcoat ?? DEFAULT_CONFIG.clearcoat,
      emissive: emissive ?? DEFAULT_CONFIG.emissive,
      emissiveIntensity: emissiveIntensity ?? DEFAULT_CONFIG.emissiveIntensity,
      environment: environment ?? DEFAULT_CONFIG.environment,
      envIntensity: envIntensity ?? DEFAULT_CONFIG.envIntensity,
      lightIntensity: lightIntensity ?? DEFAULT_CONFIG.lightIntensity,
      autoRotate: autoRotate ?? DEFAULT_CONFIG.autoRotate,
      rotateSpeed: rotateSpeed ?? DEFAULT_CONFIG.rotateSpeed,
    }),
    [
      depth, bevelSize, bevelThickness, bevelSegments,
      materialType, color, metalness, roughness, transmission, clearcoat,
      emissive, emissiveIntensity,
      environment, envIntensity, lightIntensity,
      autoRotate, rotateSpeed,
    ],
  );

  const source = useMemo<LogoSource>(
    () => ({
      name: svgString ? 'inline' : svgUrl ?? 'default',
      svgString: svgString ?? null,
    }),
    [svgString, svgUrl],
  );

  const containerStyle: React.CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      className={[styles.canvasOnly, className].filter(Boolean).join(' ')}
      style={containerStyle}
    >
      {showChrome ? (
        <div className={styles.canvasChrome} aria-hidden="true">
          <span className={styles.chromeDot} />
          <span className={styles.chromeDot} />
          <span className={styles.chromeDot} />
          {chromeLabel ? <span className={styles.chromeLabel}>{chromeLabel}</span> : null}
        </div>
      ) : null}

      <Suspense fallback={null}>
        <LogoForgeScene
          source={source}
          config={config}
          defaultLogoUrl={svgUrl}
          background={background === 'transparent' ? undefined : background}
        />
      </Suspense>

      {showDragHint && dragHintLabel ? (
        <div className={styles.canvasHint}>{dragHintLabel}</div>
      ) : null}
    </div>
  );
}
