'use client';

import { useEffect, useRef } from 'react';

export default function SketchDivider() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof window === 'undefined') return;

    // Use roughjs if available, otherwise fall back to static path
    const draw = async () => {
      try {
        const rough = await import('roughjs');
        const rc    = rough.default.svg(svg);
        // Clear any existing children
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const w = svg.getBoundingClientRect().width || window.innerWidth;
        const line = rc.line(0, 10, w, 10, {
          roughness:   1.8,
          strokeWidth: 1.2,
          stroke:      '#1b1c1c',
        });
        svg.appendChild(line);
      } catch {
        // fallback — static wavy path already in SVG
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ padding: '0 5vw', lineHeight: 0 }}
    >
      <svg
        ref={svgRef}
        className="sketch-divider"
        width="100%"
        height="20"
        viewBox="0 0 1200 20"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Static fallback path */}
        <path
          d="M0,10 C100,4 200,16 300,10 C400,4 500,16 600,10 C700,4 800,16 900,10 C1000,4 1100,16 1200,10"
          stroke="#1b1c1c"
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
