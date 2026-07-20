'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import { RoughNotation } from 'react-rough-notation';

export default function ConnectPage() {
  const [status, setStatus] = useState<'idle' | 'handshake' | 'connected'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [showUnderline, setShowUnderline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUnderline(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const triggerHandshake = () => {
    if (status !== 'idle') return;
    setStatus('handshake');
    
    const steps = [
      'Initializing secure connection protocol...',
      'Generating transient cryptographic keypair...',
      'Verifying peer endpoint validity...',
      'Performing handshake key exchange...',
      'Establishing end-to-end secure mail wrapper...',
      'Handshake complete. Launching default client.'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            // Secure obfuscated email assembly
            const user = 'yadavdivy77';
            const domain = 'gmail.com';
            window.location.href = `mailto:${user}@${domain}?subject=Secure Connection from Portfolio`;
            setStatus('connected');
          }, 800);
        }
      }, idx * 350);
    });
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5DC',
        color: '#1b1c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 5vw 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background technical guidelines */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '5vw',
          border: '1px solid rgba(27,28,28,0.06)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          zIndex: 10,
        }}
      >
        {/* Title */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p
            className="label-caps"
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              fontWeight: 700,
              color: '#B5502D',
              marginBottom: '1rem',
            }}
          >
            Communication Tunnel
          </p>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            <RoughNotation
              type="underline"
              color="#B5502D"
              show={showUnderline}
              strokeWidth={3}
              animationDuration={800}
            >
              Secure Connect
            </RoughNotation>
          </h1>
        </header>

        {/* Console Box */}
        <section
          style={{
            border: '1px solid #1b1c1c',
            backgroundColor: 'rgba(251, 249, 249, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {/* Obfuscated visual email representation to prevent scraper parsing */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px dashed rgba(27, 28, 28, 0.15)',
              paddingBottom: '2rem',
            }}
          >
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#747878',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              Target Endpoint
            </span>
            <div
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                fontWeight: 600,
                color: '#1b1c1c',
                direction: 'rtl',
                unicodeBidi: 'bidi-override',
                cursor: 'default',
              }}
              title="Obfuscated to prevent automated spam harvesting"
            >
              moc.liamg@77yviddyaday
            </div>
          </div>

          <div
            style={{
              minHeight: '130px',
              fontFamily: 'monospace',
              fontSize: '11.5px',
              color: '#444748',
              lineHeight: 1.6,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <div style={{ color: '#747878' }}>
              // Secure Handshake Console Logs:
            </div>
            {logs.length === 0 && (
              <div style={{ color: '#B5502D' }}>
                &gt; Awaiting connection initiation.
              </div>
            )}
            <AnimatePresence>
              {logs.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: idx === logs.length - 1 && status !== 'connected' ? '#B5502D' : '#1b1c1c'
                  }}
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Trigger button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Magnetic range={45} strength={0.3}>
              <button
                onClick={triggerHandshake}
                disabled={status !== 'idle'}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#F5F5DC',
                  backgroundColor: status === 'connected' ? '#B5502D' : '#1b1c1c',
                  border: 'none',
                  padding: '1.1rem 2.2rem',
                  cursor: status === 'idle' ? 'pointer' : 'default',
                  opacity: status === 'handshake' ? 0.75 : 1,
                  transition: 'background-color 200ms ease, opacity 200ms ease',
                  width: '100%',
                }}
              >
                {status === 'idle' && 'Initialize Secure Connection →'}
                {status === 'handshake' && 'Exchanging cryptographic keys...'}
                {status === 'connected' && 'Mail Client Launched'}
              </button>
            </Magnetic>
          </div>
        </section>
      </div>
    </main>
  );
}
