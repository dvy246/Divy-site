'use client';

import { useEffect, useState } from 'react';
import { RoughNotation } from 'react-rough-notation';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleCard from '@/components/ArticleCard';
import SketchDivider from '@/components/SketchDivider';
import ScrollReveal3D from '@/components/ScrollReveal3D';
import Magnetic from '@/components/Magnetic';
import articles from '@/data/articles.json';

export default function ArticlesPage() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
          stagger: 0.08,
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

  // Dynamically extract all unique tags from articles
  const categories = [
    'All',
    ...Array.from(new Set(articles.flatMap((a) => a.tags || []))).sort()
  ];

  // Filter articles based on selection
  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((a) => (a.tags || []).includes(selectedCategory));

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

        {/* Category Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem 1.25rem',
            marginTop: '3.5rem',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#747878',
              fontWeight: 700,
              marginRight: '0.5rem',
            }}
          >
            Filter by:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Magnetic key={cat} range={24} strength={0.2}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.35rem 0.8rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: isActive ? '#B5502D' : '#444748',
                    position: 'relative',
                    transition: 'color 200ms ease',
                    display: 'block',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-filter-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: '1px solid #B5502D',
                        borderRadius: '20px',
                        zIndex: -1,
                        backgroundColor: 'rgba(181, 80, 45, 0.04)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {cat}
                </button>
              </Magnetic>
            );
          })}
        </div>
      </header>

      <SketchDivider />

      {/* Articles grid */}
      <section
        className="articles-grid"
        style={{ padding: '5rem 5vw 8rem', overflow: 'visible' }}
      >
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '2.5rem',
            overflow: 'visible',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                key={article.title}
                className="article-grid-card"
                style={{ overflow: 'visible' }}
              >
                <ScrollReveal3D delay={Math.min(idx, 4) * 0.05}>
                  <ArticleCard {...article} />
                </ScrollReveal3D>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
