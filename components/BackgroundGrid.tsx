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
    <>
      {/* 1. Ambient radial vignette lighting */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: -3,
          background: 'radial-gradient(circle at 50% 45%, rgba(245, 245, 220, 0) 30%, rgba(27, 28, 28, 0.035) 100%)',
        }}
      />

      {/* 2. Tactile magazine-like paper grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: -2,
          opacity: 0.055,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Dynamic Parallax Background Grid with radial focus fade mask */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: '-60px', // bleed area to prevent raw borders showing during translation
          zIndex: -1,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(to right, rgba(27, 28, 28, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(27, 28, 28, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, rgba(0, 0, 0, 0.15) 50%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, rgba(0, 0, 0, 0.15) 50%, black 100%)',
          x: springX,
          y: combinedY,
        }}
      />
    </>
  );
}
