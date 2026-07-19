'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenisInstance: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tickFn: ((time: number) => void) | null = null;
    let handleResize: (() => void) | null = null;

    const init = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (!active) return;

      gsap.registerPlugin(ScrollTrigger);

      // R1. Scroll Hijacking Fix: duration 1.2, custom easing
      lenisInstance = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        syncTouch: false,
      });

      tickFn = (time: number) => {
        lenisInstance?.raf(time * 1000);
      };

      gsap.ticker.add(tickFn);
      gsap.ticker.lagSmoothing(0);
      lenisInstance.on('scroll', ScrollTrigger.update);

      // ScrollTrigger Optimization: call ScrollTrigger.refresh() on load and resize
      handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);
      window.addEventListener('load', handleResize);

      // Call initial refresh
      setTimeout(() => {
        if (active) ScrollTrigger.refresh();
      }, 500);
    };

    init();

    return () => {
      active = false;
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      import('gsap').then(({ gsap }) => {
        if (tickFn) gsap.ticker.remove(tickFn);
      });
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('load', handleResize);
      }
    };
  }, []);

  return null;
}
