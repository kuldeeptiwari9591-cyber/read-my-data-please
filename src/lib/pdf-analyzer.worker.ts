/// <reference lib="webworker" />

// PDF header analyzer worker (Animation 8).
// Runs lightweight byte-level checks off the main thread.

export interface AnalyzerInput {
  buffer: ArrayBuffer;
  fileSize: number;
}

export interface AnalyzerResult {
  fileSize: number;
  pdfVersion: string | null;
  isEncrypted: boolean;
  hasMetadata: boolean;
  hasEmbeddedFonts: boolean;
  estimatedImageCount: number;
  /** Estimate of object stream density — used as a "complexity" signal. */
  objectCount: number;
}

function decodeAscii(view: Uint8Array, start: number, len: number): string {
  let s = "";
  for (let i = start; i < Math.min(view.length, start + len); i++) {
    s += String.fromCharCode(view[i]);
  }
  return s;
}

function findAll(text: string, needle: string): number {
  let n = 0;
  let i = 0;
  while ((i = text.indexOf(needle, i)) !== -1) {
    n++;
    i += needle.length;
  }
  return n;
}

self.onmessage = (e: MessageEvent<AnalyzerInput>) => {
  const { buffer, fileSize } = e.data;
  const view = new Uint8Array(buffer);

  // PDF version from %PDF-x.y header (first 64 bytes)
  const header = decodeAscii(view, 0, 64);
  const versionMatch = header.match(/%PDF-(\d+\.\d+)/);
  const pdfVersion = versionMatch ? versionMatch[1] : null;

  // Cheap full-text scan of dictionary keywords (sample-decode chunks)
  const chunkSize = 1 << 20;
  let isEncrypted = false;
  let hasMetadata = false;
  let hasEmbeddedFonts = false;
  let estimatedImageCount = 0;
  let objectCount = 0;

  for (let offset = 0; offset < view.length; offset += chunkSize) {
    const chunk = decodeAscii(view, offset, chunkSize);
    if (!isEncrypted && /\/Encrypt\b/.test(chunk)) isEncrypted = true;
    if (!hasMetadata && /\/(Title|Author|Subject)\s*\(/.test(chunk))
      hasMetadata = true;
    if (!hasEmbeddedFonts && /\/(FontFile|FontFile2|FontFile3)\b/.test(chunk))
      hasEmbeddedFonts = true;
    estimatedImageCount += findAll(chunk, "/Subtype /Image");
    objectCount += findAll(chunk, " obj");
  }

  const result: AnalyzerResult = {
    fileSize,
    pdfVersion,
    isEncrypted,
    hasMetadata,
    hasEmbeddedFonts,
    estimatedImageCount,
    objectCount,
  };

  (self as unknown as Worker).postMessage(result);
};
