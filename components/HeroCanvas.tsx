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

    // 2. Lissajous organic float drift (multi-frequency curves for fluid non-repeating paths)
    const elapsed = state.clock.getElapsedTime() + timeOffset.current;
    const floatY = Math.sin(elapsed * floatSpeed) * floatAmp + Math.cos(elapsed * floatSpeed * 0.45) * (floatAmp * 0.4);
    const floatX = Math.cos(elapsed * floatSpeed * 0.85) * floatAmp + Math.sin(elapsed * floatSpeed * 0.35) * (floatAmp * 0.4);

    // 3. Proximity Interactive Reaction (warp & scale when cursor gets close)
    let proximityScale = 1.0;
    let proximityRoughness = type === 'lens' ? 0.01 : 0.02;
    let proximityThickness = isMobile ? 0.7 : 1.5;
    let proximityDistortion = isMobile ? 0.04 : 0.12;

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
        proximityRoughness = THREE.MathUtils.lerp(proximityRoughness, 0.005, influence); // polish surface completely
        proximityThickness = THREE.MathUtils.lerp(1.5, 2.2, influence); // magnify glass thickness
        proximityDistortion = THREE.MathUtils.lerp(0.12, 0.35, influence); // warp refractions strongly
        
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

    // 5. Entrance bloom scale + hover scale factor + organic wobble (squash/stretch)
    currentScaleFactor.current = THREE.MathUtils.lerp(currentScaleFactor.current, 1.0, 0.04);
    
    // Phase-shifted sine waves for organic squash/stretch wobble (simulating water surface tension wiggles)
    const wobbleSpeed = 1.2;
    const wobbleAmp = 0.07;
    const wobbleX = 1.0 + Math.sin(elapsed * wobbleSpeed) * wobbleAmp;
    const wobbleY = 1.0 + Math.cos(elapsed * wobbleSpeed * 1.15) * wobbleAmp;
    const wobbleZ = 1.0 + Math.sin(elapsed * wobbleSpeed * 0.85 + 1.2) * wobbleAmp;

    meshRef.current.scale.set(
      scale[0] * currentScaleFactor.current * proximityScale * wobbleX,
      scale[1] * currentScaleFactor.current * proximityScale * wobbleY,
      scale[2] * currentScaleFactor.current * proximityScale * wobbleZ
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
          color="#FFFBF2"
          roughness={type === 'lens' ? 0.01 : 0.02} // Super polished look
          transmission={0.93} // Blend refraction and diffuse champagne-warm background tint
          thickness={isMobile ? 0.7 : 1.5} // Thinner on mobile for faster render passes
          ior={1.38} // Exact refraction of premium fluid
          chromaticAberration={isMobile ? 0.004 : 0.012} // Color separation at curves
          anisotropicBlur={isMobile ? 0.0 : 0.15}
          distortion={isMobile ? 0.04 : 0.12} // Warp of background
          distortionScale={isMobile ? 0.1 : 0.25}
          temporalDistortion={0.0}
          backside={!isMobile} // Double-sided refraction (desktop only for performance)
          clearcoat={isMobile ? 0 : 1.0} // Extra reflective coating (desktop only)
          clearcoatRoughness={0.01}
          resolution={isMobile ? 128 : 512} // Substantially reduces mobile GPU buffer width for 60 FPS
          samples={isMobile ? 2 : 8} // Fewer light sample taps on mobile
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
          baseX: -vWidth * 0.38,
          baseY: 1.8,
          baseZ: 0.5,
          scale: [0.08, 0.15, 0.08] as [number, number, number],
          parallax: 1.0,
          floatSpeed: 1.0,
          floatAmp: 0.06,
          rotSpeed: [0.1, 0.2, 0.05] as [number, number, number],
        },
        {
          type: 'disc' as const,
          baseX: vWidth * 0.38,
          baseY: -1.8,
          baseZ: 0.8,
          scale: [0.16, 0.16, 0.03] as [number, number, number],
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
        <Environment preset="sunset" />

        <FloatingGeometry isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
