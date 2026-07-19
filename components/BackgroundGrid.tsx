'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function BackgroundGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const springScroll = useSpring(scrollY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset max 24px in either direction for subtle parallax depth
      const x = (e.clientX / window.innerWidth - 0.5) * 48;
      const y = (e.clientY / window.innerHeight - 0.5) * 48;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleScroll = () => {
      // Parallax scroll factor: move background grid up/down very slightly
      scrollY.set(window.scrollY * -0.08);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mouseX, mouseY, scrollY]);

  // Combine mouse parallax Y and scroll parallax Y
  const combinedY = useTransform(() => springY.get() + springScroll.get());

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: '-60px', // bleed area to prevent raw borders showing during translation
        zIndex: -1,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(to right, rgba(27, 28, 28, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(27, 28, 28, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        x: springX,
        y: combinedY,
      }}
    />
  );
}
