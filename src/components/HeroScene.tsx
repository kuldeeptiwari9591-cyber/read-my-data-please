import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function FloatingDocument() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 1.95, 0.06]} />
        <MeshDistortMaterial
          color="#6366F1"
          distort={0.06}
          speed={1.8}
          roughness={0.15}
          metalness={0.75}
          emissive="#4338CA"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0.55, 0.78, 0.04]}>
        <boxGeometry args={[0.38, 0.38, 0.02]} />
        <meshStandardMaterial color="#8B5CF6" metalness={0.9} roughness={0.1} />
      </mesh>
      {[0.35, 0.15, -0.05, -0.25, -0.45, -0.65].map((y, i) => (
        <mesh key={i} position={[0, y, 0.045]}>
          <boxGeometry args={[0.95, 0.025, 0.01]} />
          <meshStandardMaterial color="#C7D2FE" opacity={0.55} transparent />
        </mesh>
      ))}
    </Float>
  );
}

function OrbitingDocuments() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  const positions: Array<[number, number, number]> = [
    [3.4, 0.4, 0],
    [-3.4, -0.4, 0.6],
    [0.5, 2.3, -2],
    [-0.4, -2.1, 1.5],
  ];

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={0.6}>
          <mesh position={pos} scale={0.42}>
            <boxGeometry args={[1.4, 1.8, 0.05]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#8B5CF6" : "#6366F1"}
              metalness={0.7}
              roughness={0.2}
              opacity={0.55}
              transparent
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const positions = useMemo(() => {
    const count = 600;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, []);

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#6366F1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#6366F1" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#8B5CF6" />
        <spotLight position={[0, 8, 0]} intensity={1} angle={0.4} color="#A5B4FC" />
        <Stars radius={80} depth={50} count={2500} factor={3} fade speed={0.5} />
        <FloatingDocument />
        <OrbitingDocuments />
        <ParticleField />
      </Canvas>
    </div>
  );
}
