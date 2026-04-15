import { useRef, useState, useEffect, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import styles from './ContainerScroll.module.css';

export interface ContainerScrollProps {
  /** Content rendered above the 3D-tilted frame (e.g. a heading) */
  titleComponent: ReactNode;
  /** Content rendered inside the frame (e.g. an image, iframe, or canvas) */
  children: ReactNode;
  /** Extra class on the root */
  className?: string;
}

/**
 * Scroll-driven 3D reveal: as the user scrolls the section into view, a "laptop lid"
 * style card tilts flat, scales down, and docks into frame while the title slides up.
 *
 * Usage:
 *   <ContainerScroll titleComponent={<h1>Unleash…</h1>}>
 *     <img src="..." alt="hero" />
 *   </ContainerScroll>
 */
export function ContainerScroll({
  titleComponent,
  children,
  className,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Track the full passage of the section through the viewport so the animation
  // stays linked to actual scroll distance, not the tiny delta of a default
  // "start start / end end" range (which felt rushed).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  // Smooth the raw scroll progress for a silkier feel.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleRange: [number, number] = isMobile ? [0.7, 0.9] : [1.05, 1];
  // Concentrate the reveal in the middle of the viewport pass
  // (~30%–70% of the scroll range) so the card reaches its flat state
  // right as it's centered, then lingers flat as the user keeps scrolling.
  const rotate = useTransform(smooth, [0.15, 0.6], [20, 0]);
  const scale = useTransform(smooth, [0.15, 0.6], scaleRange);
  const translate = useTransform(smooth, [0.15, 0.6], [0, -100]);

  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} ref={containerRef}>
      <div className={styles.perspective}>
        <Header translate={translate}>{titleComponent}</Header>
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({
  translate,
  children,
}: {
  translate: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div style={{ translateY: translate }} className={styles.header}>
      {children}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{ rotateX: rotate, scale }}
      className={styles.card}
    >
      <div className={styles.cardInner}>{children}</div>
    </motion.div>
  );
}
