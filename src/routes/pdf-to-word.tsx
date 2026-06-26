import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/pdf-to-word")({
  head: () => buildToolHead("pdf-to-word"),
  component: () => <ToolPageView slug="pdf-to-word" />,
});
