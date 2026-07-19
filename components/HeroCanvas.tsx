'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* === Main geometry + material === */
function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const scrollY = useRef(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const onMouse = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => { scrollY.current = window.scrollY; };

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // Smooth mouse lerp
    mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;

    if (!prefersReducedMotion.current) {
      groupRef.current.rotation.y += delta * 0.35;
      groupRef.current.rotation.x += delta * 0.08;
      // Mouse parallax
      groupRef.current.rotation.x += mouse.current.y * 0.0006;
      groupRef.current.rotation.y += mouse.current.x * 0.0006;
    }

    // Scroll-driven scale - shrinks as you scroll past hero
    const vhProgress = scrollY.current /
      (typeof window !== 'undefined' ? window.innerHeight : 1000);
    const targetScale = Math.max(0.3, 1 - vhProgress * 0.6);
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );
    // Float up slightly on scroll
    groupRef.current.position.y +=
      (-vhProgress * 1.2 - groupRef.current.position.y) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh castShadow>
          <torusKnotGeometry args={[1, 0.28, 256, 40]} />
          {/* Chrome-glass material using MeshPhysicalMaterial */}
          <meshPhysicalMaterial
            color="#c8c4be"
            metalness={0.95}
            roughness={0.06}
            reflectivity={1}
            clearcoat={1}
            clearcoatRoughness={0.02}
            envMapIntensity={3}
            iridescence={0.6}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[100, 400]}
          />
        </mesh>
      </Float>

      {/* Terracotta sparks */}
      <Sparkles
        count={90}
        scale={9}
        size={2}
        speed={0.25}
        opacity={0.35}
        color="#B5502D"
      />
      {/* Warm cream ambient sparks */}
      <Sparkles
        count={60}
        scale={6}
        size={1}
        speed={0.1}
        opacity={0.15}
        color="#F5F5DC"
      />
      {/* Micro gold specks */}
      <Sparkles
        count={40}
        scale={4}
        size={0.6}
        speed={0.4}
        opacity={0.5}
        color="#D4A853"
      />
    </group>
  );
}

/* === Canvas export === */
export default function HeroCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '520px', pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        shadows
        style={{ background: 'transparent' }}
      >
        {/* Warm studio lighting */}
        <ambientLight intensity={0.4} color="#FFF8F0" />
        <pointLight
          position={[6, 6, 6]}
          intensity={4}
          color="#FFE8C0"
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight position={[-4, -2, 4]} intensity={2} color="#F5F5DC" />
        <spotLight
          position={[0, 8, 2]}
          angle={0.35}
          penumbra={1}
          intensity={3}
          color="#ffffff"
          castShadow
        />
        {/* Accent rim light - terracotta */}
        <pointLight
          position={[-6, 2, -3]}
          intensity={1.5}
          color="#B5502D"
        />

        {/* Studio HDRI environment for reflections */}
        <Environment preset="studio" />

        <FloatingGeometry />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate
          rotateSpeed={0.2}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
