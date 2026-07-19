'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Sparkles, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* === Animated lights coordinated with scroll === */
function AnimatedLights({ scrollParams }: { scrollParams: React.MutableRefObject<any> }) {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const params = scrollParams.current;

    if (pointLightRef.current) {
      // Orbit in a circle on X-Z plane with shifting heights
      pointLightRef.current.position.x = 6 * Math.sin(t * 0.45);
      pointLightRef.current.position.z = 6 * Math.cos(t * 0.45);
      pointLightRef.current.position.y = 4 + 2 * Math.sin(t * 0.25);
      pointLightRef.current.intensity = params.pointLightIntensity;
    }
    if (spotLightRef.current) {
      spotLightRef.current.position.x = 3 * Math.cos(t * 0.15);
      spotLightRef.current.intensity = params.spotLightIntensity;
    }
  });
  return (
    <>
      <ambientLight intensity={0.65} color="#FFF8F0" />
      <pointLight
        ref={pointLightRef}
        position={[6, 6, 6]}
        intensity={3.0}
        color="#FFF4E0"
        castShadow
        shadow-mapSize={512}
      />
      <pointLight position={[-4, -2, 4]} intensity={1.2} color="#F5F5DC" />
      <spotLight
        ref={spotLightRef}
        position={[0, 8, 2]}
        angle={0.35}
        penumbra={1}
        intensity={2.0}
        color="#ffffff"
        castShadow
      />
      {/* Accent rim light - Cool studio rim highlight for premium glass edges */}
      <pointLight
        position={[-6, 3, -4]}
        intensity={1.8}
        color="#D0E0FF"
      />
    </>
  );
}

