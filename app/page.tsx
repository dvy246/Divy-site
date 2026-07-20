'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { RoughNotation } from 'react-rough-notation';
import { motion } from 'framer-motion';
import ArticleCard from '@/components/ArticleCard';
import SketchDivider from '@/components/SketchDivider';
import ScrollReveal3D from '@/components/ScrollReveal3D';
import Magnetic from '@/components/Magnetic';
import { BIO } from '@/lib/bio';
import articles from '@/data/articles.json';
const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
});

/* === Constants === */
const MARQUEE_ITEMS = [
  'AI Engineer', '·', 'Technical Writer', '·',
  'Solopreneur', '·', 'RAG Pipelines', '·',
  'LLM Applications', '·', 'Multi-Agent Systems', '·',
  'LangChain', '·', 'LangGraph', '·',
  'Production AI', '·',
];

const SOCIAL_LINKS = [
  { label: 'GitHub',     href: 'https://github.com/dvy246' },
  { label: 'LinkedIn',   href: 'https://www.linkedin.com/in/divyyadav/' },
  { label: 'Medium',     href: 'https://medium.com/@yadavdivy296' },
  { label: 'Substack',   href: 'https://substack.com/@divy1111' },
  { label: 'YouTube',    href: 'https://www.youtube.com/@techbydivy/shorts' },
  { label: 'Newsletter', href: 'https://aiengsimplified.beehiiv.com/' },
];

function getSocialIcon(label: string) {
  switch (label) {
    case 'GitHub':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case 'LinkedIn':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'Medium':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
      );
    case 'Substack':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <path d="M22.539 8.242H1.46V5.406h21.078v2.836zM1.46 10.881H22.54v2.836H1.46v-2.836zM1.46 16.356H22.54v6.184L12 16.356H1.46z" />
        </svg>
      );
    case 'YouTube':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
        </svg>
      );
    case 'Newsletter':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    default:
      return null;
  }
}

const STATS = [
  { num: '5+',  label: 'AI Systems Built' },
  { num: '2K+', label: 'Engineers Weekly' },
  { num: '10+', label: 'Articles Published' },
  { num: '2',   label: 'Production Clients' },
];

const TAGLINE = ['AI', 'Engineer', 'crafting', 'intelligent', 'software', 'and', 'ideas.'];

/* === Marquee strip === */
function MarqueeStrip({ inverted = false }: { inverted?: boolean }) {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS,
                   ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop:    `1px solid ${inverted ? '#F5F5DC' : '#1b1c1c'}`,
        borderBottom: `1px solid ${inverted ? '#F5F5DC' : '#1b1c1c'}`,
        padding: '0.85rem 0',
        background: inverted ? '#1b1c1c' : '#F5F5DC',
      }}
    >
      <div className="marquee-inner" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: item === '·'
                ? '#B5502D'
                : inverted ? 'rgba(245,245,220,0.7)' : '#747878',
              marginRight: '2.5rem',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* === Scroll progress bar === */
function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    const update = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? scrolled / total : 0;
      bar.style.transform = `scaleX(${pct})`;
      bar.style.width = '100%';
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div id="scroll-progress" aria-hidden="true" />;
}

