'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { RoughNotation } from 'react-rough-notation';
import { motion } from 'framer-motion';
import ArticleCard from '@/components/ArticleCard';
import SketchDivider from '@/components/SketchDivider';
import { BIO } from '@/lib/bio';
import articles from '@/data/articles.json';

/* === Dynamic 3D import === */
const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '1px solid #1b1c1c',
          borderTopColor: '#B5502D',
          animation: 'spin 1.2s linear infinite',
        }}
      />
    </div>
  ),
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
  { label: 'LinkedIn',   href: 'https://www.linkedin.com/divyyadav' },
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

const TAGLINE = ['The Architect.', 'Writer.', 'Solopreneur.'];

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
  const bioRef    = useRef<HTMLElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);

  /* Hydration + mobile detection */
  useEffect(() => {
    setMounted(true);
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    const t = setTimeout(() => setShow(true), 900);
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  }, []);

  /* GSAP scroll triggers */
  useEffect(() => {
    if (!mounted) return;
    const init = async () => {
      const { gsap }         = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Bio text swing-in
      gsap.fromTo('.bio-section > div > div:first-child', 
        { 
          opacity: 0, 
          y: 90, 
          rotationX: 18, 
          scale: 0.9, 
          transformOrigin: 'top center' 
        }, 
        {
          opacity: 1, 
          y: 0, 
          rotationX: 0, 
          scale: 1, 
          duration: 1.2, 
          ease: 'power4.out',
          scrollTrigger: { trigger: '.bio-section', start: 'top 85%' },
        }
      );

      // Stats counter 3D pop
      gsap.fromTo('.stat-item', 
        { 
          opacity: 0, 
          y: 60, 
          rotationX: 22, 
          scale: 0.85, 
          transformOrigin: 'top center' 
        }, 
        {
          opacity: 1, 
          y: 0, 
          rotationX: 0, 
          scale: 1, 
          duration: 0.9, 
          stagger: 0.12, 
          ease: 'power4.out',
          scrollTrigger: { trigger: '.stats-grid', start: 'top 82%' },
        }
      );

      // Article cards 3D swing-in stagger
      gsap.fromTo('.article-card-item', 
        { 
          opacity: 0, 
          y: 100, 
          rotationX: 25, 
          rotationY: -8, 
          scale: 0.9, 
          transformOrigin: 'top center' 
        }, 
        {
          opacity: 1, 
          y: 0, 
          rotationX: 0, 
          rotationY: 0, 
          scale: 1, 
          duration: 1.2, 
          stagger: 0.16, 
          ease: 'power4.out',
          scrollTrigger: { trigger: '.articles-preview', start: 'top 82%' },
        }
      );

      // CTA section 3D swing-in
      gsap.fromTo('.cta-section', 
        { 
          opacity: 0, 
          y: 80, 
          rotationX: 16, 
          scale: 0.96, 
          transformOrigin: 'top center' 
        }, 
        {
          opacity: 1, 
          y: 0, 
          rotationX: 0, 
          scale: 1, 
          duration: 1.1, 
          ease: 'power4.out',
          scrollTrigger: { trigger: '.cta-section', start: 'top 85%' },
        }
      );
    };
    init();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <ScrollProgress />

      {/* --- HERO --- */}
      <section
        aria-label="Hero"
        style={{
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '7rem 5vw 4rem' : '8rem 5vw 4rem',
          position: 'relative',
          overflow: 'hidden',
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
            gap: isMobile ? '2.5rem' : '4rem',
            zIndex: 2,
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
            }}
          >
            {/* Label */}
            <p
              className="label-caps"
              style={{
                marginBottom: '1.5rem',
                animation: 'fadeIn 0.5s ease 0.2s both',
              }}
            >
              AI Engineer * Technical Writer * Solopreneur
            </p>

            {/* Main heading - cinematic letter reveal */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 9vw, 9rem)',
                fontWeight: 700,
                fontStyle: 'normal',
                lineHeight: 1.0,
                letterSpacing: '0.02em',
                color: '#1b1c1c',
                marginBottom: '1.75rem',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              <RoughNotation
                type="underline"
                color="#B5502D"
                show={show}
                strokeWidth={3}
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
                marginBottom: '2.5rem',
                justifyContent: 'center',
              }}
            >
              {TAGLINE.map((word, idx) => (
                <span
                  key={word}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)',
                    fontWeight: 600,
                    color: idx === 0 ? '#1b1c1c' : '#747878',
                    animation: `fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) ${0.6 + idx * 0.15}s both`,
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
                fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
                lineHeight: 1.8,
                color: '#444748',
                maxWidth: '600px',
                marginBottom: '2.5rem',
                animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s both',
                textAlign: 'center',
              }}
            >
              {BIO}
            </p>

            {/* Social links */}
            <div
              style={{
                display: 'flex',
                gap: '1.75rem',
                flexWrap: 'wrap',
                animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 1.05s both',
                justifyContent: 'center',
              }}
            >
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-underline"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: '#1b1c1c',
                    textDecoration: 'none',
                    transition: 'color 160ms ease',
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
              ))}
            </div>
          </div>

          {/* 3D or fallback */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 75,
              damping: 16,
              delay: 0.65,
            }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: isMobile ? '280px' : '520px',
              width: '100%',
              maxWidth: '800px',
            }}
          >
            {isMobile ? (
              <Image
                src="/hero-fallback.svg"
                alt="Hand-drawn geometric illustration"
                width={260}
                height={260}
                priority
              />
            ) : (
              <div style={{ width: '100%', height: '520px' }}>
                <HeroCanvas />
              </div>
            )}
          </motion.div>
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
        style={{ padding: '7rem 5vw', perspective: '1200px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '5rem',
            alignItems: 'start',
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
                marginBottom: '2rem',
              }}
            >
              From RAG pipelines to agentic systems - I build and write about the
              technical substrate of modern AI applications. Every project is a proof
              of concept; every article is a blueprint that 2,000+ engineers read weekly.
            </p>
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
      </section>

      <SketchDivider />

      {/* --- LATEST WRITING --- */}
      <section
        className="articles-preview"
        style={{ padding: '7rem 5vw', perspective: '1200px' }}
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
            }}
          >
            All Articles →
          </Link>
        </div>

        {/* Article cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '2.5rem',
            overflow: 'visible',
          }}
        >
          {articles.slice(0, 2).map((article) => (
            <div key={article.title} className="article-card-item" style={{ overflow: 'visible' }}>
              <ArticleCard {...article} />
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
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
          gap: '3rem',
          alignItems: 'center',
          borderTop: '1px solid rgba(27,28,28,0.08)',
          perspective: '1200px',
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
      </section>
    </>
  );
}
