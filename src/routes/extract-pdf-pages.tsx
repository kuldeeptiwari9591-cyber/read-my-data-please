import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/extract-pdf-pages")({
  head: () => buildToolHead("extract-pdf-pages"),
  component: () => <ToolPageView slug="extract-pdf-pages" />,
});
