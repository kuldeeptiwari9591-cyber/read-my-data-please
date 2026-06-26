import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/add-watermark-text-pdf")({
  head: () => buildToolHead("add-watermark-text-pdf"),
  component: () => <ToolPageView slug="add-watermark-text-pdf" />,
});
