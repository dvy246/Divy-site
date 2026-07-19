'use client';

import { useEffect, useRef } from 'react';

/* Custom crosshair cursor with blend-mode: difference
   — appears as inverted color over any background.
   Expands on hovering interactive elements. */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const pos       = useRef({ x: -100, y: -100 });
  const target    = useRef({ x: -100, y: -100 });
  const raf       = useRef<number | null>(null);
  const isTouch   = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    isTouch.current =
      window.matchMedia('(hover: none)').matches ||
      navigator.maxTouchPoints > 0;
    if (isTouch.current) return;

    const cursor = cursorRef.current;
    const dot    = dotRef.current;
    if (!cursor || !dot) return;

    let isHovered = false;

    /* Track mouse */
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    /* Smooth follow loop */
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.14;
      pos.current.y += (target.current.y - pos.current.y) * 0.14;

      cursor.style.transform =
        `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      
      const scaleVal = isHovered ? 2.5 : 1.0;
      dot.style.transform =
        `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%) scale(${scaleVal})`;

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    /* Expand on hover of interactive elements */
    const expand = () => {
      isHovered = true;
      cursor.style.width  = '54px';
      cursor.style.height = '54px';
      cursor.style.background = 'transparent';
      cursor.style.border = '1px solid #B5502D';
      dot.style.backgroundColor = '#B5502D';
    };
    const contract = () => {
      isHovered = false;
      cursor.style.width  = '28px';
      cursor.style.height = '28px';
      cursor.style.background = 'transparent';
      cursor.style.border = '1px solid #1b1c1c';
      dot.style.backgroundColor = '#1b1c1c';
    };

    const targets = document.querySelectorAll<HTMLElement>(
      'a, button, [role="button"], input, textarea, label'
    );
    targets.forEach((el) => {
      el.addEventListener('mouseenter', expand);
      el.addEventListener('mouseleave', contract);
    });

    /* MutationObserver for dynamically added elements */
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], input, textarea, label'
      ).forEach((el) => {
        el.addEventListener('mouseenter', expand);
        el.addEventListener('mouseleave', contract);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
      observer.disconnect();
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', expand);
        el.removeEventListener('mouseleave', contract);
      });
    };
  }, []);

  if (typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none)').matches || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Lagging ring */}
      <div
        id="custom-cursor"
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          zIndex: 99999,
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          border: '1px solid #1b1c1c',
          borderRadius: '50%',
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          willChange: 'transform',
          transition:
            'width 300ms cubic-bezier(0.16,1,0.3,1), ' +
            'height 300ms cubic-bezier(0.16,1,0.3,1), ' +
            'border-color 200ms ease, background 200ms ease',
        }}
      />
      {/* Instant dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          zIndex: 99999,
          top: 0,
          left: 0,
          width: '4px',
          height: '4px',
          backgroundColor: '#1b1c1c',
          borderRadius: '50%',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </>
  );
}
