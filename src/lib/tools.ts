import type { LucideIcon } from "lucide-react";
import {
  Combine,
  Scissors,
  Minimize2,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  FileImage,
  FileType,
  FileCode2,
  Globe,
  RotateCw,
  ArrowUpDown,
  Trash2,
  Copy,
  Crop,
  Wrench,
  Layers,
  ShieldCheck,
  Palette,
  Lock,
  Unlock,
  EyeOff,
  PenLine,
  Stamp,
  ScanText,
  Hash,
  Type,
  Images,
} from "lucide-react";

export type ToolCategory =
  | "organize"
  | "convert-from"
  | "convert-to"
  | "edit"
  | "secure";

export interface Tool {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  processing: "browser" | "server";
  status: "ready" | "soon";
}

export function toolMatches(t: Tool, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  return (
    t.name.toLowerCase().includes(q) ||
    t.short.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.slug.includes(q) ||
    t.category.includes(q)
  );
}

export const CATEGORY_META: Record<
  ToolCategory,
  { label: string; blurb: string }
> = {
  organize: {
    label: "Organize",
    blurb: "Merge, split, rotate, reorder — get your pages in order.",
  },
  "convert-to": {
    label: "Convert to PDF",
    blurb: "Turn Word, Excel, images, and the web into clean PDFs.",
  },
  "convert-from": {
    label: "Convert from PDF",
    blurb: "Export your PDF to Word, Excel, JPG, PNG, and more.",
  },
  edit: {
    label: "Edit",
    blurb: "Crop, watermark, page numbers, signatures, OCR.",
  },
  secure: {
    label: "Secure",
    blurb: "Protect, unlock, redact, flatten — privacy-first.",
  },
};

export const TOOLS: Tool[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    short: "Combine PDFs",
    description: "Combine multiple PDF files into a single document in seconds.",
    category: "organize",
    icon: Combine,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    short: "Split into parts",
    description: "Split a PDF into separate files by page ranges or individual pages.",
    category: "organize",
    icon: Scissors,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    short: "Shrink size",
    description: "Reduce PDF file size while keeping quality crisp.",
    category: "organize",
    icon: Minimize2,
    processing: "server",
    status: "soon",
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    short: "Editable .docx",
    description: "Convert PDF to an editable Word document with layout preserved.",
    category: "convert-from",
    icon: FileText,
    processing: "server",
    status: "soon",
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    short: "Spreadsheets",
    description: "Extract tables from PDF into a fully editable Excel sheet.",
    category: "convert-from",
    icon: FileSpreadsheet,
    processing: "server",
    status: "soon",
  },
  {
    slug: "pdf-to-ppt",
    name: "PDF to PowerPoint",
    short: "Slide decks",
    description: "Convert PDF pages into editable PowerPoint slides.",
    category: "convert-from",
    icon: Presentation,
    processing: "server",
    status: "soon",
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    short: "Pages → images",
    description: "Render each PDF page as a high-quality JPG image.",
    category: "convert-from",
    icon: ImageIcon,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "pdf-to-png",
    name: "PDF to PNG",
    short: "Lossless images",
    description: "Render each PDF page as a transparent-friendly PNG.",
    category: "convert-from",
    icon: FileImage,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    short: ".docx → PDF",
    description: "Turn Word documents into pixel-perfect PDFs.",
    category: "convert-to",
    icon: FileType,
    processing: "server",
    status: "soon",
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    short: ".xlsx → PDF",
    description: "Export spreadsheets to clean print-ready PDFs.",
    category: "convert-to",
    icon: FileSpreadsheet,
    processing: "server",
    status: "soon",
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    short: "Images → PDF",
    description: "Combine JPG images into a single sharable PDF.",
    category: "convert-to",
    icon: FileImage,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    short: "Webpage → PDF",
    description: "Render any URL or HTML snippet as a crisp PDF.",
    category: "convert-to",
    icon: Globe,
    processing: "server",
    status: "soon",
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    short: "Fix orientation",
    description: "Rotate pages 90°, 180°, or 270° and save instantly.",
    category: "organize",
    icon: RotateCw,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "reorder-pdf-pages",
    name: "Reorder Pages",
    short: "Drag & drop",
    description: "Rearrange pages visually with drag and drop thumbnails.",
    category: "organize",
    icon: ArrowUpDown,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "delete-pdf-pages",
    name: "Delete Pages",
    short: "Remove pages",
    description: "Remove unwanted pages from your PDF in one click.",
    category: "organize",
    icon: Trash2,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract Pages",
    short: "Pull pages",
    description: "Pull selected pages out of a PDF into a new document.",
    category: "organize",
    icon: Copy,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    short: "Trim margins",
    description: "Crop margins or focus areas on each PDF page.",
    category: "edit",
    icon: Crop,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "repair-pdf",
    name: "Repair PDF",
    short: "Fix corruption",
    description: "Attempt to recover damaged or partially corrupted PDFs.",
    category: "edit",
    icon: Wrench,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "flatten-pdf",
    name: "Flatten PDF",
    short: "Lock annotations",
    description: "Bake forms, signatures, and annotations into the page.",
    category: "secure",
    icon: Layers,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    short: "Archive format",
    description: "Convert to PDF/A for long-term archival compliance.",
    category: "secure",
    icon: ShieldCheck,
    processing: "server",
    status: "soon",
  },
  {
    slug: "grayscale-pdf",
    name: "Grayscale PDF",
    short: "Black & white",
    description: "Convert color PDFs to grayscale for print savings.",
    category: "edit",
    icon: Palette,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    short: "Add password",
    description: "Encrypt your PDF with a password and permission flags.",
    category: "secure",
    icon: Lock,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    short: "Remove password",
    description: "Remove password protection from a PDF you own.",
    category: "secure",
    icon: Unlock,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "redact-pdf",
    name: "Redact PDF",
    short: "Black out info",
    description: "Permanently black out sensitive text and images.",
    category: "secure",
    icon: EyeOff,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "esign-pdf",
    name: "eSign PDF",
    short: "Sign documents",
    description: "Draw, type, or upload a signature and place it anywhere.",
    category: "edit",
    icon: PenLine,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    short: "Image watermark",
    description: "Stamp an image watermark across every page.",
    category: "edit",
    icon: Stamp,
    processing: "browser",
    status: "soon",
  },
  {
    slug: "ocr-pdf",
    name: "OCR PDF",
    short: "Make searchable",
    description: "Run OCR on scanned PDFs to make them searchable and selectable.",
    category: "edit",
    icon: ScanText,
    processing: "server",
    status: "soon",
  },
  {
    slug: "add-page-numbers-pdf",
    name: "Add Page Numbers",
    short: "Number pages",
    description: "Insert customizable page numbers across your PDF.",
    category: "edit",
    icon: Hash,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "add-watermark-text-pdf",
    name: "Add Watermark Text",
    short: "Text watermark",
    description: "Add a diagonal text watermark to every page.",
    category: "edit",
    icon: Type,
    processing: "browser",
    status: "ready",
  },
  {
    slug: "extract-images-pdf",
    name: "Extract Images",
    short: "Save images",
    description: "Pull every embedded image out of a PDF as a zip.",
    category: "edit",
    icon: Images,
    processing: "browser",
    status: "soon",
  },
];

export const TOOLS_BY_SLUG: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
);

export function toolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}
