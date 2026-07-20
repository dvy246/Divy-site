'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface ArticleCardProps {
  title: string;
  url: string;
  date?: string;
  summary?: string;
  tags?: string[];
}

function getCardIllustration(title: string): string {
  const t = title.toLowerCase();

  // Specific Medium article title mappings
  if (t.includes('kimi k3')) {
    return '/images/kimi-k3.svg';
  } else if (t.includes('cost optimization') || t.includes('llm bills')) {
    return '/images/agent-cost.svg';
  } else if (t.includes('hacked other ai agents') || t.includes('nobody was driving')) {
    return '/images/agent-hack.svg';
  } else if (t.includes('claude code vs codex')) {
    return '/images/claude-code.svg';
  } else if (t.includes('context rot') || t.includes('long sessions')) {
    return '/images/context-rot.svg';
  } else if (t.includes('6 ai concepts')) {
    return '/images/six-concepts.svg';
  } else if (t.includes('rag experiment finally proved')) {
    return '/images/rag-experiment.svg';
  } else if (t.includes('google just kill rag') || t.includes('open knowledge format')) {
    return '/images/google-okf.svg';
  } else if (t.includes('boilerplate code') || t.includes('7 python libraries')) {
    return '/images/python-boilerplate.svg';
  } else if (t.includes('openwiki brains') || t.includes('remember you')) {
    return '/images/openwiki-brains.svg';
  }

  // Fallbacks for other dynamic articles or newsletter articles
  if (t.includes('9 rag') || t.includes('rag architectures')) {
    return '/images/rag-architectures.svg';
  } else if (t.includes('langgraph') || t.includes('stateful multi-agent')) {
    return '/images/multi-agent-systems.svg';
  } else if (t.includes('molecular search') || t.includes('qdrant')) {
    return '/images/molecular-search.svg';
  } else if (t.includes('mcp explained') || t.includes('model context protocol')) {
    return '/images/mcp-explained.svg';
  } else if (t.includes('evaluation')) {
    return '/images/llm-evaluation.svg';
  } else if (t.includes('issue #1') || t.includes('rag from scratch')) {
    return '/images/newsletter-rag.svg';
  } else if (t.includes('issue #2') || t.includes('design patterns')) {
    return '/images/newsletter-agent-patterns.svg';
  } else if (t.includes('issue #3') || t.includes('deployment')) {
    return '/images/newsletter-deployment.svg';
  } else if (t.includes('issue #4') || t.includes('vector databases compared')) {
    return '/images/newsletter-vector-databases.svg';
  }
  return '/images/rag-architectures.svg';
}

export default function ArticleCard({
  title,
  url,
  date,
  summary,
  tags,
}: ArticleCardProps) {
  const [hovered, setHovered] = useState(false);
  const isExternal = url.startsWith('http');
  const imageUrl = getCardIllustration(title);

  // Mouse hover springs for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 140, damping: 18, mass: 0.35 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Map mouse movement to subtle 3D rotation angles (max 6.5 degrees)
  const rotateX = useTransform(springY, [-0.5, 0.5], [6.5, -6.5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6.5, 6.5]);

  // Dynamic light sheen position tracking cursor
  const sheenBg = useTransform(
    [springX, springY],
    ([mx, my]) => `radial-gradient(circle 280px at ${(mx as number + 0.5) * 100}% ${(my as number + 0.5) * 100}%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = (e.clientX - rect.left) / width - 0.5;
    const yVal = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardContent = (
    <motion.div
      style={{
        width: '100%',
        height: '380px',
        cursor: 'pointer',
        perspective: '1200px',
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="read"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 350ms ease',
          transformStyle: 'preserve-3d',
          transform: hovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
          border: '1px solid #1b1c1c',
          boxShadow: hovered 
            ? '0 22px 48px rgba(27,28,28,0.14), 0 0 35px rgba(181,80,45,0.06)' 
            : '0 4px 15px rgba(27,28,28,0.03)',
        }}
      >
        {/* FRONT SIDE (Beige Card with Sketched Illustration) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#F5F5DC',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: 'translateZ(0px)', // hardware acceleration standard
          }}
        >
          {/* Glass sheen reflection overlay (mouse-tracking) */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: sheenBg,
              zIndex: 10,
              pointerEvents: 'none',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 250ms ease',
            }}
          />
          {/* Sketch Illustration */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '210px',
              borderBottom: '1px solid #1b1c1c',
            }}
          >
            <Image
              src={imageUrl}
              alt={`${title} sketch illustration`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              style={{
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Text Area */}
          <div
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
          >
            <div>
              {tags && tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                  {tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '8px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: '#B5502D',
                        backgroundColor: 'rgba(232, 232, 208, 0.55)', // translucent parchment acrylic
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        border: '1px solid rgba(27, 28, 28, 0.06)', // sub-pixel border
                        padding: '0.2rem 0.55rem',
                        display: 'inline-block',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#1b1c1c',
                  lineHeight: 1.3,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </h3>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
              }}
            >
              {date && (
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#747878',
                    fontWeight: 600,
                  }}
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
              <span
                style={{
                  fontSize: '1.15rem',
                  color: '#1b1c1c',
                  fontWeight: 'bold',
                }}
              >
                →
              </span>
            </div>
          </div>
        </div>

        {/* BACK SIDE (Dark Ink Card with Summary Description) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#1b1c1c',
            color: '#F5F5DC',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1.5px)', // pushes plane out
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem 1.75rem',
            border: '1px solid rgba(245, 245, 220, 0.15)', // sub-pixel frame
          }}
        >
          <div>
            {tags && tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '8px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: '#B5502D',
                      backgroundColor: 'rgba(255, 255, 255, 0.07)', // translucent dark acrylic
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      border: '1px solid rgba(245, 245, 220, 0.11)', // sub-pixel tag border
                      padding: '0.2rem 0.55rem',
                      display: 'inline-block',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#F5F5DC',
                lineHeight: 1.3,
                marginBottom: '1rem',
              }}
            >
              {title}
            </h3>
            {summary && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  color: '#e2e2c9',
                  opacity: 0.9,
                }}
              >
                {summary}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(245, 245, 220, 0.15)',
              paddingTop: '1.25rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#B5502D',
              }}
            >
              {url.includes('beehiiv') ? 'Read newsletter' : 'Read article'}
            </span>
            <span
              style={{
                fontSize: '1.25rem',
                color: '#B5502D',
                fontWeight: 'bold',
              }}
            >
              ↗
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={url} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      {cardContent}
    </Link>
  );
}
