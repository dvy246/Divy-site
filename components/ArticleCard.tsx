'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface ArticleCardProps {
  title: string;
  url: string;
  date?: string;
  summary?: string;
  tags?: string[];
}

function getCardIllustration(title: string): string {
  const t = title.toLowerCase();
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

  const cardContent = (
    <div
      style={{
        perspective: '1000px',
        width: '100%',
        height: '380px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
          transform: hovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
          border: '1px solid #1b1c1c',
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
          }}
        >
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
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: '#B5502D',
                    marginBottom: '0.5rem',
                  }}
                >
                  {tags.slice(0, 2).join(' · ')}
                </p>
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
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem 1.75rem',
          }}
        >
          <div>
            {tags && tags.length > 0 && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#B5502D',
                  marginBottom: '1rem',
                }}
              >
                {tags.join(' · ')}
              </p>
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
    </div>
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
