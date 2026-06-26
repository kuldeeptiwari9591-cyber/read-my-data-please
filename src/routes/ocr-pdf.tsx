import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/ocr-pdf")({
  head: () => buildToolHead("ocr-pdf"),
  component: () => <ToolPageView slug="ocr-pdf" />,
});
