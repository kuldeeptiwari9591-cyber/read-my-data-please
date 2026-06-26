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
import { CompressPdf } from "./CompressPdf";
import { PdfToJpg, PdfToPng } from "./PdfToImage";
import { CropPdf } from "./CropPdf";
import { RepairPdf } from "./RepairPdf";
import { FlattenPdf } from "./FlattenPdf";
import { GrayscalePdf } from "./GrayscalePdf";
import { UnlockPdf } from "./UnlockPdf";
import { WatermarkImagePdf } from "./WatermarkImagePdf";
import { ExtractImagesPdf } from "./ExtractImagesPdf";

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
  "compress-pdf": CompressPdf,
  "pdf-to-jpg": PdfToJpg,
  "pdf-to-png": PdfToPng,
  "crop-pdf": CropPdf,
  "repair-pdf": RepairPdf,
  "flatten-pdf": FlattenPdf,
  "grayscale-pdf": GrayscalePdf,
  "unlock-pdf": UnlockPdf,
  "watermark-pdf": WatermarkImagePdf,
  "extract-images-pdf": ExtractImagesPdf,
};
