import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { HoloUploadZone } from "./HoloUploadZone";

interface Props {
  multiple?: boolean;
  accept?: string;
  files: File[];
  onFiles: (files: File[]) => void;
  label?: string;
}

type Phase = "idle" | "hover" | "drop" | "done";

/**
 * 3D upload zone (Animation 10). Desktop only — SmartUploadZone falls
 * back to the 2D HoloUploadZone on mobile or reduced motion.
 */
export function HoloUploadZone3D(props: Props) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const arr = Array.from(list).filter((f) =>
        (props.accept ?? "application/pdf,.pdf")
          .split(",")
          .some((a) => {
            const ax = a.trim().toLowerCase();
            if (ax.startsWith(".")) return f.name.toLowerCase().endsWith(ax);
            return f.type === ax;
          }),
      );
      if (arr.length === 0) return;
      props.onFiles(
        props.multiple ? [...props.files, ...arr] : arr.slice(0, 1),
      );
      setPhase("done");
      window.setTimeout(() => setPhase("idle"), 1200);
    },
    [props],
  );

  // Graceful fallback when 3D fails to mount (WebGL context loss etc.)
  if (reduce) return <HoloUploadZone {...props} />;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setPhase("hover");
        }}
        onDragLeave={() => setPhase("idle")}
        onDrop={(e) => {
          e.preventDefault();
          setPhase("drop");
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative h-64 cursor-pointer overflow-hidden rounded-2xl border-2 transition-colors ${
          phase === "hover"
            ? "border-primary bg-primary/[0.06]"
            : phase === "done"
              ? "border-success bg-success/5"
              : "border-dashed border-primary/40 bg-surface/40"
        }`}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[3, 3, 4]} intensity={1.2} color="#8B5CF6" />
          <pointLight position={[-3, -2, 2]} intensity={0.6} color="#6366F1" />
          <Float
            floatIntensity={phase === "hover" ? 2 : 1}
            rotationIntensity={0.4}
            speed={1.4}
          >
            <Doc3D phase={phase} />
          </Float>
          {phase === "hover" && <OrbitDots />}
        </Canvas>

        <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center">
          <p className="font-display text-sm font-semibold text-foreground">
            {phase === "hover" ? "Drop it here!" : props.label ?? "Drop your PDF here, or click to browse"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {props.multiple
              ? "Add multiple PDFs — drag and drop or click"
              : "PDF up to ~100 MB · stays on your device"}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={props.accept ?? "application/pdf,.pdf"}
          multiple={props.multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Re-use the 2D chips for the file list */}
      <HoloUploadZoneList files={props.files} onFiles={props.onFiles} />
    </div>
  );
}

function Doc3D({ phase }: { phase: Phase }) {
  const ref = useRef<THREE.Mesh>(null);
  const spin = useRef(0);
  const lift = useRef(0);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = phase === "hover" ? 0.6 : phase === "drop" ? -0.3 : 0;
    lift.current += (target - lift.current) * Math.min(1, dt * 5);
    ref.current.position.y = lift.current;

    if (phase === "drop") {
      spin.current += dt * 18;
      ref.current.rotation.y = spin.current;
      if (spin.current > Math.PI * 2) spin.current = 0;
    }
  });

  const emissive =
    phase === "done" ? "#22c55e" : phase === "hover" ? "#8B5CF6" : "#6366F1";

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1.4, 1.8, 0.05]} />
      <meshStandardMaterial
        color="#f8fafc"
        emissive={emissive}
        emissiveIntensity={phase === "hover" ? 0.45 : 0.2}
        metalness={0.2}
        roughness={0.4}
      />
    </mesh>
  );
}

function OrbitDots() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.8;
  });
  return (
    <group ref={group}>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 1.6;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * 0.3, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#8B5CF6" emissive="#6366F1" emissiveIntensity={1.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Tiny inline list view to keep the 3D zone self-contained. */
function HoloUploadZoneList({
  files,
  onFiles,
}: {
  files: File[];
  onFiles: (f: File[]) => void;
}) {
  if (files.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2">
      {files.map((f, i) => (
        <li
          key={`${f.name}-${i}`}
          className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs"
        >
          <span className="truncate font-mono">
            {f.name}{" "}
            <span className="ml-1 text-muted-foreground">
              ({(f.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFiles(files.filter((_, j) => j !== i));
            }}
            className="rounded p-1 text-muted-foreground hover:text-destructive"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