/* === Main geometry + materials with dynamic morphing & responsive scaling === */
function FloatingGeometry({
  scrollParams,
  isMobile,
}: {
  scrollParams: React.MutableRefObject<any>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Material refs for dynamic morphing
  const materialRef = useRef<any>(null);

  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const prefersReducedMotion = useRef(false);

  // Drag inertia & momentum refs
  const isDragging = useRef(false);
  const pointerX = useRef(0);
  const pointerY = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });
  const idleTime = useRef(0);
  const springTime = useRef(0);

  const { viewport, gl } = useThree();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const onMouse = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      pointerX.current = e.clientX;
      pointerY.current = e.clientY;
      velocity.current = { x: 0, y: 0 };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - pointerX.current;
      const dy = e.clientY - pointerY.current;
      pointerX.current = e.clientX;
      pointerY.current = e.clientY;

      // Track drag velocities with momentum coefficients
      velocity.current.x = dx * 0.006;
      velocity.current.y = dy * 0.006;

      if (groupRef.current) {
        groupRef.current.rotation.y += velocity.current.x;
        groupRef.current.rotation.x += velocity.current.y;
      }
    };

    const onPointerUp = () => {
      isDragging.current = false;
      springTime.current = 0; // reset spring clock for overshoot on release
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    dom.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouse);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [gl]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    const params = scrollParams.current;

    // Smooth mouse parallax lerp
    mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;

    // Leaning reaction when mouse is near: subtly shift model focus to lean towards cursor
    const targetLeanX = mouse.current.y * 0.04;
    const targetLeanY = mouse.current.x * 0.04;

    // Track scroll-based translation from left to right (from 0 to 1.7)
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const scrollFraction = Math.min(1.0, Math.max(0.0, scrollY / (vh * 0.85)));
    // Calculate dynamic targets: off-center on desktop, offset down on mobile to prevent overlapping typography
    const targetX = THREE.MathUtils.lerp(isMobile ? 0 : 1.45, isMobile ? 0.0 : 2.2, scrollFraction);
    const targetY = THREE.MathUtils.lerp(isMobile ? -1.25 : -0.1, isMobile ? -1.85 : -0.4, scrollFraction);
    const targetZ = THREE.MathUtils.lerp(isMobile ? -0.8 : -0.5, isMobile ? -1.5 : -1.3, scrollFraction);

    // Smoothly interpolate targets to prevent scroll stutter
    params.x = THREE.MathUtils.lerp(params.x, targetX, 0.08);
    params.y = THREE.MathUtils.lerp(params.y, targetY, 0.08);
    params.z = THREE.MathUtils.lerp(params.z, targetZ, 0.08);

    // 1. Inertial rotation decay & drag physics
    if (!prefersReducedMotion.current) {
      if (!isDragging.current) {
        springTime.current += delta;

        // Friction damping decay
        velocity.current.x *= 0.94;
        velocity.current.y *= 0.94;

        // Apply spin velocity
        groupRef.current.rotation.y += velocity.current.x;
        groupRef.current.rotation.x += velocity.current.y;

        // Spring pull stabilization back to rest state when spin slows down
        const currentSpeed = Math.sqrt(
          velocity.current.x * velocity.current.x + velocity.current.y * velocity.current.y
        );
        if (currentSpeed < 0.002) {
          idleTime.current += delta;
          const targetRestX = Math.sin(idleTime.current * 0.3) * 0.06 + params.rotationSpeedX * idleTime.current + targetLeanX;
          const targetRestY = Math.cos(idleTime.current * 0.25) * 0.06 + params.rotationSpeedY * idleTime.current + targetLeanY;

          // Damped spring overshoot bounce oscillation on release
          const springOscillate = Math.sin(springTime.current * 6.5) * Math.exp(-springTime.current * 1.6) * 0.25;

          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRestX, 0.015) + springOscillate * 0.12;
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRestY, 0.015) + springOscillate * 0.16;
        }
      }
      groupRef.current.rotation.z += delta * params.rotationSpeedZ;
    }

    // Smoothly interpolate position and scale (continuous transition choreography)
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, params.x, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, params.y, 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, params.z, 0.06);

    // 2. Responsive Scaling based on aspect ratios
    // If viewport is in portrait mode (aspect < 1), scale down shape so it fits nicely
    const aspect = viewport.aspect;
    const responsiveScaleFactor = aspect < 1 ? Math.max(0.45, aspect * 0.95) : 1.0;
    const targetScale = params.scale * responsiveScaleFactor;
    
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    // Living Material color and surface properties evolution:
    // Evolve gold-to-champagne colors dynamically via low-frequency sine oscillations
    const elapsed = _state.clock.getElapsedTime();
    let finalColor = new THREE.Color(params.color);
    if (params.color === '#dfb46c') {
      const wave = Math.sin(elapsed * 0.05) * 0.5 + 0.5; // slow 125s cycle
      const baseGold = new THREE.Color('#dfb46c'); // warm gold
      const champagneIvory = new THREE.Color('#ebd8be'); // champagne ivory
      const softCopper = new THREE.Color('#d4af37'); // bright gold/copper highlights
      if (wave < 0.5) {
        finalColor.lerpColors(baseGold, champagneIvory, wave * 2);
      } else {
        finalColor.lerpColors(champagneIvory, softCopper, (wave - 0.5) * 2);
      }
    }

    // Microscopic physical material breathing dynamics
    const livingRoughness = params.roughness + Math.sin(elapsed * 0.12) * 0.012;
    const livingTransmission = params.transmission + Math.cos(elapsed * 0.08) * 0.03;

    // 3. Dynamic Morphing of mesh material parameters directly on the GPU thread (highly performant!)
    if (materialRef.current) {
      materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, livingRoughness, 0.08);
      materialRef.current.transmission = THREE.MathUtils.lerp(materialRef.current.transmission, livingTransmission, 0.08);
      if (params.color) {
        materialRef.current.color.lerp(finalColor, 0.08);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Core Torus Knot (Refractive Glass Core) */}
        <mesh castShadow>
          {/* Lower geometry details on mobile for performance tuning */}
          <torusKnotGeometry args={isMobile ? [1, 0.22, 128, 24] : [1, 0.22, 256, 48]} />
          <MeshTransmissionMaterial
            ref={materialRef}
            color="#faf8f5"
            roughness={0.06}
            transmission={0.96}
            thickness={0.65}
            ior={1.25}
            chromaticAberration={0.005}
            anisotropicBlur={0.25}
            distortion={0.02}
            distortionScale={0.05}
            temporalDistortion={0.0}
            samples={isMobile ? 4 : 8}
            transparent
          />
        </mesh>
      </Float>
    </group>
  );
}

