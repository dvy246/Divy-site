'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollReveal3DProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollReveal3D({
  children,
  delay = 0,
  className = '',
  style = {},
}: ScrollReveal3DProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 80,
        rotateX: 18,
        scale: 0.93,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        margin: '-8% 0px -8% 0px',
      }}
      transition={{
        type: 'spring',
        stiffness: 65,      // custom premium spring timings
        damping: 14,
        mass: 0.85,
        delay: delay,
      }}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transformOrigin: 'top center',
        willChange: 'transform, opacity',
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