/* === Letter-by-letter reveal === */
function SplitText({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  return (
    <span aria-label={text} style={{ display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            cursor: 'default',
            originX: 0.5,
            originY: 0.5,
            paddingBottom: '0.12em',
            overflow: 'visible',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 15,
            delay: delay + i * 0.03,
          }}
          whileHover={{
            scale: 1.25,
            rotate: 0,
            color: '#B5502D',
            transition: { type: 'spring', stiffness: 450, damping: 10 }
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* === Homepage === */
export default function HomePage() {
  const [show, setShow]       = useState(false);
  const [isMobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords]   = useState({ x: 50, y: 50 });
  const [revealState, setRevealState] = useState<'idle' | 'revealing' | 'complete'>('idle');
  const bioRef    = useRef<HTMLElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);

  /* Hydration + mobile detection + entrance sequence trigger */
  useEffect(() => {
    setMounted(true);
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);

    // Reveal main typography heading automatically on mount
    const triggerTimer = setTimeout(() => {
      setShow(true);
    }, 300);

    const handleRevealStart = () => setRevealState('revealing');
    const handleRevealComplete = () => setRevealState('complete');

    window.addEventListener('dy_sculpture_reveal_start', handleRevealStart);
    window.addEventListener('dy_sculpture_reveal_complete', handleRevealComplete);

    return () => {
      window.removeEventListener('resize', check);
      clearTimeout(triggerTimer);
      window.removeEventListener('dy_sculpture_reveal_start', handleRevealStart);
      window.removeEventListener('dy_sculpture_reveal_complete', handleRevealComplete);
    };
  }, []);

  /* GSAP scroll triggers for page-specific elements */
  useEffect(() => {
    if (!mounted) return;
    let ctx: any;
    const init = async () => {
      const { gsap }         = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Parallax scroll on marquee text strip
        gsap.to('.marquee-inner', {
          xPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: '.bio-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          }
        });

        // Initial setup in GSAP context to avoid flash
        gsap.set('.scrolly-slide-2', { autoAlpha: 0, y: 60, filter: 'blur(8px)', scale: 1.05 });
        gsap.set('.scrolly-slide-3', { autoAlpha: 0, y: 60, filter: 'blur(8px)', scale: 1.05 });
        gsap.set('.scrolly-slide-4', { autoAlpha: 0, y: 60, filter: 'blur(8px)', scale: 1.05 });

        // Apple-level Scrollytelling Reveal Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.scrollytelling-trigger',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          }
        });

        // Slide 1 exits (upwards/dissolves)
        tl.to('.scrolly-slide-1', { autoAlpha: 0, y: -60, filter: 'blur(8px)', scale: 0.95, duration: 0.15 }, 0.05)
          
          // Slide 2 enters (from bottom/focuses)
          .to('.scrolly-slide-2', { autoAlpha: 1, y: 0, filter: 'blur(0px)', scale: 1.0, duration: 0.15 }, 0.20)
          // Slide 2 exits (upwards/dissolves)
          .to('.scrolly-slide-2', { autoAlpha: 0, y: -60, filter: 'blur(8px)', scale: 0.95, duration: 0.15 }, 0.43)

          // Slide 3 enters (from bottom/focuses)
          .to('.scrolly-slide-3', { autoAlpha: 1, y: 0, filter: 'blur(0px)', scale: 1.0, duration: 0.15 }, 0.58)
          // Slide 3 exits (upwards/dissolves)
          .to('.scrolly-slide-3', { autoAlpha: 0, y: -60, filter: 'blur(8px)', scale: 0.95, duration: 0.15 }, 0.81)

          // Slide 4 enters (from bottom/focuses)
          .to('.scrolly-slide-4', { autoAlpha: 1, y: 0, filter: 'blur(0px)', scale: 1.0, duration: 0.15 }, 0.96);
      });
    };
    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [mounted]);

  // Keep a local scrollProgress state for auxiliary overlays if needed
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const progress = Math.min(1.0, Math.max(0.0, scrollY / (winHeight * 2.2)));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <ScrollProgress />
      {/* Faceted 3D Glass Crystal Element - Visibility Gated */}
      <HeroCanvas isMobile={isMobile} />

      {/* --- SCROLLYTELLING CONTAINER --- */}
      <div
        className="scrollytelling-trigger"
        style={{
          position: 'relative',
          height: '350vh', // 3.5 viewports of scroll space
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100svh',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          {/* Background editorial line */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(27,28,28,0.05)',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />

          {/* Slide 1: The Identity (Divy Yadav) */}
          <div
            className="scrolly-slide-1"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5vw',
              zIndex: 2,
            }}
          >
            {/* Label */}
            <p
              className="label-caps"
              style={{
                marginBottom: '2rem',
                fontSize: '11px',
                letterSpacing: '0.22em',
                fontWeight: 700,
                color: '#B5502D',
                animation: 'fadeIn 0.5s ease 0.25s both',
              }}
            >
              AI ENGINEER
            </p>

            {/* Main heading - cinematic letter reveal */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 9vw, 8.5rem)',
                fontWeight: 700,
                fontStyle: 'normal',
                lineHeight: 1.1,
                letterSpacing: '0.04em',
                color: '#0e0f0f',
                marginBottom: '1.8rem',
                overflow: 'visible',
                paddingBottom: '0.12em',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <RoughNotation
                type="underline"
                color="#B5502D"
                show={show}
                strokeWidth={3.5}
                iterations={2}
                padding={12}
                animationDelay={1000}
                animationDuration={800}
              >
                <SplitText text="Divy Yadav" delay={0.15} />
              </RoughNotation>
            </h1>

            {/* Tagline - staggered words */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '3rem',
                justifyContent: 'center',
              }}
            >
              {TAGLINE.map((word, idx) => (
                <span
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.7rem)',
                    fontWeight: 600,
                    color: idx < 2 ? '#0e0f0f' : '#444748',
                    animation: `fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) ${0.6 + idx * 0.12}s both`,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Bio snippet */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                lineHeight: 1.85,
                color: '#1b1c1c',
                fontWeight: 500,
                maxWidth: '620px',
                marginBottom: '3.2rem',
                animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s both',
                textAlign: 'center',
              }}
            >
              {BIO}
            </p>

            {/* Social links with Magnetic wrappers */}
            <div
              style={{
                display: 'flex',
                gap: '1.75rem',
                flexWrap: 'wrap',
                animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 1.05s both',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {SOCIAL_LINKS.map((link) => (
                <Magnetic key={link.label} range={30} strength={0.35}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-underline"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10.5px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: '#0e0f0f',
                      textDecoration: 'none',
                      transition: 'color 160ms ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#B5502D';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#1b1c1c';
                    }}
                  >
                    {getSocialIcon(link.label)}
                    <span>{link.label}</span>
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Slide 2: The Craft */}
          <div
            className="scrolly-slide-2"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5vw',
              opacity: 0,
              visibility: 'hidden',
              transform: 'translateY(60px)',
              filter: 'blur(8px)',
              zIndex: 2,
            }}
          >
            <p className="label-caps" style={{ marginBottom: '1.5rem' }}>THE CRAFT</p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
              fontWeight: 700,
              color: '#1b1c1c',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              textAlign: 'center',
              maxWidth: '820px',
            }}>
              Architecting High-Throughput{' '}
              <span style={{ fontStyle: 'italic', color: '#B5502D' }}>
                AI Core Systems
              </span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              lineHeight: 1.85,
              color: '#444748',
              maxWidth: '680px',
              textAlign: 'center',
              fontWeight: 500,
            }}>
              Building low-latency RAG architectures, agentic pipelines, and custom LLM microservices. I translate complex research substrates into production-ready software systems built for scaling communication.
            </p>
          </div>

          {/* Slide 3: The Metrics */}
          <div
            className="scrolly-slide-3"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5vw',
              opacity: 0,
              visibility: 'hidden',
              transform: 'translateY(60px)',
              filter: 'blur(8px)',
              zIndex: 2,
            }}
          >
            <p className="label-caps" style={{ marginBottom: '2.5rem' }}>METRICS OF IMPACT</p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                gap: '2rem',
                width: '100%',
                maxWidth: '780px',
              }}
            >
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: i % 2 === 0 ? 'rgba(245, 245, 220, 0.45)' : 'rgba(232, 232, 208, 0.45)',
                    border: '1px solid #1b1c1c',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)',
                      fontWeight: 700,
                      color: '#B5502D',
                      lineHeight: 1.1,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {stat.num}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#1b1c1c',
                      fontWeight: 600,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Slide 4: Circular Portrait Reveal */}
          <div
            className="scrolly-slide-4"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5vw',
              opacity: 0,
              visibility: 'hidden',
              transform: 'translateY(60px)',
              filter: 'blur(8px)',
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: isMobile ? '276px' : '396px',
                height: isMobile ? '276px' : '396px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Outer Terracotta guidelines rotating dashed technical ring */}
              <div
                className="circular-frame animate-spin"
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px dashed #B5502D',
                  opacity: 0.8,
                  pointerEvents: 'none',
                  animationDuration: '35s',
                }}
              />

              {/* Main Circular Profile Photo */}
              <div
                className="circular-frame"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setCoords({ x, y });
                }}
                onMouseLeave={() => setCoords({ x: 50, y: 50 })}
                style={{
                  width: isMobile ? '260px' : '380px',
                  height: isMobile ? '260px' : '380px',
                  border: '2px solid #1b1c1c',
                  position: 'relative',
                  backgroundColor: '#e8e5e0',
                  boxShadow: '0 20px 45px rgba(27, 28, 28, 0.15)',
                  overflow: 'hidden',
                  zIndex: 2,
                }}
              >
                <Image
                  src="/images/profile.jpg"
                  alt="Divy Yadav Portrait"
                  fill
                  priority
                  sizes="(max-width: 768px) 260px, 380px"
                  style={{
                    objectFit: 'cover',
                    zIndex: 1,
                    filter: revealState === 'revealing' ? 'blur(6px) contrast(1.15) brightness(1.08)' : 'none',
                    opacity: revealState === 'revealing' ? 0.78 : 1,
                    transition: 'filter 2.2s cubic-bezier(0.16,1,0.3,1), opacity 2.2s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
                
                {/* Gold/Refraction emerging energy overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle, rgba(223, 180, 108, 0.45) 0%, rgba(181, 80, 45, 0.1) 60%, transparent 100%)',
                    opacity: revealState === 'revealing' ? 1 : 0,
                    mixBlendMode: 'color-dodge',
                    pointerEvents: 'none',
                    zIndex: 3,
                    transition: 'opacity 1.5s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />

                {/* Dynamic Mouse-tracking Glass Highlight Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.15) 100%)`,
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none',
                    zIndex: 2,
                    transition: 'background 0.05s ease-out',
                  }}
                />

                {/* Glass Lens Internal Shadow Rim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    boxShadow: 'inset 0 0 25px rgba(255, 255, 255, 0.35)',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                />
              </div>
            </div>

            {/* Hand-sketched Subtitle greeting */}
            <p
              style={{
                fontFamily: 'var(--font-sketch)',
                fontSize: isMobile ? '1.8rem' : '2.4rem',
                color: '#B5502D',
                marginTop: '1.75rem',
                textAlign: 'center',
                transform: 'rotate(-1.5deg)',
                animation: 'fadeIn 0.8s ease 1.2s both',
              }}
            >
              Hey, I am Divy
            </p>
          </div>

          {/* Scroll cue (only visible on first beat) */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 1s ease 1.5s both',
              opacity: scrollProgress < 0.15 ? 1 - scrollProgress / 0.15 : 0,
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '9px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#747878',
                fontWeight: 600,
              }}
            >
              Scroll
            </span>
            <div
              style={{
                width: '1px',
                height: '30px',
                position: 'relative',
                backgroundColor: 'rgba(27,28,28,0.15)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  backgroundColor: '#1b1c1c',
                  animation: 'scrollPulse 2.2s cubic-bezier(0.16,1,0.3,1) 2s infinite',
                  transformOrigin: 'top center',
                  height: '100%',
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* --- MARQUEE --- */}
      <MarqueeStrip inverted />

      {/* --- ABOUT --- */}
      <section
        ref={bioRef}
        className="bio-section"
        style={{
          padding: '10rem 5vw',
          perspective: '1200px',
          overflow: 'visible',
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <ScrollReveal3D>
          <div
            style={{
              maxWidth: '840px',
              margin: '0 auto',
              textAlign: 'center',
              pointerEvents: 'auto',
            }}
          >
            <p className="label-caps" style={{ marginBottom: '1.5rem' }}>About</p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                color: '#1b1c1c',
                lineHeight: 1.2,
                marginBottom: '2rem',
              }}
            >
              Building at the intersection of{' '}
              <span style={{ fontStyle: 'italic', color: '#B5502D' }}>
                AI and communication
              </span>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                lineHeight: 1.9,
                color: '#444748',
                marginBottom: '3rem',
                fontWeight: 500,
              }}
            >
              From custom RAG pipelines to multi-agent intelligence - I construct the
              technical substrate that allows LLMs to solve real-world problems. Every system is optimized for throughput; every article is an engineering blueprint read by 2,000+ practitioners weekly.
            </p>
            <Magnetic range={36} strength={0.3}>
              <Link
                href="/articles"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#1b1c1c',
                  borderBottom: '1px solid #1b1c1c',
                  paddingBottom: '4px',
                  transition: 'color 160ms ease, border-color 160ms ease',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = '#B5502D';
                  el.style.borderColor = '#B5502D';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = '#1b1c1c';
                  el.style.borderColor = '#1b1c1c';
                }}
              >
                Read the Atelier Writing →
              </Link>
            </Magnetic>
          </div>
        </ScrollReveal3D>
      </section>

      <SketchDivider />

      {/* --- LATEST WRITING --- */}
      <section
        className="articles-preview"
        style={{
          padding: '7rem 5vw',
          perspective: '1200px',
          overflow: 'visible',
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '3.5rem',
            pointerEvents: 'auto',
          }}
        >
          <div>
            <p className="label-caps" style={{ marginBottom: '0.75rem' }}>
              Latest Writing
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                color: '#1b1c1c',
              }}
            >
              From the studio
            </h2>
          </div>
          <Magnetic range={30} strength={0.3}>
            <Link
              href="/articles"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#B5502D',
                borderBottom: '1px solid #B5502D',
                paddingBottom: '3px',
                display: 'inline-block',
              }}
            >
              All Articles →
            </Link>
          </Magnetic>
        </div>

        {/* Article cards wrapped in 3D reveals */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '2.5rem',
            overflow: 'visible',
            pointerEvents: 'auto',
          }}
        >
          {articles.slice(0, 2).map((article, idx) => (
            <div key={article.title} className="article-card-item" style={{ overflow: 'visible' }}>
              <ScrollReveal3D delay={idx * 0.08}>
                <ArticleCard {...article} />
              </ScrollReveal3D>
            </div>
          ))}
        </div>
      </section>

      <SketchDivider />

      {/* --- CTA - NEWSLETTER --- */}
      <section
        className="cta-section"
        style={{
          padding: '8rem 5vw',
          borderTop: '1px solid rgba(27,28,28,0.08)',
          perspective: '1200px',
          overflow: 'visible',
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <ScrollReveal3D>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
              gap: '3rem',
              alignItems: 'center',
              pointerEvents: 'auto',
            }}
          >
            <div>
              <p className="label-caps" style={{ marginBottom: '1rem' }}>
                Newsletter
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  fontWeight: 700,
                  color: '#1b1c1c',
                  lineHeight: 1.1,
                  marginBottom: '1rem',
                }}
              >
                AI Engineering{' '}
                <span style={{ fontStyle: 'italic', color: '#B5502D' }}>
                  Simplified
                </span>
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: '#444748',
                  maxWidth: '420px',
                  lineHeight: 1.75,
                }}
              >
                Weekly deep-dives on RAG, agents, and production AI engineering.
                Join 2,000+ engineers who build.
              </p>
            </div>

            <Magnetic range={45} strength={0.35}>
              <a
                href="https://aiengsimplified.beehiiv.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#F5F5DC',
                  backgroundColor: '#1b1c1c',
                  padding: '1.1rem 2.5rem',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 180ms ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#B5502D';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1b1c1c';
                }}
              >
                Subscribe Free →
              </a>
            </Magnetic>
          </div>
        </ScrollReveal3D>
      </section>
    </>
  );
}