/* === Camera coordinates coordinator component === */
function CameraController({ scrollParams }: { scrollParams: React.MutableRefObject<any> }) {
  const { camera } = useThree();

  useFrame(() => {
    const params = scrollParams.current;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, params.cameraZ, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, params.cameraY, 0.06);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, params.cameraX, 0.06);
  });

  return null;
}

/* === Canvas export === */
export default function HeroCanvas({ isMobile = false }: { isMobile?: boolean }) {
  // Check if page was loaded scrolled down to skip entry sequence
  const hasScrolledOnLoad = typeof window !== 'undefined' && window.scrollY > 50;
  // Shared ref holding morphable 3D parameters
  const scrollParams = useRef({
    // Initial State: start offset to the right side of the screen
    x: isMobile ? 0 : 1.45,
    y: isMobile ? -1.25 : -0.1,
    z: isMobile ? -0.8 : -0.5,
    rotationSpeedX: 0.012, // extremely slow, premium watch movement feel
    rotationSpeedY: 0.018,
    rotationSpeedZ: 0.0,
    scale: hasScrolledOnLoad ? (isMobile ? 0.55 : 0.85) : 0.001,
    color: '#faf8f5',

    roughness: 0.06,
    transmission: hasScrolledOnLoad ? 0.96 : 1.0,

    cameraZ: 4.8,
    cameraY: 0.0,
    cameraX: 0.0,
    pointLightIntensity: 3.0,
    spotLightIntensity: 2.0,
  });

  // Setup GSAP entry reveal animation
  useEffect(() => {
    let active = true;
    let revealTween: any = null;

    const initGSAP = async () => {
      const { default: gsap } = await import('gsap');
      if (!active) return;

      // Reveal animation emerging from portrait (0.8s delay)
      if (!hasScrolledOnLoad) {
        revealTween = gsap.to(scrollParams.current, {
          scale: isMobile ? 0.55 : 0.85,
          transmission: 0.96,
          duration: 2.2,
          delay: 0.8,
          ease: 'power3.out',
          onStart: () => {
            window.dispatchEvent(new CustomEvent('dy_sculpture_reveal_start'));
          },
          onComplete: () => {
            window.dispatchEvent(new CustomEvent('dy_sculpture_reveal_complete'));
          }
        });
      }
    };

    initGSAP();

    return () => {
      active = false;
      if (revealTween) revealTween.kill();
    };
  }, [isMobile]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100svh',
        pointerEvents: 'none',
        zIndex: 1, // Behind page content but in front of background grid
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 46 }}
        gl={{
          antialias: !isMobile, // Disable antialiasing on mobile for a massive fill-rate performance boost
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        dpr={isMobile ? 1.0 : [1, 1.5]} // Cap DPR at 1.0 on mobile, 1.5 on desktop
        shadows={!isMobile} // Disable shadows on mobile to preserve GPU fragment shader pipeline
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          touchAction: 'pan-y', // Let mobile touch vertical scrolls slide natively, horizontal drags rotate WebGL
          pointerEvents: 'auto',
        }}
      >
        <CameraController scrollParams={scrollParams} />

        <AnimatedLights scrollParams={scrollParams} />
        {/* Ambient background rim light matching terracotta */}
        <directionalLight position={[0, 4, -5]} intensity={0.6} color="#B5502D" />

        {/* Studio HDRI environment for reflections */}
        <Environment preset="studio" />

        <FloatingGeometry scrollParams={scrollParams} isMobile={isMobile} />

        {/* Cinematic drop contact shadow plane to anchor sculpture in physical space */}
        <ContactShadows
          position={[isMobile ? 0 : 1.8, -1.8, 0]}
          opacity={0.4}
          scale={6.0}
          blur={2.5}
          far={4.0}
        />

      </Canvas>
    </div>
  );
}
