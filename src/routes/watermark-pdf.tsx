import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/watermark-pdf")({
  head: () => buildToolHead("watermark-pdf"),
  component: () => <ToolPageView slug="watermark-pdf" />,
});
