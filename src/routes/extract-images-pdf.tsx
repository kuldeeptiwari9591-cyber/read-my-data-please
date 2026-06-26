import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/extract-images-pdf")({
  head: () => buildToolHead("extract-images-pdf"),
  component: () => <ToolPageView slug="extract-images-pdf" />,
});
