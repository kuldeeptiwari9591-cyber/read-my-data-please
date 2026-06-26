import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/invert-pdf")({
  head: () => buildToolHead("invert-pdf"),
  component: () => <ToolPageView slug="invert-pdf" />,
});
