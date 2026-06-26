import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  Combine,
  Scissors,
  Minimize2,
  RotateCw,
  Lock,
  Unlock,
  PenLine,
  ScanText,
  Image as ImageIcon,
  FileType,
} from "lucide-react";

/**
 * Mini animated demo shown inside ToolCard on hover (Animation 4).
 * All animations are transform/opacity only.
 */
export function MiniDemo({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-primary/80">
        Tap to open
      </p>
    );
  }

  switch (slug) {
    case "compress-pdf":
      return <CompressDemo />;
    case "merge-pdf":
      return <MergeDemo />;
    case "split-pdf":
      return <SplitDemo />;
    case "pdf-to-word":
      return <ConvertDemo from="PDF" to="DOC" toColor="#2B579A" />;
    case "pdf-to-excel":
      return <ConvertDemo from="PDF" to="XLS" toColor="#107C41" />;
    case "pdf-to-ppt":
      return <ConvertDemo from="PDF" to="PPT" toColor="#B7472A" />;
    case "pdf-to-jpg":
    case "pdf-to-png":
      return <ImageRevealDemo />;
    case "rotate-pdf":
      return <RotateDemo />;
    case "protect-pdf":
      return <LockDemo closing />;
    case "unlock-pdf":
      return <LockDemo />;
    case "esign-pdf":
      return <SignatureDemo />;
    case "ocr-pdf":
      return <OcrDemo />;
    default:
      return <GlowPulseDemo />;
  }
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-12 items-center justify-center overflow-hidden">
      {children}
    </div>
  );
}

function CompressDemo() {
  const [n, setN] = useState(5.2);
  useEffect(() => {
    let cur = 5.2;
    const id = setInterval(() => {
      cur = cur > 1.1 ? +(cur - 0.41).toFixed(1) : 5.2;
      setN(cur);
    }, 200);
    return () => clearInterval(id);
  }, []);
  return (
    <Stage>
      <Minimize2 className="mr-2 h-4 w-4 text-primary" />
      <span className="font-mono text-xs tabular-nums">{n.toFixed(1)} MB</span>
    </Stage>
  );
}

function MergeDemo() {
  return (
    <Stage>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{ x: [(-18 + i * 18), 0, 0], opacity: [0.7, 1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ willChange: "transform, opacity" }}
        >
          <FileText className="h-6 w-5 text-primary" />
        </motion.div>
      ))}
    </Stage>
  );
}

function SplitDemo() {
  return (
    <Stage>
      {[-1, 0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{ x: [0, i * 16, 0], rotate: [0, i * 12, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ willChange: "transform" }}
        >
          <FileText className="h-6 w-5 text-primary" />
        </motion.div>
      ))}
    </Stage>
  );
}

function ConvertDemo({
  from,
  to,
  toColor,
}: {
  from: string;
  to: string;
  toColor: string;
}) {
  return (
    <Stage>
      <motion.div
        className="absolute flex items-center gap-1"
        animate={{ opacity: [1, 0.2, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <FileText className="h-5 w-4 text-primary" />
        <span className="font-mono text-[10px]">{from}</span>
      </motion.div>
      <motion.div
        className="absolute flex items-center gap-1"
        animate={{ opacity: [0, 0.4, 1, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <FileType className="h-5 w-4" style={{ color: toColor }} />
        <span className="font-mono text-[10px]" style={{ color: toColor }}>
          {to}
        </span>
      </motion.div>
    </Stage>
  );
}

function ImageRevealDemo() {
  return (
    <Stage>
      <div className="relative h-7 w-9">
        <motion.div
          className="absolute inset-0 rounded bg-gradient-to-br from-indigo-400 to-purple-500"
          animate={{ scale: [0.5, 1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ willChange: "transform" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded bg-card"
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <FileText className="h-4 w-4 text-primary" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0, 0, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ImageIcon className="h-4 w-4 text-white" />
        </motion.div>
      </div>
    </Stage>
  );
}

function RotateDemo() {
  return (
    <Stage>
      <motion.div
        animate={{ rotate: [0, 90, 90, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      >
        <FileText className="h-7 w-5 text-primary" />
      </motion.div>
    </Stage>
  );
}

function LockDemo({ closing = false }: { closing?: boolean }) {
  const Icon = closing ? Lock : Unlock;
  return (
    <Stage>
      <FileText className="mr-2 h-6 w-5 text-primary" />
      <motion.div
        animate={{ scale: [0.8, 1.1, 1, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        <Icon className="h-4 w-4 text-secondary" />
      </motion.div>
    </Stage>
  );
}

function SignatureDemo() {
  return (
    <Stage>
      <svg viewBox="0 0 80 24" className="h-7 w-20">
        <motion.path
          d="M2 18 Q 12 4, 22 14 T 42 12 Q 56 22, 78 6"
          fill="none"
          stroke="url(#sig-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="sig-grad">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <PenLine className="ml-1 h-4 w-4 text-primary" />
    </Stage>
  );
}

function OcrDemo() {
  const text = "OCR";
  return (
    <Stage>
      <ScanText className="mr-2 h-5 w-5 text-primary" />
      <span className="font-mono text-xs">
        {text.split("").map((c, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: i * 0.18,
            }}
          >
            {c}
          </motion.span>
        ))}
      </span>
    </Stage>
  );
}

function GlowPulseDemo() {
  return (
    <Stage>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{ willChange: "transform, opacity" }}
        className="rounded-full bg-primary/15 p-2 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
      >
        <Combine className="h-4 w-4 text-primary" />
      </motion.div>
    </Stage>
  );
}

// Re-export Scissors silently to keep tree-shaking honest
export const _u = Scissors;
