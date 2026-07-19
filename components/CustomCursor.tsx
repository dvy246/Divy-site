'use client';

import { useEffect, useRef } from 'react';

/* Redesigned Premium Custom Cursor
   - Custom crosshair ring with mix-blend-mode: difference for standard inversion.
   - Smoothly morphs on hovering interactive elements.
   - Displays dynamic text labels (e.g. "VIEW", "READ") when hovering elements with data-cursor.
   - Smooth lerping logic for the lagging ring. */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLSpanElement>(null);
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
    const text   = textRef.current;
    if (!cursor || !dot || !text) return;

    let isHovered = false;
    let hasText = false;

    /* Track mouse coordinates */
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    /* Smooth follow loop (lerp) */
    const tick = () => {
      // Lagging ring lerp factor (0.12)
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;

      cursor.style.transform =
        `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      
      const scaleVal = isHovered ? (hasText ? 1.0 : 2.5) : 1.0;
      dot.style.transform =
        `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%) scale(${scaleVal})`;

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    /* Expand & Morph Cursor on hover */
    const expand = (e: MouseEvent) => {
      isHovered = true;
      const el = e.currentTarget as HTMLElement;
      const cursorText = el.getAttribute('data-cursor');

      if (cursorText) {
        hasText = true;
        // Large filled terracotta circle with white/beige text
        cursor.style.width = '72px';
        cursor.style.height = '72px';
        cursor.style.background = '#B5502D';
        cursor.style.borderColor = '#B5502D';
        cursor.style.mixBlendMode = 'normal'; // disable difference to preserve terracotta color
        
        text.innerText = cursorText;
        text.style.opacity = '1';
        
        dot.style.opacity = '0'; // hide center dot
      } else {
        hasText = false;
        // Standard interactive hover (larger ring, no label)
        cursor.style.width  = '52px';
        cursor.style.height = '52px';
        cursor.style.background = 'transparent';
        cursor.style.borderColor = '#B5502D';
        cursor.style.mixBlendMode = 'difference';
        
        text.style.opacity = '0';
        
        dot.style.backgroundColor = '#B5502D';
        dot.style.opacity = '1';
      }
    };

    const contract = () => {
      isHovered = false;
      hasText = false;
      
      // Reset to idle crosshair/ring
      cursor.style.width  = '28px';
      cursor.style.height = '28px';
      cursor.style.background = 'transparent';
      cursor.style.borderColor = '#1b1c1c';
      cursor.style.mixBlendMode = 'difference';
      
      text.style.opacity = '0';
      
      dot.style.backgroundColor = '#1b1c1c';
      dot.style.opacity = '1';
    };

    const registerListeners = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], input, textarea, label, [data-cursor]'
      );
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', expand);
        el.removeEventListener('mouseleave', contract);
        el.addEventListener('mouseenter', expand);
        el.addEventListener('mouseleave', contract);
      });
    };

    registerListeners();

    /* MutationObserver to bind new items automatically */
    const observer = new MutationObserver(() => {
      registerListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
      observer.disconnect();
      
      const targets = document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], input, textarea, label, [data-cursor]'
      );
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
      {/* Lagging outer ring */}
      <div
        id="custom-cursor"
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          zIndex: 99999,
          top: 0,
          left: 0,
          width: '28px',
          height: '28px',
          border: '1px solid #1b1c1c',
          borderRadius: '50%',
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition:
            'width 300ms cubic-bezier(0.16,1,0.3,1), ' +
            'height 300ms cubic-bezier(0.16,1,0.3,1), ' +
            'border-color 200ms ease, background 200ms ease',
        }}
      >
        <span
          ref={textRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            color: '#F5F5DC', // warm cream text over terracotta
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0,
            transition: 'opacity 180ms ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        />
      </div>
      
      {/* Instant inner dot */}
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
          transition: 'opacity 200ms ease, background-color 200ms ease',
        }}
      />
    </>
  );
}
