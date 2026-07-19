'use client';

import { useEffect, useState } from 'react';
import { RoughNotation } from 'react-rough-notation';
import ArticleCard from '@/components/ArticleCard';
import SketchDivider from '@/components/SketchDivider';
import newsletters from '@/data/newsletters.json';

export default function NewsletterPage() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShow(true), 500);

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        '.newsletter-grid-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.newsletter-archive',
            start: 'top 82%',
          },
        }
      );
    };
    initGSAP();

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ paddingTop: '9rem', minHeight: '100vh', backgroundColor: '#F5F5DC' }}>
      {/* Header */}
      <header style={{ padding: '0 5vw 4rem' }}>
        <p className="label-caps" style={{ marginBottom: '1.25rem' }}>
          Newsletter
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#1b1c1c',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: '1.75rem',
            display: 'inline-block',
          }}
        >
          <RoughNotation
            type="bracket"
            color="#B5502D"
            show={show}
            strokeWidth={2.5}
            animationDuration={600}
            brackets={['left', 'right']}
            padding={6}
          >
            AI Engineering Simplified
          </RoughNotation>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
            lineHeight: 1.8,
            color: '#444748',
            maxWidth: '540px',
            marginTop: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          A weekly newsletter on production RAG, multi-agent systems, and
          practical AI engineering. Written for builders, not theorists. Join 2,000+ engineers.
        </p>

        {/* Subscribe CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
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
              backgroundColor: '#B5502D',
              textDecoration: 'none',
              padding: '1.1rem 2.5rem',
              display: 'inline-block',
              transition: 'background-color 180ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1b1c1c';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#B5502D';
            }}
          >
            Subscribe on Beehiiv →
          </a>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.05em',
              color: '#747878',
              fontWeight: 500,
            }}
          >
            Free · Weekly · No spam
          </span>
        </div>
      </header>

      <SketchDivider />

      {/* Archive */}
      <section
        className="newsletter-archive"
        style={{ padding: '5rem 5vw 8rem' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            fontWeight: 700,
            color: '#1b1c1c',
            marginBottom: '3rem',
          }}
        >
          Archive
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '2.5rem',
            overflow: 'visible',
          }}
        >
          {newsletters.map((issue) => (
            <div key={issue.title} className="newsletter-grid-card" style={{ overflow: 'visible' }}>
              <ArticleCard {...issue} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
