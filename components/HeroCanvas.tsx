'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* === Animated lights to generate shifting reflections === */
function AnimatedLights() {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointLightRef.current) {
      // Orbit in a circle on X-Z plane
      pointLightRef.current.position.x = 6 * Math.sin(t * 0.45);
      pointLightRef.current.position.z = 6 * Math.cos(t * 0.45);
      pointLightRef.current.position.y = 4 + 2 * Math.sin(t * 0.25);
    }
    if (spotLightRef.current) {
      spotLightRef.current.position.x = 3 * Math.cos(t * 0.15);
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} color="#FFF8F0" />
      <pointLight
        ref={pointLightRef}
        position={[6, 6, 6]}
        intensity={5}
        color="#FFE8C0"
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight position={[-4, -2, 4]} intensity={2.5} color="#F5F5DC" />
      <spotLight
        ref={spotLightRef}
        position={[0, 8, 2]}
        angle={0.35}
        penumbra={1}
        intensity={4}
        color="#ffffff"
        castShadow
      />
      {/* Accent rim light - terracotta */}
      <pointLight
        position={[-6, 2, -3]}
        intensity={2.2}
        color="#B5502D"
      />
    </>
  );
}

/* === Main geometry + material === */
function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  
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

      // Rotate engineering orbital rings in opposite directions
      if (ringRef.current) {
        ringRef.current.rotation.x += delta * 0.2;
        ringRef.current.rotation.y += delta * 0.3;
      }
      if (ringRef2.current) {
        ringRef2.current.rotation.y -= delta * 0.15;
        ringRef2.current.rotation.z += delta * 0.25;
      }
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
      <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Core Torus Knot (Refractive Glass/Chrome Base) */}
        <mesh castShadow>
          <torusKnotGeometry args={[1, 0.26, 256, 48]} />
          <meshPhysicalMaterial
            color="#e8e5e0"
            metalness={0.92}
            roughness={0.08}
            reflectivity={1.0}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            envMapIntensity={3.5}
            iridescence={0.8}
            iridescenceThicknessRange={[100, 400]}
            transmission={0.35}
            thickness={1.2}
          />
        </mesh>

        {/* 3D Pencil Sketch Ink Wireframe Overlay */}
        <mesh>
          <torusKnotGeometry args={[1.0015, 0.2605, 256, 48]} />
          <meshBasicMaterial 
            color="#1b1c1c" 
            wireframe 
            transparent 
            opacity={0.28}
          />
        </mesh>

        {/* 3D Technical Construction Redline Accent Wireframe */}
        <mesh>
          <torusKnotGeometry args={[1.003, 0.261, 128, 24]} />
          <meshBasicMaterial 
            color="#B5502D" 
            wireframe 
            transparent 
            opacity={0.22}
          />
        </mesh>

        {/* Orbiting thin wireframe ring 1 (Terracotta) */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.5, 0.012, 8, 64]} />
          <meshBasicMaterial color="#B5502D" opacity={0.4} transparent wireframe />
        </mesh>

        {/* Orbiting thin wireframe ring 2 (Ink) */}
        <mesh ref={ringRef2}>
          <torusGeometry args={[1.8, 0.008, 6, 48]} />
          <meshBasicMaterial color="#1b1c1c" opacity={0.2} transparent wireframe />
        </mesh>
      </Float>

      {/* Terracotta sparks */}
      <Sparkles
        count={90}
        scale={9}
        size={2.2}
        speed={0.25}
        opacity={0.35}
        color="#B5502D"
      />
      {/* Warm cream ambient sparks */}
      <Sparkles
        count={60}
        scale={6}
        size={1.2}
        speed={0.1}
        opacity={0.15}
        color="#F5F5DC"
      />
      {/* Micro gold specks */}
      <Sparkles
        count={45}
        scale={4}
        size={0.8}
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
          toneMappingExposure: 1.25,
        }}
        dpr={[1, 1.5]}
        shadows
        style={{ background: 'transparent' }}
      >
        <AnimatedLights />

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
