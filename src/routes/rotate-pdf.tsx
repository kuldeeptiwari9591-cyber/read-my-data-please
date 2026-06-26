import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/rotate-pdf")({
  head: () => buildToolHead("rotate-pdf"),
  component: () => <ToolPageView slug="rotate-pdf" />,
});
