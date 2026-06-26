import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/extract-text-pdf")({
  head: () => buildToolHead("extract-text-pdf"),
  component: () => <ToolPageView slug="extract-text-pdf" />,
});
