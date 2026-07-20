'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import { RoughNotation } from 'react-rough-notation';

type Platform = 'email' | 'linkedin';

export default function ConnectPage() {
  const [stage, setStage] = useState<'select' | 'handshake'>('select');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showUnderline, setShowUnderline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUnderline(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (choice: Platform) => {
    setPlatform(choice);
    setStage('handshake');
    setLogs([]);

    const emailSteps = [
      'Initializing secure SMTP/cryptographic wrapper...',
      'Generating ephemeral PGP encryption keys...',
      'Performing handshakes with peer mail provider...',
      'Encrypting mail client session headers...',
      'Handshake complete. Directing to mail application.'
    ];

    const linkedinSteps = [
      'Establishing OAuth2 socket connection...',
      'Resolving domain identity: linkedin.com/in/divyyadav...',
      'Securing SSL handshake with remote target...',
      'Exchanging handshake tokens (verified profile)...',
      'Redirecting session tunnel to professional profile.'
    ];

    const steps = choice === 'email' ? emailSteps : linkedinSteps;

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            if (choice === 'email') {
              const user = 'yadavdivy77';
              const domain = 'gmail.com';
              window.location.href = `mailto:${user}@${domain}?subject=Secure Connection from Portfolio`;
            } else {
              window.open('https://www.linkedin.com/in/divyyadav/', '_blank');
            }
          }, 800);
        }
      }, idx * 400);
    });
  };

  const handleReset = () => {
    setStage('select');
    setPlatform(null);
    setLogs([]);
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

      <div style={{ width: '100%', maxWidth: '640px', zIndex: 10 }}>
        {/* Header */}
        <header style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <p
            className="label-caps"
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              fontWeight: 700,
              color: '#B5502D',
              marginBottom: '1rem',
            }}
          >
            {stage === 'select' ? 'CHOOSE GATEWAY PROTOCOL' : 'TUNNEL HANDSHAKE ACTIVE'}
          </p>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.2rem, 5.5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            <RoughNotation
              type="underline"
              color="#B5502D"
              show={showUnderline}
              strokeWidth={3}
              animationDuration={855}
            >
              {stage === 'select' ? 'Connect gateway' : 'Establishing link'}
            </RoughNotation>
          </h1>
        </header>

        <AnimatePresence mode="wait">
          {stage === 'select' ? (
            <motion.div
              key="select-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                width: '100%',
              }}
            >
              {/* Option 1: Email */}
              <Magnetic range={40} strength={0.25}>
                <button
                  onClick={() => handleSelect('email')}
                  style={{
                    backgroundColor: 'rgba(251, 249, 249, 0.45)',
                    border: '1px solid rgba(27, 28, 28, 0.15)',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    transition: 'border-color 300ms ease, background-color 300ms ease, box-shadow 300ms ease',
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                  }}
                  className="hover-card-border"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = '#B5502D';
                    el.style.backgroundColor = 'rgba(245, 245, 220, 0.75)';
                    el.style.boxShadow = '0 15px 35px rgba(27, 28, 28, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(27, 28, 28, 0.15)';
                    el.style.backgroundColor = 'rgba(251, 249, 249, 0.45)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Dash design guide */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '8px',
                      border: '1px dashed rgba(181, 80, 45, 0.25)',
                      pointerEvents: 'none',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#B5502D',
                      fontWeight: 700,
                    }}
                  >
                    01 / GATEWAY
                  </span>
                  <h2
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#1b1c1c',
                    }}
                  >
                    Direct Email
                  </h2>
                  <div
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '11px',
                      color: '#747878',
                      direction: 'rtl',
                      unicodeBidi: 'bidi-override',
                    }}
                  >
                    moc.liamg@77yviddyaday
                  </div>
                </button>
              </Magnetic>

              {/* Option 2: LinkedIn */}
              <Magnetic range={40} strength={0.25}>
                <button
                  onClick={() => handleSelect('linkedin')}
                  style={{
                    backgroundColor: 'rgba(251, 249, 249, 0.45)',
                    border: '1px solid rgba(27, 28, 28, 0.15)',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    transition: 'border-color 300ms ease, background-color 300ms ease, box-shadow 300ms ease',
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                  }}
                  className="hover-card-border"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = '#B5502D';
                    el.style.backgroundColor = 'rgba(245, 245, 220, 0.75)';
                    el.style.boxShadow = '0 15px 35px rgba(27, 28, 28, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(27, 28, 28, 0.15)';
                    el.style.backgroundColor = 'rgba(251, 249, 249, 0.45)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Dash design guide */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '8px',
                      border: '1px dashed rgba(181, 80, 45, 0.25)',
                      pointerEvents: 'none',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#B5502D',
                      fontWeight: 700,
                    }}
                  >
                    02 / GATEWAY
                  </span>
                  <h2
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#1b1c1c',
                    }}
                  >
                    LinkedIn Profile
                  </h2>
                  <div
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '11px',
                      color: '#747878',
                    }}
                  >
                    linkedin.com/in/divyyadav
                  </div>
                </button>
              </Magnetic>
            </motion.div>
          ) : (
            <motion.div
              key="handshake-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
              {/* Tunnel Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px dashed rgba(27, 28, 28, 0.15)',
                  paddingBottom: '1.5rem',
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '9px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#747878',
                      fontWeight: 600,
                    }}
                  >
                    Active tunnel
                  </span>
                  <h2
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#1b1c1c',
                      marginTop: '0.25rem',
                    }}
                  >
                    {platform === 'email' ? 'Secure SMTP client' : 'LinkedIn OAuth wrapper'}
                  </h2>
                </div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#B5502D',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              </div>

              {/* Handshake status logs */}
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
                {logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      color: idx === logs.length - 1 && logs.length < 5 ? '#B5502D' : '#1b1c1c'
                    }}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>

              {/* Console control options */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                <Magnetic range={30} strength={0.3}>
                  <button
                    onClick={handleReset}
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: '#1b1c1c',
                      backgroundColor: 'transparent',
                      border: '1px solid #1b1c1c',
                      padding: '0.75rem 1.5rem',
                      cursor: 'pointer',
                      transition: 'background-color 200ms ease, color 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1b1c1c';
                      e.currentTarget.style.color = '#F5F5DC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#1b1c1c';
                    }}
                  >
                    Disconnect
                  </button>
                </Magnetic>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}
