'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { label: 'Writing',    href: '/articles' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Skills',     href: '/skills' },
];

export default function Nav() {
  const pathname          = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [visible, setVisible]     = useState(true);
  const lastScrollY = useRef(0);

  /* Scroll: show/hide + frosted glass transition */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setVisible(y < lastScrollY.current || y < 80);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  /* Lock body when menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Nav bar ───────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 5vw',
          transition:
            'background 400ms cubic-bezier(0.16,1,0.3,1), ' +
            'transform 350ms cubic-bezier(0.16,1,0.3,1), ' +
            'border-color 400ms ease',
          backgroundColor: scrolled
            ? 'rgba(245,245,220,0.88)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(1.4)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(27,28,28,0.1)'
            : '1px solid transparent',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* Monogram */}
        <Link
          href="/"
          aria-label="Divy Yadav — home"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '26px',
            fontWeight: 700,
            color: '#1b1c1c',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            transition: 'color 200ms ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = '#B5502D';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = '#1b1c1c';
          }}
        >
          DY
        </Link>

        {/* Desktop links */}
        <div
          className="desktop-nav"
          style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: isActive ? '#B5502D' : '#1b1c1c',
                  textDecoration: 'none',
                  paddingBottom: '2px',
                  borderBottom: isActive
                    ? '1px solid #B5502D'
                    : '1px solid transparent',
                  transition: 'color 160ms ease, border-color 160ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#B5502D';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#B5502D';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#1b1c1c';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* CTA button */}
          <a
            href="https://aiengineering.beehiiv.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#F5F5DC',
              backgroundColor: '#1b1c1c',
              textDecoration: 'none',
              padding: '0.55rem 1.1rem',
              transition: 'background-color 160ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#B5502D';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1b1c1c';
            }}
          >
            Newsletter
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="mobile-hamburger"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                backgroundColor: '#1b1c1c',
                transition: 'transform 200ms ease, opacity 200ms ease',
                transform:
                  i === 0 && menuOpen ? 'translateY(6.5px) rotate(45deg)' :
                  i === 2 && menuOpen ? 'translateY(-6.5px) rotate(-45deg)' :
                  'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* ── Mobile fullscreen menu ─────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          backgroundColor: '#F5F5DC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2.5rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 350ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {NAV_LINKS.map((link, idx) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              fontWeight: 700,
              fontStyle: pathname === link.href ? 'italic' : 'normal',
              color: pathname === link.href ? '#B5502D' : '#1b1c1c',
              textDecoration: 'none',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 400ms ease ${idx * 60}ms, transform 400ms cubic-bezier(0.16,1,0.3,1) ${idx * 60}ms`,
            }}
          >
            {link.label}
          </Link>
        ))}

        <a
          href="https://aiengineering.beehiiv.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: '#F5F5DC',
            backgroundColor: '#1b1c1c',
            textDecoration: 'none',
            padding: '1rem 2.5rem',
            marginTop: '1rem',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 400ms ease ${NAV_LINKS.length * 60}ms, transform 400ms ease ${NAV_LINKS.length * 60}ms`,
          }}
        >
          Subscribe Free →
        </a>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
