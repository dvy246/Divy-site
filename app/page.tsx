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
/* === Dynamic 3D import === */
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

  /* Hydration + mobile detection + entrance sync */
  useEffect(() => {
    setMounted(true);
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);

    const triggerHero = () => {
      setTimeout(() => {
        setShow(true);
      }, 300);
    };

    const entered = sessionStorage.getItem('dy_portfolio_entered');
    if (entered === 'true') {
      setShow(true);
    } else {
      window.addEventListener('dy_entrance_complete', triggerHero);
    }

    const handleRevealStart = () => setRevealState('revealing');
    const handleRevealComplete = () => setRevealState('complete');

    window.addEventListener('dy_sculpture_reveal_start', handleRevealStart);
    window.addEventListener('dy_sculpture_reveal_complete', handleRevealComplete);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('dy_entrance_complete', triggerHero);
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
        // Parallax scroll on marquee text strip or background elements if needed
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
      });
    };
    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <ScrollProgress />

      {/* Flagship Fixed 3D Hero Canvas Overlay - Runs performantly on both desktop and mobile viewports */}
      <HeroCanvas isMobile={isMobile} />

      {/* --- HERO --- */}
      <section
        aria-label="Hero"
        style={{
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '8rem 5vw 5rem' : '11.5rem 5vw 7.5rem',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 10,
          pointerEvents: 'none',
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            gap: isMobile ? '2.5rem' : '4.5rem',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          {/* EDITORIAL TEXT */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '800px',
              pointerEvents: 'auto',
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
                fontSize: 'clamp(4.2rem, 10vw, 8.5rem)',
                fontWeight: 700,
                fontStyle: 'normal',
                lineHeight: 1.1,
                letterSpacing: '0.04em',
                color: '#0e0f0f',
                marginBottom: '1.8rem',
                overflow: 'visible',
                paddingBottom: '0.12em',
                textAlign: 'center',
              }}
            >
              <RoughNotation
                type="underline"
                color="#B5502D"
                show={show}
                strokeWidth={4}
                animationDelay={1000}
                animationDuration={700}
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
                      display: 'block',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#B5502D';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#1b1c1c';
                    }}
                  >
                    {link.label}
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Circular Glass Lens Profile Portrait */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: isMobile ? '340px' : '580px',
              pointerEvents: 'none',
            }}
          >
            <Magnetic range={45} strength={0.15}>
              <div
                style={{
                  position: 'relative',
                  width: isMobile ? '276px' : '396px',
                  height: isMobile ? '276px' : '396px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'auto',
                }}
              >
                {/* Outer Terracotta guidelines rotating dashed technical ring */}
                <div
                  className="circular-frame animate-spin"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: '1px dashed #B5502D',
                    opacity: revealState === 'revealing' ? 1.0 : 0.8,
                    pointerEvents: 'none',
                    animationDuration: revealState === 'revealing' ? '7s' : '35s',
                    boxShadow: revealState === 'revealing' ? '0 0 30px rgba(181, 80, 45, 0.4)' : 'none',
                    transition: 'opacity 0.6s ease, box-shadow 0.6s ease',
                  }}
                />

                {/* Main Circular Profile Profile Photo Glass Container */}
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
            </Magnetic>

            {/* Hand-sketched Subtitle greeting placed cleanly under the photo container */}
            <p
              style={{
                fontFamily: 'var(--font-sketch)',
                fontSize: isMobile ? '1.8rem' : '2.4rem',
                color: '#B5502D',
                marginTop: '1.75rem',
                textAlign: 'center',
                pointerEvents: 'auto',
                transform: 'rotate(-1.5deg)',
                animation: 'fadeIn 0.8s ease 1.2s both',
              }}
            >
              Hey, I am Divy
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
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
      </section>

      {/* --- MARQUEE --- */}
      <MarqueeStrip inverted />

      {/* --- ABOUT / STATS --- */}
      <section
        ref={bioRef}
        className="bio-section"
        style={{
          padding: '7rem 5vw',
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
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '5rem',
              alignItems: 'start',
              pointerEvents: 'auto',
            }}
          >
            {/* Left text */}
            <div>
              <p className="label-caps" style={{ marginBottom: '1rem' }}>About</p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  fontWeight: 700,
                  color: '#1b1c1c',
                  lineHeight: 1.15,
                  marginBottom: '1.75rem',
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
                  fontSize: '1rem',
                  lineHeight: 1.85,
                  color: '#444748',
                  marginBottom: '2.5rem',
                }}
              >
                From RAG pipelines to agentic systems - I build and write about the
                technical substrate of modern AI applications. Every project is a proof
                of concept; every article is a blueprint that 2,000+ engineers read weekly.
              </p>
              <Magnetic range={36} strength={0.3}>
                <Link
                  href="/articles"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: '#1b1c1c',
                    borderBottom: '1px solid #1b1c1c',
                    paddingBottom: '3px',
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
                  Read my writing →
                </Link>
              </Magnetic>
            </div>

            {/* Right stats grid */}
            <div
              className="stats-grid"
              ref={statsRef}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1px',
                backgroundColor: '#1b1c1c',
                border: '1px solid #1b1c1c',
              }}
            >
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="stat-item"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#F5F5DC' : '#E8E8D0',
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: 700,
                      color: '#1b1c1c',
                      lineHeight: 1,
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
                      color: '#747878',
                      fontWeight: 600,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
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
