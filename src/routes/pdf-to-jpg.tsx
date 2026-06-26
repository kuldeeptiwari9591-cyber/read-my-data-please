import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/pdf-to-jpg")({
  head: () => buildToolHead("pdf-to-jpg"),
  component: () => <ToolPageView slug="pdf-to-jpg" />,
});
