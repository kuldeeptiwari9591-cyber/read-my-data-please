import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { HoloUploadZone } from "./HoloUploadZone";
import { assertValidUpload } from "@/lib/file-validation";
import { toast } from "sonner";

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
 *
 * Wraps `onFiles` with `assertValidUpload` so magic-byte + size checks run
 * before any tool sees the file. Invalid files are dropped with a toast.
 */
export function SmartUploadZone(props: Props) {
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setIs3D(desktop && !reduce);
  }, []);

  const parentOnFiles = props.onFiles;
  const onFiles = useCallback(
    async (incoming: File[]) => {
      const validated: File[] = [];
      for (const f of incoming) {
        try {
          await assertValidUpload(f);
          validated.push(f);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "File rejected";
          toast.error(`${f.name}: ${msg}`);
        }
      }
      if (validated.length === 0) return;
      parentOnFiles(validated);
    },
    [parentOnFiles],
  );

  const wrapped = { ...props, onFiles };

  if (!is3D) return <HoloUploadZone {...wrapped} />;
  return (
    <Suspense fallback={<HoloUploadZone {...wrapped} />}>
      <HoloUploadZone3D {...wrapped} />
    </Suspense>
  );
}
