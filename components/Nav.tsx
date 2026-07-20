'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Magnetic from '@/components/Magnetic';

const NAV_LINKS = [
  { label: 'Writing',    href: '/articles' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Skills',     href: '/skills' },
  { label: 'Portfolio',  href: 'https://drive.google.com/file/d/1Fz6aE8Ns_4n0R9QoC9sQN5l45MCYIyI6/view?usp=drive_link', isExternal: true },
  { label: 'Connect',    href: '/connect' },
];

export default function Nav() {
  const pathname          = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [visible, setVisible]     = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobile, setIsMobile]   = useState(false);
  const lastScrollY = useRef(0);

  /* Resize listener for responsive mobile checks */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const renderLink = (link: typeof NAV_LINKS[0]) => {
    const isActive = pathname === link.href ||
      (link.href !== '/' && pathname.startsWith(link.href));
    const showUnderline = hoveredLink === link.href || (!hoveredLink && isActive);

    return (
      <Magnetic range={36} strength={0.3} key={link.href}>
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setHoveredLink(link.href)}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <Link
            href={link.href}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            aria-current={isActive ? 'page' : undefined}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: isActive ? '#B5502D' : '#1b1c1c',
              textDecoration: 'none',
              paddingBottom: '6px',
              display: 'block',
              transition: 'color 200ms ease',
            }}
          >
            {link.label}
          </Link>

          {showUnderline && (
            <motion.svg
              layoutId="nav-underline"
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                width: '100%',
                height: '6px',
              }}
              viewBox="0 0 100 6"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 0,3 Q 25,1 50,3 T 100,3"
                fill="none"
                stroke="#B5502D"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.svg>
          )}
        </div>
      </Magnetic>
    );
  };

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
          padding: scrolled 
            ? '0.9rem 5vw' 
            : '1.6rem 5vw',
          transition:
            'background-color 450ms cubic-bezier(0.16,1,0.3,1), ' +
            'padding 450ms cubic-bezier(0.16,1,0.3,1), ' +
            'transform 350ms cubic-bezier(0.16,1,0.3,1), ' +
            'border-color 450ms ease, ' +
            'box-shadow 450ms ease',
          backgroundColor: scrolled
            ? (isMobile ? 'rgba(232, 232, 208, 0.97)' : 'rgba(232, 232, 208, 0.84)')
            : 'transparent',
          backdropFilter: scrolled && !isMobile
            ? 'blur(20px) saturate(1.2)' 
            : 'none',
          WebkitBackdropFilter: scrolled && !isMobile
            ? 'blur(20px) saturate(1.2)' 
            : 'none',
          borderTop: scrolled
            ? '1px solid rgba(255, 255, 255, 0.45)'
            : '1px solid transparent',
          borderBottom: scrolled
            ? '1px solid rgba(27, 28, 28, 0.12)'
            : '1px solid rgba(27, 28, 28, 0.02)',
          boxShadow: scrolled
            ? '0 12px 40px rgba(27, 28, 28, 0.05), 0 1px 0 rgba(27, 28, 28, 0.02)'
            : 'none',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* DESKTOP SPLIT NAV LAYOUT */}
        <div
          className="desktop-nav-split"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Left group of links */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', width: '38%' }}>
            {NAV_LINKS.slice(0, 3).map((link) => renderLink(link))}
          </div>

          {/* Center: Monogram */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '24%' }}>
            <Magnetic range={45} strength={0.35}>
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
                  display: 'block',
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
            </Magnetic>
          </div>

          {/* Right group of links */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', justifyContent: 'flex-end', width: '38%' }}>
            {NAV_LINKS.slice(3).map((link) => renderLink(link))}
          </div>
        </div>

        {/* MOBILE NAV LAYOUT */}
        <div
          className="mobile-nav"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
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

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="mobile-hamburger"
            style={{
              display: 'flex',
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
        </div>
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
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          padding: '2rem',
        }}
      >
        {NAV_LINKS.map((link, idx) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '2.2rem',
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
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-split { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
