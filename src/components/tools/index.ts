import { lazy, type ComponentType } from "react";

const lazyDefault = <K extends string>(
  loader: () => Promise<Record<K, ComponentType>>,
  key: K,
) => lazy(async () => ({ default: (await loader())[key] }));

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "merge-pdf": lazyDefault(() => import("./MergePdf"), "MergePdf"),
  "split-pdf": lazyDefault(() => import("./SplitPdf"), "SplitPdf"),
  "rotate-pdf": lazyDefault(() => import("./RotatePdf"), "RotatePdf"),
  "delete-pdf-pages": lazyDefault(() => import("./DeletePdfPages"), "DeletePdfPages"),
  "extract-pdf-pages": lazyDefault(() => import("./ExtractPdfPages"), "ExtractPdfPages"),
  "reorder-pdf-pages": lazyDefault(() => import("./ReorderPdfPages"), "ReorderPdfPages"),
  "add-page-numbers-pdf": lazyDefault(() => import("./AddPageNumbersPdf"), "AddPageNumbersPdf"),
  "add-watermark-text-pdf": lazyDefault(() => import("./AddWatermarkTextPdf"), "AddWatermarkTextPdf"),
  "jpg-to-pdf": lazyDefault(() => import("./JpgToPdf"), "JpgToPdf"),
  "compress-pdf": lazyDefault(() => import("./CompressPdf"), "CompressPdf"),
  "pdf-to-jpg": lazyDefault(() => import("./PdfToImage"), "PdfToJpg"),
  "pdf-to-png": lazyDefault(() => import("./PdfToImage"), "PdfToPng"),
  "crop-pdf": lazyDefault(() => import("./CropPdf"), "CropPdf"),
  "repair-pdf": lazyDefault(() => import("./RepairPdf"), "RepairPdf"),
  "flatten-pdf": lazyDefault(() => import("./FlattenPdf"), "FlattenPdf"),
  "grayscale-pdf": lazyDefault(() => import("./GrayscalePdf"), "GrayscalePdf"),
  "unlock-pdf": lazyDefault(() => import("./UnlockPdf"), "UnlockPdf"),
  "watermark-pdf": lazyDefault(() => import("./WatermarkImagePdf"), "WatermarkImagePdf"),
  "extract-images-pdf": lazyDefault(() => import("./ExtractImagesPdf"), "ExtractImagesPdf"),
  "ocr-pdf": lazyDefault(() => import("./OcrPdf"), "OcrPdf"),
  "pdf-to-word": lazyDefault(() => import("./PdfToWord"), "PdfToWord"),
  "pdf-to-excel": lazyDefault(() => import("./PdfToExcel"), "PdfToExcel"),
  "pdf-to-ppt": lazyDefault(() => import("./PdfToPpt"), "PdfToPpt"),
  "word-to-pdf": lazyDefault(() => import("./WordToPdf"), "WordToPdf"),
  "excel-to-pdf": lazyDefault(() => import("./ExcelToPdf"), "ExcelToPdf"),
  "html-to-pdf": lazyDefault(() => import("./HtmlToPdf"), "HtmlToPdfTool"),
  "protect-pdf": lazyDefault(() => import("./ProtectPdf"), "ProtectPdf"),
  "esign-pdf": lazyDefault(() => import("./EsignPdf"), "EsignPdf"),
  "redact-pdf": lazyDefault(() => import("./RedactPdf"), "RedactPdf"),
  "pdf-to-pdfa": lazyDefault(() => import("./PdfToPdfA"), "PdfToPdfA"),
};
