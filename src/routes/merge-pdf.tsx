import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/merge-pdf")({
  head: () => buildToolHead("merge-pdf"),
  component: () => <ToolPageView slug="merge-pdf" />,
});
