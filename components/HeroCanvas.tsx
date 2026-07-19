'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* === Animated lights coordinated with clock === */
function AnimatedLights() {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (pointLightRef.current) {
      // Orbit in a circle on X-Z plane with shifting heights
      pointLightRef.current.position.x = 6 * Math.sin(t * 0.45);
      pointLightRef.current.position.z = 6 * Math.cos(t * 0.45);
      pointLightRef.current.position.y = 4 + 2 * Math.sin(t * 0.25);
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
      />
      <pointLight position={[-4, -2, 4]} intensity={1.2} color="#F5F5DC" />
      <spotLight
        ref={spotLightRef}
        position={[0, 8, 2]}
        angle={0.35}
        penumbra={1}
        intensity={2.0}
        color="#ffffff"
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

/* === Background Set Dressing (Terracotta Graphic Disk) === */
function SetDressing({ baseX, baseY, baseZ, isMobile }: { baseX: number; baseY: number; baseZ: number; isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Slow organic drift matching the drop but out of phase
    const elapsed = state.clock.getElapsedTime();
    meshRef.current.position.x = baseX - 0.2 + Math.sin(elapsed * 0.4) * 0.06;
    meshRef.current.position.y = baseY - 0.2 + Math.cos(elapsed * 0.5) * 0.06;
  });

  return (
    <mesh ref={meshRef} position={[baseX - 0.2, baseY - 0.2, baseZ - 1.2]} scale={isMobile ? 0.8 : 1.25}>
      <ringGeometry args={[0, 0.75, 64]} />
      <meshBasicMaterial color="#B5502D" transparent opacity={0.14} depthWrite={false} />
    </mesh>
  );
}

interface AccentProps {
  baseX: number;
  baseY: number;
  baseZ: number;
  scale: [number, number, number];
  parallax: number;
  floatSpeed: number;
  floatAmp: number;
  rotSpeed: [number, number, number];
  isMobile: boolean;
  mouseRef: React.MutableRefObject<{ x: number; y: number; tx: number; ty: number }>;
}

/* === Individual Accent Element Component (Faceted Glass Gem) === */
function AccentElement({
  baseX,
  baseY,
  baseZ,
  scale,
  parallax,
  floatSpeed,
  floatAmp,
  rotSpeed,
  isMobile,
  mouseRef,
}: AccentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const timeOffset = useRef(Math.random() * 100);
  const currentScaleFactor = useRef(0.001);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Calculate scroll parallax
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const scrollOffset = (scrollY / winHeight) * state.viewport.height;

    // 2. Lissajous organic float drift (multi-frequency curves for fluid non-repeating paths)
    const elapsed = state.clock.getElapsedTime() + timeOffset.current;
    const floatY = Math.sin(elapsed * floatSpeed) * floatAmp + Math.cos(elapsed * floatSpeed * 0.45) * (floatAmp * 0.4);
    const floatX = Math.cos(elapsed * floatSpeed * 0.85) * floatAmp + Math.sin(elapsed * floatSpeed * 0.35) * (floatAmp * 0.4);

    // 3. Proximity Interactive Reaction (warp & scale when cursor gets close)
    let proximityScale = 1.0;
    let proximityRoughness = 0.02;
    let proximityThickness = isMobile ? 0.7 : 1.5;

    if (!isMobile && mouseRef.current) {
      // Projected mouse coordinates at the depth of the element
      const mouseX3D = mouseRef.current.x * state.viewport.width * 0.5;
      const mouseY3D = mouseRef.current.y * state.viewport.height * 0.5;

      const dx = meshRef.current.position.x - mouseX3D;
      const dy = meshRef.current.position.y - mouseY3D;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Reaction radius of 2.2 units in 3D space
      if (dist < 2.2) {
        const influence = Math.max(0, 1 - dist / 2.2); // 0 to 1
        proximityScale = 1.0 + influence * 0.22; // scale up by up to 22%
        proximityRoughness = THREE.MathUtils.lerp(proximityRoughness, 0.002, influence); // polish surface completely
        proximityThickness = THREE.MathUtils.lerp(1.5, 2.2, influence); // magnify glass thickness
        
        // Add subtle tilt/attraction towards mouse
        meshRef.current.rotation.x += dx * influence * 0.012;
        meshRef.current.rotation.y += dy * influence * 0.012;
      }
    }

    // Interpolate target positions (scrolling up relative to camera)
    const targetY = baseY + scrollOffset * parallax + floatY;
    const targetX = baseX + floatX;

    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, baseZ, 0.08);

    // 4. Calm constant rotation
    meshRef.current.rotation.x += delta * rotSpeed[0] * 0.25;
    meshRef.current.rotation.y += delta * rotSpeed[1] * 0.25;
    meshRef.current.rotation.z += delta * rotSpeed[2] * 0.25;

    // 5. Entrance bloom scale + hover scale factor
    currentScaleFactor.current = THREE.MathUtils.lerp(currentScaleFactor.current, 1.0, 0.04);
    
    meshRef.current.scale.set(
      scale[0] * currentScaleFactor.current * proximityScale,
      scale[1] * currentScaleFactor.current * proximityScale,
      scale[2] * currentScaleFactor.current * proximityScale
    );

    // Update material properties dynamically on GPU thread
    if (materialRef.current) {
      materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, proximityRoughness, 0.08);
      materialRef.current.thickness = THREE.MathUtils.lerp(materialRef.current.thickness, proximityThickness, 0.08);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.25}>
      <mesh
        ref={meshRef}
        castShadow={false}
      >
        <icosahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          ref={materialRef}
          color="#FFFBF2"
          roughness={0.02} // Super polished look
          transmission={0.93} // Blend refraction and diffuse champagne-warm background tint
          thickness={isMobile ? 0.7 : 1.5} // Thinner on mobile for faster render passes
          ior={1.45} // Higher refraction index for crystal/gem facets
          chromaticAberration={isMobile ? 0.005 : 0.03} // Gorgeous color separation at sharp facets
          anisotropicBlur={isMobile ? 0.0 : 0.15}
          distortion={0.0} // Clean geometric facets, no organic liquid distortion
          distortionScale={0.0}
          temporalDistortion={0.0}
          backside={!isMobile} // Double-sided refraction (desktop only for performance)
          clearcoat={isMobile ? 0 : 1.0} // Extra reflective coating (desktop only)
          clearcoatRoughness={0.01}
          resolution={isMobile ? 128 : 512} // Substantially reduces mobile GPU buffer width for 60 FPS
          samples={isMobile ? 2 : 6} // Fewer light sample taps on mobile (faceted needs fewer samples anyway)
          transparent
        />
      </mesh>
    </Float>
  );
}

