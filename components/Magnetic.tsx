'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({ children, range = 50, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for hardware-accelerated transforms
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft spring physics configuration for organic feel
  const springConfig = { stiffness: 120, damping: 14, mass: 0.25 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const el = ref.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!el) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        // Attract toward cursor
        x.set(distanceX * strength);
        y.set(distanceY * strength);
      } else {
        // Snap back to origin
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y, range, strength]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}
