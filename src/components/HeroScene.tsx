import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Core() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.18;
      meshRef.current.rotation.y = t * 0.24;
      const s = 1 + Math.sin(t * 1.2) * 0.04;
      meshRef.current.scale.setScalar(s);
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.12;
      wireRef.current.rotation.y = t * 0.16;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color="#6366F1"
          metalness={0.4}
          roughness={0.3}
          emissive="#4338CA"
          emissiveIntensity={0.25}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#A5B4FC" wireframe transparent opacity={0.5} />
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
      <torusGeometry args={[radius, 0.018, 12, 100]} />
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
    const count = 6;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 2.4;
      arr.push({
        pos: [Math.cos(a) * r, Math.sin(a * 1.3) * 0.5, Math.sin(a) * r],
        color: i % 2 === 0 ? "#8B5CF6" : "#6366F1",
        size: 0.1,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.size, 16, 16]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// CSS-only fallback gradient that ALWAYS shows so the hero never looks empty.
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(139,92,246,0.2) 45%, transparent 75%)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30" />
      <div className="absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/20" />
    </div>
  );
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) setWebglFailed(true);
    } catch {
      setWebglFailed(true);
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <HeroBackdrop />
      {mounted && !webglFailed && (
        <div className="absolute inset-0 opacity-70 [mask-image:radial-gradient(circle_at_center,black_30%,transparent_75%)]">
          <Canvas
            camera={{ position: [0, 0.4, 7.5], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
                setWebglFailed(true);
              });
            }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[4, 4, 4]} intensity={1.4} color="#A5B4FC" />
            <pointLight position={[-4, -3, -2]} intensity={0.9} color="#C4B5FD" />

            <Core />
            <OrbitingNodes />

            <Ring radius={2.1} tilt={[Math.PI / 2.4, 0, 0]} speed={0.18} color="#8B5CF6" />
            <Ring radius={2.5} tilt={[Math.PI / 3, Math.PI / 6, 0]} speed={-0.12} color="#6366F1" />
            <Ring radius={2.85} tilt={[Math.PI / 2, Math.PI / 3, 0]} speed={0.08} color="#A5B4FC" />
          </Canvas>
        </div>
      )}
    </div>
  );
}
