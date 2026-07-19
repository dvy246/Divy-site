'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
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
      <ambientLight intensity={0.45} color="#FFF8F0" />
      <pointLight
        ref={pointLightRef}
        position={[6, 6, 6]}
        intensity={5}
        color="#FFE8C0"
        castShadow
        shadow-mapSize={512}
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

/* === Main geometry + materials with dynamic morphing & responsive scaling === */
function FloatingGeometry({
  scrollParams,
  isMobile,
}: {
  scrollParams: React.MutableRefObject<any>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  // Material refs for dynamic morphing
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const inkWireframeMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const redlineWireframeMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const ring1MaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const ring2MaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const prefersReducedMotion = useRef(false);

  // Drag inertia & momentum refs
  const isDragging = useRef(false);
  const pointerX = useRef(0);
  const pointerY = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });
  const idleTime = useRef(0);

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

    // 1. Inertial rotation decay & drag physics
    if (!prefersReducedMotion.current) {
      if (!isDragging.current) {
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
          const targetRestX = Math.sin(idleTime.current * 0.3) * 0.06 + params.rotationSpeedX * idleTime.current;
          const targetRestY = Math.cos(idleTime.current * 0.25) * 0.06 + params.rotationSpeedY * idleTime.current;

          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRestX, 0.015);
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRestY, 0.015);
        }
      }
      groupRef.current.rotation.z += delta * params.rotationSpeedZ;

      // Rotate engineering orbital rings in opposite directions
      if (ringRef.current) {
        ringRef.current.rotation.x += delta * 0.2 * params.ring1Speed;
        ringRef.current.rotation.y += delta * 0.3 * params.ring1Speed;
      }
      if (ringRef2.current) {
        ringRef2.current.rotation.y -= delta * 0.15 * params.ring2Speed;
        ringRef2.current.rotation.z += delta * 0.25 * params.ring2Speed;
      }
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

    // 3. Dynamic Morphing of mesh material parameters directly on the GPU thread (highly performant!)
    if (materialRef.current) {
      materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, params.roughness, 0.08);
      materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, params.metalness, 0.08);
      materialRef.current.transmission = THREE.MathUtils.lerp(materialRef.current.transmission, params.transmission, 0.08);
      if (params.color) {
        materialRef.current.color.lerp(new THREE.Color(params.color), 0.08);
      }
      if (params.iridescence !== undefined) {
        materialRef.current.iridescence = THREE.MathUtils.lerp(materialRef.current.iridescence, params.iridescence, 0.08);
      }
    }

    // 4. Dynamic Morphing of wireframe and ring opacities
    if (inkWireframeMaterialRef.current) {
      inkWireframeMaterialRef.current.opacity = THREE.MathUtils.lerp(
        inkWireframeMaterialRef.current.opacity,
        params.inkWireframeOpacity,
        0.08
      );
    }
    if (redlineWireframeMaterialRef.current) {
      redlineWireframeMaterialRef.current.opacity = THREE.MathUtils.lerp(
        redlineWireframeMaterialRef.current.opacity,
        params.redlineWireframeOpacity,
        0.08
      );
    }
    if (ring1MaterialRef.current) {
      ring1MaterialRef.current.opacity = THREE.MathUtils.lerp(
        ring1MaterialRef.current.opacity,
        params.ring1Opacity,
        0.08
      );
    }
    if (ring2MaterialRef.current) {
      ring2MaterialRef.current.opacity = THREE.MathUtils.lerp(
        ring2MaterialRef.current.opacity,
        params.ring2Opacity,
        0.08
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Core Torus Knot (Refractive Glass/Chrome Base) */}
        <mesh castShadow>
          {/* Lower geometry details on mobile for performance tuning */}
          <torusKnotGeometry args={isMobile ? [1, 0.26, 128, 24] : [1, 0.26, 256, 48]} />
          <meshPhysicalMaterial
            ref={materialRef}
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
          <torusKnotGeometry args={isMobile ? [1.0015, 0.2605, 128, 24] : [1.0015, 0.2605, 256, 48]} />
          <meshBasicMaterial
            ref={inkWireframeMaterialRef}
            color="#1b1c1c"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* 3D Technical Construction Redline Accent Wireframe */}
        <mesh>
          <torusKnotGeometry args={isMobile ? [1.003, 0.261, 64, 16] : [1.003, 0.261, 128, 24]} />
          <meshBasicMaterial
            ref={redlineWireframeMaterialRef}
            color="#B5502D"
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Orbiting thin wireframe ring 1 (Terracotta) */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.5, 0.012, 8, isMobile ? 32 : 64]} />
          <meshBasicMaterial
            ref={ring1MaterialRef}
            color="#B5502D"
            opacity={0.3}
            transparent
            wireframe
          />
        </mesh>

        {/* Orbiting thin wireframe ring 2 (Ink) */}
        <mesh ref={ringRef2}>
          <torusGeometry args={[1.8, 0.008, 6, isMobile ? 24 : 48]} />
          <meshBasicMaterial
            ref={ring2MaterialRef}
            color="#1b1c1c"
            opacity={0.15}
            transparent
            wireframe
          />
        </mesh>
      </Float>

      {/* Sparks - Scaled count on mobile to preserve 60fps performance */}
      {/* Terracotta sparks */}
      <Sparkles
        count={isMobile ? 30 : 90}
        scale={9}
        size={2.2}
        speed={0.25}
        opacity={0.35}
        color="#B5502D"
      />
      {/* Warm cream ambient sparks */}
      <Sparkles
        count={isMobile ? 20 : 60}
        scale={6}
        size={1.2}
        speed={0.1}
        opacity={0.15}
        color="#F5F5DC"
      />
      {/* Micro gold specks */}
      <Sparkles
        count={isMobile ? 15 : 45}
        scale={4}
        size={0.8}
        speed={0.4}
        opacity={0.5}
        color="#D4A853"
      />
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
  // Shared ref holding morphable 3D parameters
  const scrollParams = useRef({
    // Initial Hero State (Identity)
    x: isMobile ? 0 : 1.4,
    y: isMobile ? -0.25 : 0,
    z: 0,
    rotationSpeedX: 0.08,
    rotationSpeedY: 0.25,
    rotationSpeedZ: 0.0,
    scale: isMobile ? 0.65 : 0.85,
    color: isMobile ? '#ffffff' : '#dfb46c',

    roughness: 0.06,
    metalness: 0.05,
    transmission: 0.88,
    iridescence: 0.5,

    inkWireframeOpacity: 0.1,
    redlineWireframeOpacity: 0.1,
    ring1Opacity: 0.2,
    ring2Opacity: 0.2,
    ring1Speed: 1.0,
    ring2Speed: 1.0,

    cameraZ: 4.8,
    cameraY: 0.0,
    cameraX: 0.0,
    pointLightIntensity: 5.0,
    spotLightIntensity: 4.0,
  });

  // Setup GSAP scroll-bound triggers
  useEffect(() => {
    let ctx: any;

    const initGSAP = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Define standard layout states
      const state1 = {
        x: isMobile ? 0 : 1.4,
        y: isMobile ? -0.25 : 0,
        z: 0,
        scale: isMobile ? 0.65 : 0.85,
        color: isMobile ? '#ffffff' : '#dfb46c',
        roughness: 0.06,
        metalness: 0.05,
        transmission: 0.88,
        inkWireframeOpacity: 0.1,
        redlineWireframeOpacity: 0.1,
        ring1Opacity: 0.2,
        ring2Opacity: 0.2,
        ring1Speed: 1.0,
        ring2Speed: 1.0,
        rotationSpeedX: 0.08,
        rotationSpeedY: 0.25,
        cameraZ: 4.8,
        pointLightIntensity: 5.0,
        spotLightIntensity: 4.0,
      };

      const state2 = {
        x: isMobile ? 0 : 1.4,
        y: isMobile ? -0.25 : 0,
        z: 0,
        scale: isMobile ? 0.65 : 0.85,
        color: isMobile ? '#ffffff' : '#dfb46c',
        roughness: 0.06,
        metalness: 0.05,
        transmission: 0.88,
        inkWireframeOpacity: 0.75, // Showcase blueprint wires for craft
        redlineWireframeOpacity: 0.65,
        ring1Opacity: 0.8,
        ring2Opacity: 0.6,
        ring1Speed: 2.2,
        ring2Speed: 1.8,
        rotationSpeedX: 0.18,
        rotationSpeedY: 0.65,
        cameraZ: 4.8,
        pointLightIntensity: 6.5,
        spotLightIntensity: 5.5,
      };

      const state3 = {
        x: isMobile ? 0 : 1.4,
        y: isMobile ? -0.25 : 0,
        z: 0,
        scale: isMobile ? 0.75 : 1.1,
        color: '#ffffff', // Turn white behind text layouts
        roughness: 0.06,
        metalness: 0.05,
        transmission: 0.88,
        inkWireframeOpacity: 0.2,
        redlineWireframeOpacity: 0.1,
        ring1Opacity: 0.2,
        ring2Opacity: 0.1,
        ring1Speed: 0.8,
        ring2Speed: 0.6,
        rotationSpeedX: 0.08,
        rotationSpeedY: 0.25,
        cameraZ: 4.8,
        pointLightIntensity: 8.0,
        spotLightIntensity: 7.0,
      };

      const state4 = {
        x: isMobile ? 0 : 1.4,
        y: isMobile ? -0.25 : 0,
        z: 0,
        scale: isMobile ? 0.6 : 0.8,
        color: '#ffffff', // Turn white behind CTA form
        roughness: 0.06,
        metalness: 0.05,
        transmission: 0.88,
        inkWireframeOpacity: 0.1,
        redlineWireframeOpacity: 0.1,
        ring1Opacity: 0.15,
        ring2Opacity: 0.1,
        ring1Speed: 0.8,
        ring2Speed: 0.8,
        rotationSpeedX: 0.08,
        rotationSpeedY: 0.2,
        cameraZ: 4.8,
        pointLightIntensity: 5.0,
        spotLightIntensity: 4.0,
      };

      ctx = gsap.context(() => {
        // Trigger 1: Transition into About section (bio-section)
        ScrollTrigger.create({
          trigger: '.bio-section',
          start: 'top 65%',
          onEnter: () => {
            gsap.to(scrollParams.current, { ...state2, duration: 1.1, ease: 'power2.out' });
          },
          onLeaveBack: () => {
            gsap.to(scrollParams.current, { ...state1, duration: 1.1, ease: 'power2.out' });
          },
        });

        // Trigger 2: Transition into Articles preview
        ScrollTrigger.create({
          trigger: '.articles-preview',
          start: 'top 65%',
          onEnter: () => {
            gsap.to(scrollParams.current, { ...state3, duration: 1.1, ease: 'power2.out' });
          },
          onLeaveBack: () => {
            gsap.to(scrollParams.current, { ...state2, duration: 1.1, ease: 'power2.out' });
          },
        });

        // Trigger 3: Transition into CTA / Footer
        ScrollTrigger.create({
          trigger: '.cta-section',
          start: 'top 65%',
          onEnter: () => {
            gsap.to(scrollParams.current, { ...state4, duration: 1.1, ease: 'power2.out' });
          },
          onLeaveBack: () => {
            gsap.to(scrollParams.current, { ...state3, duration: 1.1, ease: 'power2.out' });
          },
        });
      });
    };

    initGSAP();

    return () => {
      if (ctx) ctx.revert();
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
        camera={{ position: [0, 0, 5], fov: 40 }}
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

        {/* Studio HDRI environment for reflections */}
        <Environment preset="studio" />

        <FloatingGeometry scrollParams={scrollParams} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
