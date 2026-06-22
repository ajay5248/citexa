"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Sphere, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function ElegantCurves() {
  const groupRef = useRef<THREE.Group>(null);

  // Create an elegant interlocking curve (like an hourglass or infinity symbol)
  const curvePoints1 = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = Math.sin(t * Math.PI * 2) * 3;
      const y = Math.cos(t * Math.PI * 2) * 5 * Math.sin(t * Math.PI * 4); // Figure 8
      const z = Math.cos(t * Math.PI * 2) * 2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  const curvePoints2 = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = Math.cos(t * Math.PI * 2) * 3;
      const y = Math.sin(t * Math.PI * 2) * 5 * Math.sin(t * Math.PI * 4);
      const z = Math.sin(t * Math.PI * 2) * 2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {/* Central glowing ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 3, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh rotation={[Math.PI / 2.1, 0, 0]}>
        <ringGeometry args={[3.2, 3.22, 64]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* The elegant lines */}
      <Line points={curvePoints1} color="#ffffff" lineWidth={1} transparent opacity={0.2} />
      <Line points={curvePoints2} color="#ffaa00" lineWidth={1} transparent opacity={0.3} />
      
      {/* Subtle core glow */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="#ff6600" transparent opacity={0.02} />
      </Sphere>
    </group>
  );
}

function ParticleStorm() {
  const stormRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (stormRef.current) {
      // Very slow rotation of the entire storm
      stormRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      stormRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={stormRef}>
      {/* Massive Ambient Starfield */}
      <Sparkles 
        count={1500} 
        scale={[40, 40, 40]} 
        size={1.5} 
        speed={0.1} 
        opacity={0.4} 
        color="#a0b0ff" 
        position={[0, 0, -10]} 
      />
      
      {/* Floating Magic Dust */}
      <Sparkles 
        count={800} 
        scale={[30, 30, 30]} 
        size={2} 
        speed={0.3} 
        opacity={0.5} 
        color="#ffffff" 
        position={[0, 0, -5]} 
      />

      {/* Fiery Deep Orange Sparkles (Subtle) */}
      <Sparkles 
        count={500} 
        scale={[25, 25, 25]} 
        size={3} 
        speed={0.5} 
        opacity={0.6} 
        color="#ff4400" 
        position={[0, 0, -2]} 
      />
    </group>
  );
}

export function CinematicParticleScene({ showCurves = true }: { showCurves?: boolean }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#010103]">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#010103"]} />
        <fog attach="fog" args={["#010103", 10, 30]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[0, -10, 0]} intensity={2} color="#ffaa00" />
        
        {/* Core Elements */}
        {showCurves && <ElegantCurves />}
        <ParticleStorm />

        {/* Cinematic Post Processing */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
