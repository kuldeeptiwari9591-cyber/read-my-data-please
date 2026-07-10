import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  url: z.string().url().max(2048),
});

// SSRF hardening: reject hostnames that resolve to (or literally are) private,
// loopback, link-local, or cloud-metadata addresses. We can't do DNS lookups
// on Workers, but blocking obvious literals + non-https + non-public
// hostnames covers the common attacks. The gateway/CDN in front of Workers
// also drops private-range egress, so this is defense in depth.
const BLOCKED_HOSTS = new Set([
  "localhost",
  "0.0.0.0",
  "::1",
  "::",
  "metadata.google.internal",
  "metadata.goog",
]);

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (BLOCKED_HOSTS.has(h)) return true;
  // IPv4 literal ranges
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1], 10), parseInt(m[2], 10)];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local incl. AWS/GCP/Azure metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a >= 224) return true; // multicast / reserved
  }
  // IPv6: block unique-local (fc00::/7), link-local (fe80::/10), and mapped ipv4-private ranges.
  if (h.includes(":")) {
    if (/^fc|^fd/.test(h)) return true;
    if (/^fe[89ab]/.test(h)) return true;
    if (/^::ffff:/.test(h)) return true;
  }
  // Reject bare hostnames without a dot (single-label internal names).
  if (!h.includes(".") && !h.includes(":")) return true;
  return false;
}

const FETCH_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_CHARS = 200_000; // ~100 pages of dense text

export const htmlToPdf = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const parsed = new URL(data.url);
    if (parsed.protocol !== "https:") {
      throw new Error("Only https:// URLs are allowed.");
    }
    if (isBlockedHost(parsed.hostname)) {
      throw new Error("This host is not allowed.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(parsed.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 CrispPDF/1.0 (+https://crisppdf.in/bot)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      if ((err as Error).name === "AbortError") {
        throw new Error("The page took too long to load (10s timeout).");
      }
      throw new Error("Could not fetch that URL.");
    }
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType && !/text\/html|application\/xhtml/i.test(contentType)) {
      throw new Error("The URL did not return an HTML page.");
    }
    const declaredLength = Number(res.headers.get("content-length") ?? "0");
    if (declaredLength > MAX_RESPONSE_BYTES) {
      throw new Error("The page is larger than the 5 MB limit.");
    }

    // Stream and cap read length.
    const reader = res.body?.getReader();
    if (!reader) throw new Error("Empty response body.");
    const decoder = new TextDecoder();
    let html = "";
    let readBytes = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      readBytes += value.byteLength;
      if (readBytes > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new Error("The page is larger than the 5 MB limit.");
      }
      html += decoder.decode(value, { stream: true });
    }
    html += decoder.decode();

    // HTML → readable text pipeline (no headless browser on Workers).
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = (titleMatch?.[1] ?? parsed.hostname).trim().slice(0, 200);
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/(p|div|h[1-6]|li|tr|br)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (text.length > MAX_PDF_CHARS) text = text.slice(0, MAX_PDF_CHARS) + "\n\n[Content truncated]";

    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    pdf.setTitle(title);
    pdf.setSubject(parsed.toString());
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 56;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 14;

    let page = pdf.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    page.drawText(title, { x: margin, y, size: 18, font: fontBold, color: rgb(0.1, 0.1, 0.15) });
    y -= 24;
    page.drawText(parsed.toString(), { x: margin, y, size: 9, font, color: rgb(0.4, 0.4, 0.5) });
    y -= 24;

    const wrap = (line: string): string[] => {
      const words = line.split(/\s+/);
      const out: string[] = [];
      let cur = "";
      for (const w of words) {
        const test = cur ? cur + " " + w : w;
        if (font.widthOfTextAtSize(test, 10) > maxWidth) {
          if (cur) out.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      }
      if (cur) out.push(cur);
      return out;
    };

    for (const raw of text.split("\n")) {
      const lines = raw.trim() ? wrap(raw.trim()) : [""];
      for (const line of lines) {
        if (y < margin) {
          page = pdf.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, { x: margin, y, size: 10, font, color: rgb(0.15, 0.15, 0.2) });
        y -= lineHeight;
      }
    }

    const bytes = await pdf.save();
    // Server functions must return JSON-serializable data; encode as base64.
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return { base64: btoa(binary), title };
  });
