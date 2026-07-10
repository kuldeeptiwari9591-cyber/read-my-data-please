// Client + server helpers to validate uploaded files before processing.
// Enforce a hard size cap and sniff the first bytes to make sure the
// declared MIME/extension actually matches the content (magic-byte check).

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB

export type SupportedKind =
  | "pdf"
  | "png"
  | "jpg"
  | "webp"
  | "gif"
  | "zip" // used by docx/xlsx/pptx
  | "docx"
  | "xlsx"
  | "pptx"
  | "unknown";

const MAGIC: Array<{ kind: SupportedKind; bytes: number[]; offset?: number }> = [
  { kind: "pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { kind: "png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { kind: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { kind: "gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { kind: "webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF...WEBP (checked below)
  { kind: "zip", bytes: [0x50, 0x4b, 0x03, 0x04] }, // PK.. (docx/xlsx/pptx)
  { kind: "zip", bytes: [0x50, 0x4b, 0x05, 0x06] },
  { kind: "zip", bytes: [0x50, 0x4b, 0x07, 0x08] },
];

export async function sniffKind(file: File | Blob): Promise<SupportedKind> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  for (const m of MAGIC) {
    const off = m.offset ?? 0;
    let ok = true;
    for (let i = 0; i < m.bytes.length; i++) {
      if (head[off + i] !== m.bytes[i]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      // Extra confirmation for RIFF/WEBP.
      if (m.kind === "webp") {
        const s = String.fromCharCode(...head.slice(8, 12));
        if (s !== "WEBP") continue;
      }
      return m.kind;
    }
  }
  return "unknown";
}

export function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

/** Throws a user-facing Error if the file is too large or its content
 *  doesn't match any of the accepted kinds. */
export async function assertValidUpload(
  file: File,
  accepted: SupportedKind[],
): Promise<SupportedKind> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `File is larger than the ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB limit.`,
    );
  }
  if (file.size === 0) {
    throw new Error("File is empty.");
  }
  const kind = await sniffKind(file);
  // ZIP-based Office formats need extension-based refinement.
  const ext = extensionOf(file.name);
  let effective: SupportedKind = kind;
  if (kind === "zip") {
    if (ext === "docx") effective = "docx";
    else if (ext === "xlsx") effective = "xlsx";
    else if (ext === "pptx") effective = "pptx";
  }
  if (!accepted.includes(effective)) {
    throw new Error("This file type isn't supported for this tool.");
  }
  return effective;
}
