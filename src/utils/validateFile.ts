const MAGIC_BYTES: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  jpg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  zip: [0x50, 0x4b, 0x03, 0x04], // .docx/.xlsx/.pptx
};

async function checkMagic(file: File, type: keyof typeof MAGIC_BYTES) {
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  return MAGIC_BYTES[type].every((b, i) => bytes[i] === b);
}

const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

export type ExpectedType = "pdf" | "image" | "office" | "any";

export async function validateFile(
  file: File,
  expectedType: ExpectedType = "any",
): Promise<{ valid: boolean; error?: string }> {
  if (file.size === 0) return { valid: false, error: "File is empty. Please upload a valid file." };
  if (file.size > MAX_SIZE)
    return { valid: false, error: "File exceeds the 25 MB size limit." };

  if (expectedType === "pdf") {
    const ok =
      /\.pdf$/i.test(file.name) &&
      (file.type === "application/pdf" || file.type === "") &&
      (await checkMagic(file, "pdf"));
    if (!ok) return { valid: false, error: "Invalid file. Please upload a valid PDF." };
  }

  if (expectedType === "image") {
    const okMime = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    const isJpg = await checkMagic(file, "jpg");
    const isPng = await checkMagic(file, "png");
    if (!okMime || (!isJpg && !isPng && file.type !== "image/webp")) {
      return { valid: false, error: "Please upload a valid JPG or PNG image." };
    }
  }

  if (expectedType === "office") {
    const okExt = [".docx", ".xlsx", ".pptx", ".doc", ".xls", ".ppt"].some((e) =>
      file.name.toLowerCase().endsWith(e),
    );
    if (!okExt)
      return { valid: false, error: "Please upload an Office document (.docx, .xlsx, .pptx)." };
  }

  return { valid: true };
}

/** Infer expected type from an `accept` string. */
export function inferExpected(accept?: string): ExpectedType {
  if (!accept) return "any";
  const a = accept.toLowerCase();
  if (a.includes("pdf")) return "pdf";
  if (a.includes("image") || a.includes("jpg") || a.includes("png")) return "image";
  if (a.includes("doc") || a.includes("xls") || a.includes("ppt") || a.includes("office"))
    return "office";
  return "any";
}
