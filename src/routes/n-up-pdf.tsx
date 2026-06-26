import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/n-up-pdf")({
  head: () => buildToolHead("n-up-pdf"),
  component: () => <ToolPageView slug="n-up-pdf" />,
});
