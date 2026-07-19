'use client';

import { useEffect, useState } from 'react';
import { RoughNotation } from 'react-rough-notation';
import ArticleCard from '@/components/ArticleCard';
import SketchDivider from '@/components/SketchDivider';
import articles from '@/data/articles.json';

export default function ArticlesPage() {
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
        '.article-grid-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.articles-grid',
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
          Writing
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#1b1c1c',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: '1.75rem',
            display: 'inline-block',
          }}
        >
          <RoughNotation
            type="underline"
            color="#B5502D"
            show={show}
            strokeWidth={3}
            animationDuration={600}
          >
            Articles
          </RoughNotation>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
            lineHeight: 1.8,
            color: '#444748',
            maxWidth: '540px',
            marginTop: '1rem',
          }}
        >
          Technical deep-dives on RAG, multi-agent systems, vector databases,
          and production AI engineering. Written for engineers who build.
        </p>
      </header>

      <SketchDivider />

      {/* Articles grid */}
      <section
        className="articles-grid"
        style={{ padding: '5rem 5vw 8rem' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '1px',
            backgroundColor: '#1b1c1c',
            border: '1px solid #1b1c1c',
          }}
        >
          {articles.map((article) => (
            <div key={article.title} className="article-grid-card">
              <ArticleCard {...article} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
