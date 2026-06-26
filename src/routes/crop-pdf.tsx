import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/crop-pdf")({
  head: () => buildToolHead("crop-pdf"),
  component: () => <ToolPageView slug="crop-pdf" />,
});
