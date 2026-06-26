import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/pdf-to-png")({
  head: () => buildToolHead("pdf-to-png"),
  component: () => <ToolPageView slug="pdf-to-png" />,
});
