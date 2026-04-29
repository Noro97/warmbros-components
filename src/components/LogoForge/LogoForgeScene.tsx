import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import type { LogoForgeConfig, LogoSource } from './types';
import { BUILTIN_DEFAULT_SVG } from './presets';

const TARGET_WORLD_SIZE = 3; // logo fits into ~3 world units across longest axis

interface BuildOpts
  extends Pick<LogoForgeConfig, 'depth' | 'bevelSize' | 'bevelThickness' | 'bevelSegments'> {}

function buildGeometries(
  data: ReturnType<SVGLoader['parse']>,
  opts: BuildOpts,
): THREE.BufferGeometry[] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const allShapes: THREE.Shape[] = [];
  for (const path of data.paths) {
    const shapes = SVGLoader.createShapes(path);
    for (const shape of shapes) {
      allShapes.push(shape);
      const points = shape.getPoints();
      for (const p of points) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
    }
  }

  const sizeX = maxX - minX;
  const sizeY = maxY - minY;
  const maxDim = Math.max(sizeX, sizeY) || 1;
  const scale = TARGET_WORLD_SIZE / maxDim;
  const useBevel = opts.bevelSize > 0.001;

  const geometries: THREE.BufferGeometry[] = [];
  for (const shape of allShapes) {
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: opts.depth / scale,
      bevelEnabled: useBevel,
      bevelThickness: opts.bevelThickness / scale,
      bevelSize: opts.bevelSize / scale,
      bevelSegments: opts.bevelSegments,
    });
    geo.scale(scale, -scale, scale); // SVG Y is inverted
    geometries.push(geo);
  }

  return geometries;
}

function useGeometries(
  source: LogoSource,
  defaultLogoUrl: string | undefined,
  opts: BuildOpts,
) {
  const [geometries, setGeometries] = useState<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    const loader = new SVGLoader();
    let cancelled = false;
    let createdGeos: THREE.BufferGeometry[] = [];

    const apply = (data: ReturnType<SVGLoader['parse']>) => {
      if (cancelled) return;
      try {
        const geos = buildGeometries(data, opts);
        createdGeos = geos;
        setGeometries(geos);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[LogoForge] Failed to build geometries', err);
        setGeometries([]);
      }
    };

    if (source.svgString) {
      try {
        apply(loader.parse(source.svgString));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[LogoForge] Failed to parse SVG', err);
        setGeometries([]);
      }
    } else if (defaultLogoUrl) {
      loader.load(
        defaultLogoUrl,
        apply,
        undefined,
        (err) => {
          // eslint-disable-next-line no-console
          console.error('[LogoForge] Failed to load default logo', err);
        },
      );
    } else {
      // Fall back to bundled inline SVG
      try {
        apply(loader.parse(BUILTIN_DEFAULT_SVG));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[LogoForge] Failed to parse built-in SVG', err);
        setGeometries([]);
      }
    }

    return () => {
      cancelled = true;
      createdGeos.forEach((g) => g.dispose());
    };
  }, [source, defaultLogoUrl, opts.depth, opts.bevelSize, opts.bevelThickness, opts.bevelSegments]);

  return geometries;
}

function LogoMaterial({ config }: { config: LogoForgeConfig }) {
  switch (config.materialType) {
    case 'physical':
      return (
        <meshPhysicalMaterial
          metalness={config.metalness}
          roughness={config.roughness}
          transmission={config.transmission}
          thickness={1.5}
          ior={1.3}
          envMapIntensity={config.envIntensity}
          color={config.color}
          clearcoat={config.clearcoat}
          clearcoatRoughness={0.4}
          emissive={config.emissive}
          emissiveIntensity={config.emissiveIntensity}
        />
      );
    case 'standard':
      return (
        <meshStandardMaterial
          color={config.color}
          metalness={config.metalness}
          roughness={config.roughness}
          envMapIntensity={config.envIntensity}
          emissive={config.emissive}
          emissiveIntensity={config.emissiveIntensity}
        />
      );
    case 'toon':
      return <meshToonMaterial color={config.color} />;
    case 'wireframe':
      return <meshBasicMaterial color={config.color} wireframe />;
  }
}

function LogoMesh({
  source,
  config,
  defaultLogoUrl,
}: {
  source: LogoSource;
  config: LogoForgeConfig;
  defaultLogoUrl?: string;
}) {
  const rotatorRef = useRef<THREE.Group>(null);
  const geometries = useGeometries(source, defaultLogoUrl, config);

  useFrame((_state, delta) => {
    const g = rotatorRef.current;
    if (!g || !config.autoRotate) return;
    g.rotation.y += delta * config.rotateSpeed;
  });

  if (geometries.length === 0) return null;

  return (
    <group ref={rotatorRef}>
      <Center>
        {geometries.map((geo, i) => (
          <mesh key={i} geometry={geo}>
            <LogoMaterial config={config} />
          </mesh>
        ))}
      </Center>
    </group>
  );
}

export interface LogoForgeSceneProps {
  source: LogoSource;
  config: LogoForgeConfig;
  /** URL of an SVG to use when `source.svgString` is null. If omitted, falls back to a built-in star. */
  defaultLogoUrl?: string;
  /** Background color (CSS hex). Default `transparent`. */
  background?: string;
}

/**
 * Standalone R3F canvas that renders a 3D-extruded SVG with full material control.
 * Use this when you want to embed the canvas in your own UI; for the full
 * controls + canvas experience, use `LogoForge`.
 */
export function LogoForgeScene({
  source,
  config,
  defaultLogoUrl,
  background,
}: LogoForgeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: !background }}
    >
      {background ? <color attach="background" args={[background]} /> : null}
      <ambientLight intensity={0.3 * config.lightIntensity} />
      <pointLight position={[3, 3, 5]} intensity={config.lightIntensity} color="#ffffff" />
      <pointLight
        position={[-3, -2, 4]}
        intensity={0.5 * config.lightIntensity}
        color={config.color}
      />
      <Environment preset={config.environment} />
      <LogoMesh source={source} config={config} defaultLogoUrl={defaultLogoUrl} />
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={10}
        autoRotate={false}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
