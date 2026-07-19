import Link from 'next/link';

export interface ArticleCardProps {
  title: string;
  url: string;
  date?: string;
  summary?: string;
  tags?: string[];
  featured?: boolean;
}

export default function ArticleCard({
  title,
  url,
  date,
  summary,
  tags,
}: ArticleCardProps) {
  const isExternal = url.startsWith('http');

  const content = (
    <div
      className="article-card"
      style={{ height: '100%', minHeight: '220px' }}
    >
      {/* Tag row */}
      {tags && tags.length > 0 && (
        <p
          className="card-tag"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: '#B5502D',
            marginBottom: '1rem',
            transition: 'color 300ms ease',
          }}
        >
          {tags.join(' · ')}
        </p>
      )}

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
          fontWeight: 700,
          color: 'inherit',
          lineHeight: 1.25,
          marginBottom: '0.85rem',
          transition: 'color 300ms ease',
        }}
      >
        {title}
      </h3>

      {/* Summary */}
      {summary && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            lineHeight: 1.7,
            color: 'inherit',
            opacity: 0.65,
            marginBottom: '1.5rem',
            transition: 'opacity 300ms ease',
          }}
        >
          {summary.length > 120 ? summary.slice(0, 120) + '…' : summary}
        </p>
      )}

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
        }}
      >
        {date && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'inherit',
              opacity: 0.4,
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
          className="card-arrow"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            color: 'inherit',
            marginLeft: 'auto',
          }}
        >
          ↗
        </span>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={url} style={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}>
      {content}
    </Link>
  );
}
