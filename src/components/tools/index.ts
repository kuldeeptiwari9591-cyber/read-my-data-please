import type { ComponentType } from "react";
import { MergePdf } from "./MergePdf";
import { SplitPdf } from "./SplitPdf";
import { RotatePdf } from "./RotatePdf";
import { DeletePdfPages } from "./DeletePdfPages";
import { ExtractPdfPages } from "./ExtractPdfPages";
import { ReorderPdfPages } from "./ReorderPdfPages";
import { AddPageNumbersPdf } from "./AddPageNumbersPdf";
import { AddWatermarkTextPdf } from "./AddWatermarkTextPdf";
import { JpgToPdf } from "./JpgToPdf";

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "merge-pdf": MergePdf,
  "split-pdf": SplitPdf,
  "rotate-pdf": RotatePdf,
  "delete-pdf-pages": DeletePdfPages,
  "extract-pdf-pages": ExtractPdfPages,
  "reorder-pdf-pages": ReorderPdfPages,
  "add-page-numbers-pdf": AddPageNumbersPdf,
  "add-watermark-text-pdf": AddWatermarkTextPdf,
  "jpg-to-pdf": JpgToPdf,
};
