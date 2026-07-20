'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function BackgroundGrid() {
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });
  const springScroll = useSpring(scrollY, { stiffness: 50, damping: 22 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      // Small parallax offset
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleScroll = () => {
      scrollY.set(window.scrollY * -0.04);
    };

    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mouseX, mouseY, scrollY]);

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
          background: 'radial-gradient(circle at 50% 45%, rgba(245, 245, 220, 0) 30%, rgba(27, 28, 28, 0.03) 100%)',
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

      {/* 3. Highly Premium Editorial Margin Grids */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: '-30px', // bleed area for parallax
          zIndex: -1,
          pointerEvents: 'none',
          x: isMobile ? 0 : springX,
          y: isMobile ? 0 : combinedY,
          maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 100px, black 180px, black calc(100% - 180px), transparent calc(100% - 100px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 100px, black 180px, black calc(100% - 180px), transparent calc(100% - 100px), transparent 100%)',
        }}
      >
        {/* Left Column Grid (Margin) */}
        <div
          style={{
            position: 'absolute',
            left: '30px',
            top: 0,
            bottom: 0,
            width: isMobile ? '12vw' : '22vw',
            borderRight: '1px solid rgba(27, 28, 28, 0.035)',
            backgroundImage: `
              linear-gradient(to right, rgba(27, 28, 28, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(27, 28, 28, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        >
          {/* Main 5vw Layout Line */}
          <div
            style={{
              position: 'absolute',
              right: isMobile ? '2vw' : '5vw',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'rgba(27, 28, 28, 0.045)',
            }}
          />
        </div>

        {/* Right Column Grid (Margin) */}
        <div
          style={{
            position: 'absolute',
            right: '30px',
            top: 0,
            bottom: 0,
            width: isMobile ? '12vw' : '22vw',
            borderLeft: '1px solid rgba(27, 28, 28, 0.035)',
            backgroundImage: `
              linear-gradient(to right, rgba(27, 28, 28, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(27, 28, 28, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        >
          {/* Main 95vw Layout Line */}
          <div
            style={{
              position: 'absolute',
              left: isMobile ? '2vw' : '5vw',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'rgba(27, 28, 28, 0.045)',
            }}
          />
        </div>
      </motion.div>
    </>
  );
}
