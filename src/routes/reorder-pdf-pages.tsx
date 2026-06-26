import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/reorder-pdf-pages")({
  head: () => buildToolHead("reorder-pdf-pages"),
  component: () => <ToolPageView slug="reorder-pdf-pages" />,
});