/* === Main geometry + materials with dynamic morphing & responsive scaling === */
function FloatingGeometry({ isMobile }: { isMobile: boolean }) {
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMouse = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const vWidth = viewport.width;

  // Position exactly one gemstone to frame "Divy Yadav" — anchored near the letter "a" in "Yadav"
  // (slightly to the right of center horizontally)
  const dropConfig = isMobile
    ? {
        baseX: vWidth * 0.1, // slightly off-center next to Yadav on mobile
        baseY: -0.15,
        baseZ: 0.5,
        scale: [0.28, 0.46, 0.28] as [number, number, number],
        parallax: 1.0,
        floatSpeed: 1.0,
        floatAmp: 0.06,
        rotSpeed: [0.1, 0.2, 0.05] as [number, number, number],
      }
    : {
        baseX: vWidth * 0.08, // aligned near the "a" in "Yadav"
        baseY: -0.15,
        baseZ: 0.5,
        scale: [0.45, 0.72, 0.45] as [number, number, number], // larger premium signature crystal
        parallax: 1.0,
        floatSpeed: 1.2,
        floatAmp: 0.08,
        rotSpeed: [0.15, 0.25, 0.05] as [number, number, number],
      };

  return (
    <group>
      {/* 1. Backdrop Grid inside canvas to refract */}
      <gridHelper 
        args={[20, 20, '#e2d6c1', '#e2d6c1']} 
        position={[0, 0, -1.5]} 
        rotation={[Math.PI / 2, 0, 0]} 
      />

      {/* 2. Soft terracotta graphic disk behind the gem so it refracts a gorgeous terracotta shape */}
      <SetDressing
        baseX={dropConfig.baseX}
        baseY={dropConfig.baseY}
        baseZ={dropConfig.baseZ}
        isMobile={isMobile}
      />

      {/* 3. Signature liquid crystal gem */}
      <AccentElement
        baseX={dropConfig.baseX}
        baseY={dropConfig.baseY}
        baseZ={dropConfig.baseZ}
        scale={dropConfig.scale}
        parallax={dropConfig.parallax}
        floatSpeed={dropConfig.floatSpeed}
        floatAmp={dropConfig.floatAmp}
        rotSpeed={dropConfig.rotSpeed}
        isMobile={isMobile}
        mouseRef={mouse}
      />

      {/* 4. Soft Contact Shadows below the crystal space */}
      <ContactShadows
        position={[dropConfig.baseX, dropConfig.baseY - 1.8, dropConfig.baseZ - 1.0]}
        opacity={isMobile ? 0.25 : 0.45}
        scale={isMobile ? 3.5 : 5.5}
        blur={isMobile ? 1.8 : 2.5}
        far={3.0}
      />
    </group>
  );
}

/* === Canvas export with visibility-gating === */
export default function HeroCanvas({ isMobile = false }: { isMobile?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  // IntersectionObserver to completely unmount Canvas when scrolled past
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0.01 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Setup entrance event dispatchers for portrait animations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('dy_sculpture_reveal_start'));
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('dy_sculpture_reveal_complete'));
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
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
      {isInView && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 46 }}
          gl={{
            antialias: !isMobile, // Disable antialiasing on mobile for a massive performance boost
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          dpr={isMobile ? 1.0 : [1, 1.5]}
          shadows={false} // Disable heavy dynamic shadows for premium performance
          style={{
            background: 'transparent',
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // Allow all click events to pass through
          }}
        >
          <AnimatedLights />
          {/* Ambient background rim light matching terracotta */}
          <directionalLight position={[0, 4, -5]} intensity={0.65} color="#B5502D" />

          {/* Studio HDRI environment for reflections */}
          <Environment preset="sunset" />

          <FloatingGeometry isMobile={isMobile} />
        </Canvas>
      )}
    </div>
  );
}
