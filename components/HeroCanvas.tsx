'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
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

interface AccentProps {
  type: 'droplet' | 'disc' | 'lens' | 'capsule' | 'pebble';
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

/* === Individual Accent Element Component === */
function AccentElement({
  type,
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

    // 2. Slow floating sine wave drift
    const elapsed = state.clock.getElapsedTime() + timeOffset.current;
    const floatY = Math.sin(elapsed * floatSpeed) * floatAmp;
    const floatX = Math.cos(elapsed * floatSpeed * 0.8) * floatAmp * 0.5;

    // 3. Proximity Interactive Reaction (warp & scale when cursor gets close)
    let proximityScale = 1.0;
    let proximityRoughness = type === 'lens' ? 0.04 : 0.08;
    let proximityThickness = 0.5;
    let proximityDistortion = 0.01;

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
        proximityScale = 1.0 + influence * 0.28; // scale up by up to 28%
        proximityRoughness = THREE.MathUtils.lerp(proximityRoughness, 0.01, influence); // polish surface
        proximityThickness = THREE.MathUtils.lerp(0.5, 0.95, influence); // magnify glass thickness
        proximityDistortion = THREE.MathUtils.lerp(0.01, 0.08, influence); // warp refractions
        
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
      materialRef.current.distortion = THREE.MathUtils.lerp(materialRef.current.distortion, proximityDistortion, 0.08);
    }
  });

  const renderGeometry = () => {
    switch (type) {
      case 'droplet':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'disc':
        return <cylinderGeometry args={[1, 1, 1, 32]} />;
      case 'lens':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'capsule':
        return <capsuleGeometry args={[0.15, 0.42, 8, 16]} />;
      case 'pebble':
        return <sphereGeometry args={[1, 32, 32]} />;
      default:
        return <sphereGeometry args={[1, 16, 16]} />;
    }
  };

  // Cylinder needs a default rotation to face the camera flat
  const rotationOffset: [number, number, number] = type === 'disc' ? [Math.PI / 2, 0, 0] : [0, 0, 0];

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.25}>
      <mesh
        ref={meshRef}
        castShadow={false}
        rotation={rotationOffset}
      >
        {renderGeometry()}
        <MeshTransmissionMaterial
          ref={materialRef}
          color="#faf8f5"
          roughness={type === 'lens' ? 0.04 : 0.08}
          transmission={0.97}
          thickness={0.5}
          ior={1.22}
          chromaticAberration={0.002}
          anisotropicBlur={0.15}
          distortion={0.01}
          distortionScale={0.02}
          temporalDistortion={0.0}
          samples={isMobile ? 4 : 8}
          transparent
        />
      </mesh>
    </Float>
  );
}

