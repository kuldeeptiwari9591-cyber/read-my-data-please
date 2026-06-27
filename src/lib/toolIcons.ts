import {
  GitMerge, Scissors, Minimize2, RotateCw, GripVertical,
  Trash2, FileOutput, Maximize2, LayoutGrid, FilePlus,
  Copy, ArrowLeftRight, FileText, Table, Image, Globe,
  FileDown, BarChart2, MonitorPlay, ImageDown, FileImage,
  AlignLeft, Code2, Crop, Wrench, Contrast, PenTool,
  Stamp, ScanLine, Hash, Type, Images, SunMoon,
  FileEdit, GitCompare, Layers, Archive, Lock, Unlock, EyeOff,
  type LucideIcon,
} from "lucide-react";
import type { ToolCategory } from "@/lib/tools";

export const toolIconMap: Record<string, LucideIcon> = {
  "merge-pdf": GitMerge,
  "split-pdf": Scissors,
  "compress-pdf": Minimize2,
  "rotate-pdf": RotateCw,
  "reorder-pdf-pages": GripVertical,
  "delete-pdf-pages": Trash2,
  "extract-pdf-pages": FileOutput,
  "resize-pdf": Maximize2,
  "n-up-pdf": LayoutGrid,
  "blank-page-pdf": FilePlus,
  "duplicate-pages-pdf": Copy,
  "reverse-pdf": ArrowLeftRight,
  "word-to-pdf": FileText,
  "excel-to-pdf": Table,
  "jpg-to-pdf": Image,
  "html-to-pdf": Globe,
  "pdf-to-word": FileDown,
  "pdf-to-excel": BarChart2,
  "pdf-to-ppt": MonitorPlay,
  "pdf-to-jpg": ImageDown,
  "pdf-to-png": FileImage,
  "extract-text-pdf": AlignLeft,
  "base64-pdf": Code2,
  "crop-pdf": Crop,
  "repair-pdf": Wrench,
  "grayscale-pdf": Contrast,
  "esign-pdf": PenTool,
  "watermark-pdf": Stamp,
  "ocr-pdf": ScanLine,
  "add-page-numbers-pdf": Hash,
  "add-watermark-text-pdf": Type,
  "extract-images-pdf": Images,
  "invert-pdf": SunMoon,
  "edit-metadata-pdf": FileEdit,
  "compare-pdf": GitCompare,
  "flatten-pdf": Layers,
  "pdf-to-pdfa": Archive,
  "protect-pdf": Lock,
  "unlock-pdf": Unlock,
  "redact-pdf": EyeOff,
};

export const categoryColorMap: Record<ToolCategory, string> = {
  organize: "text-indigo-400",
  "convert-to": "text-emerald-400",
  "convert-from": "text-sky-400",
  edit: "text-violet-400",
  secure: "text-amber-400",
};

export function iconForSlug(slug: string): LucideIcon | undefined {
  return toolIconMap[slug];
}
