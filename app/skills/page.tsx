'use client';

import { useEffect, useRef, useState } from 'react';
import { RoughNotation } from 'react-rough-notation';
import SketchDivider from '@/components/SketchDivider';
import skills from '@/data/skills.json';

function SkillCategory({
  category,
  skillList,
  index,
}: {
  category: string;
  skillList: { name: string; proficiency: string | null }[];
  index: number;
}) {
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShow(true), index * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2.5rem 2rem',
        backgroundColor: hovered ? 'rgba(245, 245, 220, 0.75)' : 'rgba(251, 249, 249, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: hovered ? '1px solid #B5502D' : '1px solid rgba(27, 28, 28, 0.15)',
        boxShadow: hovered
          ? '0 20px 45px rgba(27, 28, 28, 0.12), 0 0 30px rgba(181, 80, 45, 0.05)'
          : '0 4px 15px rgba(27, 28, 28, 0.02)',
        position: 'relative',
        overflow: 'hidden',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(35px)',
        transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1), background-color 350ms ease, border-color 350ms ease, box-shadow 350ms ease',
      }}
    >
      {/* Sheen reflection overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 70%)',
          transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: hovered ? 'transform 950ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
          fontWeight: 700,
          color: '#1b1c1c',
          marginBottom: '1.25rem',
          display: 'inline-block',
        }}
      >
        <RoughNotation
          type="underline"
          color="#B5502D"
          show={show}
          strokeWidth={2}
          animationDuration={400}
          animationDelay={index * 80}
        >
          {category}
        </RoughNotation>
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.975rem',
          lineHeight: 2.0,
          color: '#444748',
        }}
      >
        {skillList.map((skill, i) => (
          <span key={skill.name}>
            <span
              style={{
                color: skill.proficiency === 'advanced' ? '#1b1c1c' : '#545858',
                fontWeight: skill.proficiency === 'advanced' ? 600 : 400,
              }}
            >
              {skill.name}
            </span>
            {i < skillList.length - 1 && (
              <span style={{ color: 'rgba(181, 80, 45, 0.4)', margin: '0 0.6rem', userSelect: 'none' }}>/</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}

export default function SkillsPage() {
  const [showTitle, setShowTitle] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowTitle(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ paddingTop: '9rem', minHeight: '100vh', backgroundColor: '#F5F5DC' }}>
      {/* Header */}
      <header style={{ padding: '0 5vw 4rem' }}>
        <p className="label-caps" style={{ marginBottom: '1.25rem' }}>
          Capabilities
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            fontWeight: 700,
            color: '#1b1c1c',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            marginBottom: '1.75rem',
            display: 'inline-block',
          }}
        >
          <RoughNotation
            type="circle"
            color="#B5502D"
            show={showTitle}
            strokeWidth={2}
            animationDuration={600}
            padding={10}
          >
            Skills &amp; Tools
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
          A practitioner&apos;s stack built around production AI systems — from
          agentic frameworks to vector databases to cloud deployment.
        </p>
      </header>

      <SketchDivider />

      {/* Skills sections */}
      <section style={{ padding: '5rem 5vw 8rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
            gap: '2rem',
          }}
        >
          {skills.map((group, i) => (
            <SkillCategory
              key={group.category}
              category={group.category}
              skillList={group.skills}
              index={i}
            />
          ))}
        </div>

        {/* Note about proficiency */}
        <div
          style={{
            marginTop: '5rem',
            borderTop: '1px solid rgba(27,28,28,0.12)',
            paddingTop: '2rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: '#747878',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            <strong style={{ fontWeight: 600, color: '#1b1c1c' }}>Bold</strong> = Advanced proficiency ·{' '}
            Regular = Intermediate
          </p>
        </div>
      </section>
    </div>
  );
}
