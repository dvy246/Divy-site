'use client';

import { useEffect, useState } from 'react';
import { RoughNotation } from 'react-rough-notation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SketchDivider from '@/components/SketchDivider';
import ScrollReveal3D from '@/components/ScrollReveal3D';
import Magnetic from '@/components/Magnetic';
import projects from '@/data/projects.json';

interface ProjectType {
  title: string;
  category: string;
  description: string;
  tags: string[];
  github: string | null;
  demo: string | null;
  featured: boolean;
}

function ProjectCard({ project }: { project: ProjectType }) {
  const [hovered, setHovered] = useState(false);

  // Mouse hover springs for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 140, damping: 18, mass: 0.35 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Map mouse coordinates to subtle rotation angles (max 6 degrees)
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  // Dynamic light sheen position tracking cursor
  const sheenBg = useTransform(
    [springX, springY],
    ([mx, my]) => `radial-gradient(circle at ${(mx as number + 0.5) * 100}% ${(my as number + 0.5) * 100}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
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

  return (
    <motion.article
      className="project-grid-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="view"
      style={{
        padding: '2.25rem 2rem',
        backgroundColor: hovered ? 'rgba(245, 245, 220, 0.75)' : 'rgba(251, 249, 249, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        border: hovered ? '1px solid #B5502D' : '1px solid rgba(27, 28, 28, 0.15)',
        boxShadow: hovered
          ? '0 25px 50px rgba(27, 28, 28, 0.14), 0 0 35px rgba(181, 80, 45, 0.08)'
          : '0 4px 15px rgba(27, 28, 28, 0.02)',
        rotateX: rotateX,
        rotateY: rotateY,
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'background-color 350ms ease, border-color 350ms ease, box-shadow 350ms ease',
        height: '100%',
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

      {/* Featured Badge */}
      <div
        style={{
          transform: 'translateZ(30px)',
          transformStyle: 'preserve-3d',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: project.featured ? '#B5502D' : '#747878',
              border: project.featured ? '1px solid #B5502D' : '1px solid rgba(27, 28, 28, 0.15)',
              padding: '2px 8px',
            }}
          >
            {project.featured ? 'Featured' : 'Project'}
          </span>
        </div>
      </div>

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
          transform: 'translateZ(35px)',
        }}
      >
        {project.category}
      </p>

      {/* Title & Description Area */}
      <div
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
          marginBottom: '1.75rem',
        }}
      >
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

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            color: '#444748',
            margin: 0,
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          marginBottom: '2rem',
          marginTop: 'auto',
          transform: 'translateZ(40px)',
          transformStyle: 'preserve-3d',
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
              border: '1px solid rgba(27, 28, 28, 0.15)',
              padding: '2px 8px',
              fontWeight: 500,
              backgroundColor: '#E8E8D0',
              display: 'inline-block',
            }}
          >
             {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          zIndex: 20,
          transform: 'translateZ(60px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {project.github !== null && (
          <Magnetic range={36} strength={0.3}>
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
                display: 'block',
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
          </Magnetic>
        )}
        {project.demo !== null && (
          <Magnetic range={36} strength={0.3}>
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
                display: 'block',
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
          </Magnetic>
        )}
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShow(true), 500);
    let ctx: any;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          '.project-grid-card',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.projects-grid',
              start: 'top 82%',
            },
          }
        );
      });
    };
    initGSAP();

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
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
        style={{ padding: '5rem 5vw 8rem', overflow: 'visible' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
            gap: '2.5rem',
            overflow: 'visible',
          }}
        >
          {sorted.map((project, idx) => (
            <div key={project.title} className="project-grid-wrapper" style={{ overflow: 'visible' }}>
              <ScrollReveal3D delay={idx * 0.06}>
                <ProjectCard project={project} />
              </ScrollReveal3D>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
