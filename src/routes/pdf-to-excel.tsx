import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/pdf-to-excel")({
  head: () => buildToolHead("pdf-to-excel"),
  component: () => <ToolPageView slug="pdf-to-excel" />,
});
