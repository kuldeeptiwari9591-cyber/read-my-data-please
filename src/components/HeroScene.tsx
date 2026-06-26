import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float, Stars, Environment } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function MorphingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.18;
    meshRef.current.rotation.y = t * 0.24;
    const s = 1 + Math.sin(t * 1.2) * 0.04;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshPhysicalMaterial
          ref={matRef}
          color="#6366F1"
          metalness={0.4}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.35}
          thickness={1.2}
          ior={1.4}
          emissive="#4338CA"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.36, 1]} />
        <meshBasicMaterial color="#A5B4FC" wireframe transparent opacity={0.35} />
      </mesh>
    </Float>
  );
}

function Ring({
  radius,
  tilt,
  speed,
  color,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.015, 16, 160]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  );
}

function OrbitingNodes() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  const nodes = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string; size: number }[] = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 2.4 + (i % 2) * 0.4;
      arr.push({
        pos: [Math.cos(a) * r, Math.sin(a * 1.3) * 0.5, Math.sin(a) * r],
        color: i % 2 === 0 ? "#8B5CF6" : "#6366F1",
        size: 0.08 + (i % 3) * 0.025,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <Float key={i} speed={1.2 + i * 0.1} floatIntensity={0.4}>
          <mesh position={n.pos}>
            <sphereGeometry args={[n.size, 24, 24]} />
            <meshStandardMaterial
              color={n.color}
              emissive={n.color}
              emissiveIntensity={0.8}
              roughness={0.25}
              metalness={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.4, 5.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={1.6} color="#A5B4FC" />
        <pointLight position={[-4, -3, -2]} intensity={1.1} color="#C4B5FD" />
        <spotLight position={[0, 6, 2]} intensity={0.9} angle={0.5} color="#FFFFFF" />

        <Stars radius={40} depth={30} count={1200} factor={3} fade speed={0.6} />

        <MorphingCore />
        <OrbitingNodes />

        <Ring radius={2.1} tilt={[Math.PI / 2.4, 0, 0]} speed={0.18} color="#8B5CF6" />
        <Ring radius={2.5} tilt={[Math.PI / 3, Math.PI / 6, 0]} speed={-0.12} color="#6366F1" />
        <Ring radius={2.85} tilt={[Math.PI / 2, Math.PI / 3, 0]} speed={0.08} color="#A5B4FC" />

        <Sparkles count={120} scale={9} size={2.8} speed={0.45} color="#A5B4FC" opacity={0.8} />
      </Canvas>
    </div>
  );
}
