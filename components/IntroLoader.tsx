'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMonogram, setShowMonogram] = useState(false);

  useEffect(() => {
    // Show monogram shortly after mount
    const monoTimer = setTimeout(() => setShowMonogram(true), 250);
    return () => clearTimeout(monoTimer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class simulating liquid metal
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      targetAttractor: number; // 0 = left, 1 = right

      constructor() {
        // Spawn randomly in a small circle in center
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 35;
        this.x = width / 2 + Math.cos(angle) * r;
        this.y = height / 2 + Math.sin(angle) * r;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = 1.2 + Math.random() * 2.2;
        this.color = '#F5F5DC'; // warm beige liquid metal
        this.targetAttractor = Math.random() > 0.5 ? 1 : 0;
      }

      update(time: number, leftAttractor: { x: number; y: number }, rightAttractor: { x: number; y: number }, centerAttractor: { x: number; y: number }) {
        let ax = 0;
        let ay = 0;

        if (time < 1.0) {
          // Phase 1: Attracted to center
          const dx = centerAttractor.x - this.x;
          const dy = centerAttractor.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = Math.min(2.5, 45 / dist);
          ax = (dx / dist) * force * 0.16;
          ay = (dy / dist) * force * 0.16;
        } else {
          // Phase 2: Attracted to split side targets
          const target = this.targetAttractor === 0 ? leftAttractor : rightAttractor;
          const dx = target.x - this.x;
          const dy = target.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = Math.min(3.5, 65 / dist);
          ax = (dx / dist) * force * 0.28;
          ay = (dy / dist) * force * 0.28;
        }

        // Physics updates
        this.vx = this.vx * 0.93 + ax;
        this.vy = this.vy * 0.93 + ay;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 150 }).map(() => new Particle());
    const startTime = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      ctx.fillStyle = 'rgba(27, 28, 28, 0.24)'; // trail effect for liquid metal motion blur
      ctx.fillRect(0, 0, width, height);

      // Coordinates of attractors
      const centerAttractor = { x: width / 2, y: height / 2 };
      
      // Split distance zooms out
      const splitDist = Math.min(width * 0.38, Math.max(0, (elapsed - 1.0) * width * 0.45));
      const leftAttractor = { x: width / 2 - splitDist, y: height / 2 };
      const rightAttractor = { x: width / 2 + splitDist, y: height / 2 };

      // Update and draw particles
      particles.forEach((p) => {
        p.update(elapsed, leftAttractor, rightAttractor, centerAttractor);
        p.draw(ctx);
      });

      // Draw subtle connectors between close particles to simulate fluid surface tension
      ctx.strokeStyle = 'rgba(245, 245, 220, 0.055)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      if (elapsed < 2.6) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        // Complete loader
        onComplete();
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#1b1c1c',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      
      {/* Monogram Overlay */}
      <AnimatePresence>
        {showMonogram && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              zIndex: 10,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '4.5rem',
              fontWeight: 700,
              color: '#F5F5DC', // matching the beige text
              letterSpacing: '-0.04em',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            DY
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
