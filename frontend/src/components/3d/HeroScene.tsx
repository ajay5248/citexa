"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars, Float, PerspectiveCamera, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function RotatingRings() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.2;
      outerRingRef.current.rotation.y += delta * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x -= delta * 0.4;
      innerRingRef.current.rotation.y -= delta * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Glass Ring */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={outerRingRef}>
          <torusGeometry args={[3.5, 0.15, 32, 100]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={0.4}
            anisotropy={0.3}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#fff"
            resolution={1024}
          />
        </mesh>
      </Float>

      {/* Inner Glowing Ring */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={innerRingRef} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.5, 0.05, 16, 100]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#0088ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Center Energy Core */}
      <Float speed={4} rotationIntensity={0.2} floatIntensity={1}>
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={4}
            wireframe
            toneMapped={false}
          />
        </mesh>
      </Float>
    </group>
  );
}

function MouseParallax() {
  const { camera } = useThree();

  useFrame((state) => {
    // Smoothly move the camera based on mouse position
    const targetX = (state.pointer.x * 2);
    const targetY = (state.pointer.y * 2);

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        dpr={[1, 2]}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <MouseParallax />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#00ffff" />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={2} color="#ff00ff" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={5} />

        {/* 3D Elements */}
        <RotatingRings />
        
        {/* Environment for Glass Reflections */}
        <Environment preset="city" />

        {/* Cinematic Particles */}
        <Sparkles count={300} scale={15} size={2} speed={0.4} opacity={0.4} color="#a0b0ff" />
        <Sparkles count={100} scale={10} size={4} speed={0.2} opacity={0.8} color="#ffffff" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
