'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

// Custom Magnetic effect for buttons
function Magnetic({ children, range = 30, strength = 0.35 }: { children: React.ReactNode; range?: number; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      setPosition({ x: distanceX * strength, y: distanceY * strength });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}

/* === Custom Extruded Shape for the Pointer Cursor === */
function PointerShape() {
  const shape = useRef(() => {
    const s = new THREE.Shape();
    // Sketch pointer shape relative to origin
    s.moveTo(0, 0);
    s.lineTo(1.2, -0.6);
    s.lineTo(0.65, -0.75);
    s.lineTo(1.1, -1.5);
    s.lineTo(0.8, -1.65);
    s.lineTo(0.35, -0.9);
    s.lineTo(0.0, -1.3);
    s.closePath();
    return s;
  }).current();

  return (
    <extrudeGeometry
      args={[
        shape,
        {
          depth: 0.15,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: 0.04,
          bevelThickness: 0.04,
        },
      ]}
    />
  );
}

/* === Organic Speech Bubble + Cursor Mesh with custom drag inertia physics === */
function OrganicBubbleScene({
  isClickTriggered,
  isHovered,
  setHovered,
  onClick,
  coords,
  setCoords,
}: {
  isClickTriggered: boolean;
  isHovered: boolean;
  setHovered: (h: boolean) => void;
  onClick: () => void;
  coords: { x: number; y: number };
  setCoords: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bubbleRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const sparklesRef = useRef<any>(null);

  // Material refs for click glow emissions
  const bubbleMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const cursorMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Drag inertia & physics variables
  const isDragging = useRef(false);
  const pointerX = useRef(0);
  const pointerY = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });
  const idleTime = useRef(0);

  const { gl } = useThree();

  useEffect(() => {
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

      // Spin velocities
      velocity.current.x = dx * 0.007;
      velocity.current.y = dy * 0.007;

      if (groupRef.current) {
        groupRef.current.rotation.y += velocity.current.x;
        groupRef.current.rotation.x += velocity.current.y;
      }
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    dom.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [gl]);

  // Frame tick updates
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Hover & Click scaling spring logic
    let targetScale = isHovered ? 1.08 : 0.95;
    if (isClickTriggered) {
      // Rebound phase
      targetScale = 1.35;
    }
    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.095);
    groupRef.current.scale.set(newScale, newScale, newScale);

    // 2. Physics & Restoring spring forces
    if (!isDragging.current) {
      // Velocity decay friction damping
      velocity.current.x *= 0.93;
      velocity.current.y *= 0.93;

      // Apply spin velocity
      groupRef.current.rotation.y += velocity.current.x;
      groupRef.current.rotation.x += velocity.current.y;

      const currentSpeed = Math.sqrt(
        velocity.current.x * velocity.current.x + velocity.current.y * velocity.current.y
      );

      if (currentSpeed < 0.002) {
        // Slow idle drifting & breathing
        idleTime.current += delta;
        const targetRestX = Math.sin(idleTime.current * 0.45) * 0.06;
        const targetRestY = Math.cos(idleTime.current * 0.35) * 0.06;

        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRestX, 0.015);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRestY, 0.015);
      }
    }

    // Gentle floating drift
    const floatOffset = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.06;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatOffset, 0.08);

    // 3. Emissive lighting on click trigger
    if (bubbleMaterialRef.current && cursorMaterialRef.current) {
      const targetEmissive = isClickTriggered ? 2.5 : 0.0;
      bubbleMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        bubbleMaterialRef.current.emissiveIntensity,
        targetEmissive,
        0.08
      );
      cursorMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        cursorMaterialRef.current.emissiveIntensity,
        targetEmissive * 1.5,
        0.08
      );
    }

    // Spin sparkles faster during transition
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y += delta * (isClickTriggered ? 3.0 : 0.15);
      sparklesRef.current.rotation.x += delta * (isClickTriggered ? 1.5 : 0.08);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Sparkles particle sphere surrounding centerpiece */}
      <Sparkles
        ref={sparklesRef}
        count={isClickTriggered ? 140 : 45}
        scale={isClickTriggered ? 4.5 : 2.5}
        size={isClickTriggered ? 3.0 : 1.5}
        color={isHovered ? '#B5502D' : '#D4A853'}
        speed={isClickTriggered ? 4.0 : 0.4}
        noise={1.0}
      />

      {/* Main Speech Bubble (Glossy organic shape) */}
      <mesh
        ref={bubbleRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshPhysicalMaterial
          ref={bubbleMaterialRef}
          color="#dfb46c"
          roughness={0.06}
          metalness={0.05}
          reflectivity={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transmission={0.88}
          thickness={2.4}
          ior={1.68}
          iridescence={0.85}
          iridescenceIOR={1.75}
          emissive="#dfb46c"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Speech Bubble Tail (protrusion) */}
      <mesh
        ref={tailRef}
        position={[-0.7, -0.7, 0]}
        scale={[0.3, 0.3, 0.3]}
      >
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshPhysicalMaterial
          color="#dfb46c"
          roughness={0.06}
          metalness={0.05}
          reflectivity={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transmission={0.88}
          thickness={2.4}
          ior={1.68}
          iridescence={0.85}
          iridescenceIOR={1.75}
        />
      </mesh>

      {/* Translucent Frosted Glass Cursor pointer overlap */}
      <mesh
        ref={cursorRef}
        position={[0.15, 0.15, 0.72]}
        rotation={[-0.1, 0.0, 0.15]}
        scale={[0.58, 0.58, 0.58]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <PointerShape />
        <meshPhysicalMaterial
          ref={cursorMaterialRef}
          color="#ffffff"
          transmission={0.65}
          roughness={0.24}
          metalness={0.1}
          thickness={3.5}
          ior={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          emissive="#ffffff"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Wireframe Outline cursor overlay to make it highly visible and technical */}
      <mesh
        position={[0.15, 0.15, 0.725]}
        rotation={[-0.1, 0.0, 0.15]}
        scale={[0.585, 0.585, 0.585]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <PointerShape />
        <meshBasicMaterial
          color="#B5502D"
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

/* === Fullscreen Interactive Welcome Entrance Overlay Component === */
export default function EntranceOverlay() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isClickTriggered, setClickTriggered] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    setMounted(true);
    const entered = sessionStorage.getItem('dy_portfolio_entered');
    if (entered === 'true') {
      setShowOverlay(false);
    } else {
      document.body.classList.add('entrance-active');
    }
    return () => {
      document.body.classList.remove('entrance-active');
    };
  }, []);

  // Keyboard controls listener (Escape, Enter, Space skips overlay)
  useEffect(() => {
    if (!showOverlay) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOverlay]);

  const handleEnter = () => {
    if (isClickTriggered) return;
    setClickTriggered(true);

    // Coordinate sequential camera transition using state & timeout
    setTimeout(() => {
      handleSkip();
    }, 750);
  };

  const handleSkip = () => {
    sessionStorage.setItem('dy_portfolio_entered', 'true');
    document.body.classList.remove('entrance-active');
    // Dispatch custom event to trigger homepage animations/hero name reveal
    window.dispatchEvent(new Event('dy_entrance_complete'));
    setShowOverlay(false);
  };

  if (!mounted || !showOverlay) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(245, 245, 220, 0.55)',
          backdropFilter: 'blur(20px) brightness(0.95)',
          userSelect: 'none',
        }}
      >
        {/* Fullscreen interactive R3F Canvas */}
        <div
          style={{
            width: '100%',
            height: '60svh',
            cursor: isHovered ? 'pointer' : 'default',
            position: 'relative',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 42 }}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
            }}
          >
            {/* Ambient studio lights */}
            <ambientLight intensity={0.7} color="#F5F5DC" />
            <directionalLight position={[5, 5, 4]} intensity={2.5} color="#ffffff" castShadow />
            <pointLight position={[-4, 3, 2]} intensity={1.5} color="#B5502D" />
            <pointLight position={[0, -3, 2]} intensity={1.0} color="#D4A853" />
            
            {/* HDRI reflections environment */}
            <Environment preset="studio" />

            <OrganicBubbleScene
              isClickTriggered={isClickTriggered}
              isHovered={isHovered}
              setHovered={setHovered}
              onClick={handleEnter}
              coords={coords}
              setCoords={setCoords}
            />
          </Canvas>
        </div>

        {/* Invitation Typography and Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '2rem 1rem',
            textAlign: 'center',
          }}
        >
          <Magnetic range={50} strength={0.25}>
            <button
              onClick={handleEnter}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: isHovered ? '#B5502D' : '#1b1c1c',
                border: '1.5px solid #1b1c1c',
                padding: '1.15rem 2.5rem',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'color 200ms ease, border-color 200ms ease',
                display: 'inline-block',
                outline: 'none',
              }}
            >
              Enter Divy's Space
            </button>
          </Magnetic>

          {/* Skippable accessibility controls */}
          <button
            onClick={handleSkip}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#747878',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.5rem',
              outline: 'none',
            }}
          >
            Skip [Esc]
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
