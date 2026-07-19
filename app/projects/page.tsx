'use client';

import { useEffect, useState } from 'react';
import { RoughNotation } from 'react-rough-notation';
import SketchDivider from '@/components/SketchDivider';
import projects from '@/data/projects.json';

export default function ProjectsPage() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShow(true), 500);

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        '.project-grid-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 82%',
          },
        }
      );
    };
    initGSAP();

    return () => clearTimeout(timer);
  }, []);

  const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  if (!mounted) return null;

  return (
    <div style={{ paddingTop: '9rem', minHeight: '100vh', backgroundColor: '#F5F5DC' }}>
      {/* Header */}
      <header style={{ padding: '0 5vw 4rem' }}>
        <p className="label-caps" style={{ marginBottom: '1.25rem' }}>
          Work
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
            Projects
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
          Agentic AI systems, RAG pipelines, and open-source contributions.
          Built with Python, LangChain, Agno, FastAPI, and production intent.
        </p>
      </header>

      <SketchDivider />

      {/* Projects grid */}
      <section
        className="projects-grid"
        style={{ padding: '5rem 5vw 8rem' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
            gap: '1px',
            backgroundColor: '#1b1c1c',
            border: '1px solid #1b1c1c',
          }}
        >
          {sorted.map((project) => (
            <article
              key={project.title}
              className="project-grid-card"
              style={{
                padding: '2.25rem 2rem',
                backgroundColor: '#fbf9f9',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'background-color 300ms cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5DC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fbf9f9';
              }}
            >
              {/* Featured Badge */}
              {project.featured && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '9px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: '#B5502D',
                      border: '1px solid #B5502D',
                      padding: '2px 8px',
                    }}
                  >
                    Featured
                  </span>
                </div>
              )}

              {/* Category */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#747878',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                }}
              >
                {project.category}
              </p>

              {/* Title */}
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                  fontWeight: 700,
                  color: '#1b1c1c',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                {project.title}
              </h2>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  color: '#444748',
                  marginBottom: '1.75rem',
                }}
              >
                {project.description}
              </p>

              {/* Tags */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.35rem',
                  marginBottom: '2rem',
                  marginTop: 'auto',
                }}
              >
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      letterSpacing: '0.05em',
                      color: '#1b1c1c',
                      border: '1px solid rgba(27,28,28,0.15)',
                      padding: '2px 8px',
                      fontWeight: 500,
                      backgroundColor: '#E8E8D0',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {project.github !== null && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-magnetic"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: '#1b1c1c',
                      textDecoration: 'none',
                      border: '1px solid #1b1c1c',
                      padding: '0.6rem 1.4rem',
                      transition: 'background-color 160ms ease, color 160ms ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.backgroundColor = '#1b1c1c';
                      el.style.color = '#F5F5DC';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.backgroundColor = 'transparent';
                      el.style.color = '#1b1c1c';
                    }}
                  >
                    GitHub
                  </a>
                )}
                {project.demo !== null && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-magnetic"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: '#F5F5DC',
                      backgroundColor: '#B5502D',
                      border: '1px solid #B5502D',
                      textDecoration: 'none',
                      padding: '0.6rem 1.4rem',
                      transition: 'background-color 160ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1b1c1c';
                      e.currentTarget.style.borderColor = '#1b1c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#B5502D';
                      e.currentTarget.style.borderColor = '#B5502D';
                    }}
                  >
                    Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
