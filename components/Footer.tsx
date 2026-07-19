'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();


  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: '#303031',
        color: '#f2f0f0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Wavy SVG divider at top */}
      <div aria-hidden="true" style={{ marginBottom: '-2px' }}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%' }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C60,10 120,50 180,30 C240,10 300,50 360,30 C420,10 480,50 540,30 C600,10 660,50 720,30 C780,10 840,50 900,30 C960,10 1020,50 1080,30 C1140,10 1200,50 1260,30 C1320,10 1380,50 1440,30 L1440,60 L0,60 Z"
            fill="#F5F5DC"
          />
          {/* Hand-drawn stroke overlay */}
          <path
            d="M0,28 C60,8 122,52 180,28 C240,8 302,52 360,28 C420,8 482,52 540,28 C600,8 662,52 720,28 C780,8 842,52 900,28 C960,8 1022,52 1080,28 C1140,8 1202,52 1260,28 C1320,8 1382,52 1440,28"
            stroke="#1b1c1c"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 2"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Footer content */}
      <div
        style={{
          padding: '4rem 5vw 3rem',
          position: 'relative',
        }}
      >
        {/* Large watermark */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '3vw',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '20vw',
            fontWeight: 700,
            color: 'rgba(242,240,240,0.05)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
            letterSpacing: '-0.04em',
          }}
        >
          DY
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Left: Name + tagline */}
          <div>
            <p
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#f2f0f0',
                marginBottom: '0.5rem',
              }}
            >
              Divy Yadav
            </p>
            <p
              style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: '0.85rem',
                color: 'rgba(242,240,240,0.5)',
                letterSpacing: '0.05em',
              }}
            >
              AI Engineer · Technical Writer · Solopreneur
            </p>
          </div>

          {/* Right: Links */}
          <nav aria-label="Footer navigation">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
              }}
            >
              {[
                { label: 'GitHub', href: 'https://github.com/dvy246' },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/divyyadav' },
                { label: 'Medium', href: 'https://medium.com/@divyyadav' },
                { label: 'Email', href: 'mailto:divyy2703@gmail.com' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(242,240,240,0.6)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 180ms ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#f2f0f0';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(242,240,240,0.6)';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: '1px solid rgba(242,240,240,0.08)',
            marginTop: '3rem',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '12px',
              color: 'rgba(242,240,240,0.35)',
              letterSpacing: '0.05em',
            }}
          >
            © {currentYear} Divy Yadav. Handcrafted.
          </p>
          <p
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '11px',
              color: 'rgba(242,240,240,0.25)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
