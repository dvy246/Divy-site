'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenisInstance: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tickFn: ((time: number) => void) | null = null;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      lenisInstance = new Lenis({ lerp: 0.08, smoothWheel: true });

      tickFn = (time: number) => {
        lenisInstance?.raf(time * 1000);
      };

      gsap.ticker.add(tickFn);
      gsap.ticker.lagSmoothing(0);
      lenisInstance.on('scroll', ScrollTrigger.update);

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);

      return () => {
        if (tickFn) gsap.ticker.remove(tickFn);
        window.removeEventListener('resize', handleResize);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    };

    init().then((fn) => { cleanup = fn; });

    return () => {
      cleanup?.();
      lenisInstance?.destroy();
    };
  }, []);

  return null;
}
