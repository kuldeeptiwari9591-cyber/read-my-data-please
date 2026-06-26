import { Suspense, lazy, useEffect, useState } from "react";
import { HoloUploadZone } from "./HoloUploadZone";

interface Props {
  multiple?: boolean;
  accept?: string;
  files: File[];
  onFiles: (files: File[]) => void;
  label?: string;
}

const HoloUploadZone3D = lazy(() =>
  import("./HoloUploadZone3D").then((m) => ({ default: m.HoloUploadZone3D })),
);

/**
 * Smart upload zone (Animation 10):
 * - Desktop + motion-allowed: dynamic-import 3D Three.js variant
 * - Mobile or reduced-motion: 2D HoloUploadZone
 */
export function SmartUploadZone(props: Props) {
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setIs3D(desktop && !reduce);
  }, []);

  if (!is3D) return <HoloUploadZone {...props} />;
  return (
    <Suspense fallback={<HoloUploadZone {...props} />}>
      <HoloUploadZone3D {...props} />
    </Suspense>
  );
}
