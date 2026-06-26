import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/split-pdf")({
  head: () => buildToolHead("split-pdf"),
  component: () => <ToolPageView slug="split-pdf" />,
});
