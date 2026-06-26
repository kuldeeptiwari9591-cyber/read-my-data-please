import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  url: z.string().url().max(2048),
});

export const htmlToPdf = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const res = await fetch(data.url, {
      headers: { "User-Agent": "Mozilla/5.0 CrispPDF/1.0" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const html = await res.text();

    // Very small HTML → readable text pipeline (no headless browser on Workers).
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = (titleMatch?.[1] ?? data.url).trim().slice(0, 200);
    const text = html
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

    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    pdf.setTitle(title);
    pdf.setSubject(data.url);
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
    page.drawText(data.url, { x: margin, y, size: 9, font, color: rgb(0.4, 0.4, 0.5) });
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