/* === Main geometry + materials with dynamic morphing & responsive scaling === */
function FloatingGeometry({ isMobile }: { isMobile: boolean }) {
  const { viewport } = useThree();
  const cursorMeshRef = useRef<THREE.Mesh>(null);
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

  useFrame((state, delta) => {
    // Cursor follower animation
    if (cursorMeshRef.current && !isMobile) {
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;

      const targetX = mouse.current.x * state.viewport.width * 0.5;
      const targetY = mouse.current.y * state.viewport.height * 0.5;

      cursorMeshRef.current.position.x = THREE.MathUtils.lerp(cursorMeshRef.current.position.x, targetX, 0.08);
      cursorMeshRef.current.position.y = THREE.MathUtils.lerp(cursorMeshRef.current.position.y, targetY, 0.08);
      cursorMeshRef.current.position.z = THREE.MathUtils.lerp(cursorMeshRef.current.position.z, 1.2, 0.08);

      cursorMeshRef.current.rotation.x += delta * 0.15;
      cursorMeshRef.current.rotation.y += delta * 0.1;
    }
  });

  // Accents list config
  const vWidth = viewport.width;
  const vHeight = viewport.height;

  // On mobile, render only 2 primary elements to keep performance high and typography clear
  const accentsList = isMobile
    ? [
        {
          type: 'droplet' as const,
          baseX: -vWidth * 0.28,
          baseY: 1.3,
          baseZ: 0.5,
          scale: [0.15, 0.26, 0.15] as [number, number, number],
          parallax: 1.0,
          floatSpeed: 1.0,
          floatAmp: 0.06,
          rotSpeed: [0.1, 0.2, 0.05] as [number, number, number],
        },
        {
          type: 'disc' as const,
          baseX: vWidth * 0.28,
          baseY: -1.4,
          baseZ: 0.8,
          scale: [0.28, 0.28, 0.05] as [number, number, number],
          parallax: 1.05,
          floatSpeed: 0.8,
          floatAmp: 0.08,
          rotSpeed: [-0.08, 0.15, 0.1] as [number, number, number],
        },
      ]
    : [
        {
          type: 'droplet' as const,
          baseX: -vWidth * 0.32,
          baseY: 1.4,
          baseZ: 0.5,
          scale: [0.18, 0.32, 0.18] as [number, number, number],
          parallax: 1.0,
          floatSpeed: 1.2,
          floatAmp: 0.08,
          rotSpeed: [0.15, 0.25, 0.05] as [number, number, number],
        },
        {
          type: 'disc' as const,
          baseX: vWidth * 0.3,
          baseY: -1.2,
          baseZ: 0.8,
          scale: [0.35, 0.35, 0.06] as [number, number, number],
          parallax: 1.05,
          floatSpeed: 0.95,
          floatAmp: 0.1,
          rotSpeed: [-0.1, 0.18, 0.12] as [number, number, number],
        },
        {
          type: 'lens' as const,
          baseX: -vWidth * 0.34,
          baseY: -vHeight * 1.0 + 0.3,
          baseZ: -0.2,
          scale: [0.32, 0.32, 0.08] as [number, number, number],
          parallax: 0.95,
          floatSpeed: 1.1,
          floatAmp: 0.07,
          rotSpeed: [0.08, -0.15, 0.22] as [number, number, number],
        },
        {
          type: 'capsule' as const,
          baseX: vWidth * 0.32,
          baseY: -vHeight * 2.0 - 0.2,
          baseZ: 0.3,
          scale: [1, 1, 1] as [number, number, number],
          parallax: 1.0,
          floatSpeed: 1.3,
          floatAmp: 0.09,
          rotSpeed: [0.2, 0.1, -0.15] as [number, number, number],
        },
        {
          type: 'pebble' as const,
          baseX: -vWidth * 0.28,
          baseY: -vHeight * 3.0,
          baseZ: 0.1,
          scale: [0.25, 0.22, 0.28] as [number, number, number],
          parallax: 0.9,
          floatSpeed: 0.8,
          floatAmp: 0.12,
          rotSpeed: [-0.12, 0.22, 0.18] as [number, number, number],
        },
      ];

  return (
    <group>
      {accentsList.map((item, idx) => (
        <AccentElement
          key={idx}
          type={item.type}
          baseX={item.baseX}
          baseY={item.baseY}
          baseZ={item.baseZ}
          scale={item.scale}
          parallax={item.parallax}
          floatSpeed={item.floatSpeed}
          floatAmp={item.floatAmp}
          rotSpeed={item.rotSpeed}
          isMobile={isMobile}
          mouseRef={mouse}
        />
      ))}

      {/* Tiny Glass Follower Droplet near the cursor (Desktop only) */}
      {!isMobile && (
        <mesh ref={cursorMeshRef}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <MeshTransmissionMaterial
            color="#faf8f5"
            roughness={0.03}
            transmission={0.98}
            thickness={0.2}
            ior={1.2}
            chromaticAberration={0.001}
            samples={4}
            transparent
          />
        </mesh>
      )}
    </group>
  );
}

/* === Canvas export === */
export default function HeroCanvas({ isMobile = false }: { isMobile?: boolean }) {
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
        <Environment preset="studio" />

        <FloatingGeometry isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
