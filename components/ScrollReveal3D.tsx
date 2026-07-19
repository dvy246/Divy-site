'use client';

import React, { useEffect, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    
    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      // Check for prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(containerRef.current, {
          opacity: 1,
          transform: 'none',
        });
        return;
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          {
            opacity: 0,
            transform: 'perspective(1200px) rotateX(12deg) translateY(60px) scale(0.95)',
          },
          {
            opacity: 1,
            transform: 'perspective(1200px) rotateX(0deg) translateY(0px) scale(1)',
            ease: 'power1.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 92%', // start animating when the top of the element is near the bottom
              end: 'top 70%',   // complete when it reaches the upper part of the viewport
              scrub: 0.8,       // smooth scrub linked to scroll speed
              toggleActions: 'play none none reverse',
            },
          }
        );
      }, containerRef);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
        transformOrigin: 'top center',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

