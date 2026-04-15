import { Suspense, lazy, type ReactNode } from 'react';
import styles from './SplineScene.module.css';

// Lazy-load @splinetool/react-spline so the runtime ships only when used.
const Spline = lazy(() => import('@splinetool/react-spline'));

export interface SplineSceneProps {
  /** URL to the exported Spline scene (e.g. https://prod.spline.design/.../scene.splinecode) */
  scene: string;
  /** Extra class on the wrapper */
  className?: string;
  /** Custom loading fallback */
  fallback?: ReactNode;
}

export function SplineScene({ scene, className, fallback }: SplineSceneProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  return (
    <Suspense fallback={fallback ?? <div className={styles.loader} aria-label="Loading 3D scene" />}>
      <Spline scene={scene} className={rootClass} />
    </Suspense>
  );
}
