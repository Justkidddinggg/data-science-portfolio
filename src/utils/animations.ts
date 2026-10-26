import type { Transition } from 'framer-motion';

/** Shared easing curve (Framer Motion 14 requires BezierDefinition tuple) */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Returns animation props for scroll-reveal (whileInView). */
export function fadeUp(delay = 0, distance = 22) {
  return {
    initial:     { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true, margin: '-60px' },
    transition:  {
      duration:  0.75,
      delay,
      ease:      EASE,
    } satisfies Transition,
  };
}

/** Returns animation props for entrance (animate). */
export function fadeIn(delay = 0, distance = 28) {
  return {
    initial:  { opacity: 0, y: distance },
    animate:  { opacity: 1, y: 0 },
    transition: {
      duration: 0.8,
      delay,
      ease:     EASE,
    } satisfies Transition,
  };
}
