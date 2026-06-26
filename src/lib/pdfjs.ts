// Lazy-load pdfjs only in browser; sets the worker once.
let cached: Promise<typeof import("pdfjs-dist")> | null = null;

export function loadPdfjs() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("pdfjs is browser-only"));
  }
  if (!cached) {
    cached = (async () => {
      const pdfjs = await import("pdfjs-dist");
      const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })();
  }
  return cached;
}
