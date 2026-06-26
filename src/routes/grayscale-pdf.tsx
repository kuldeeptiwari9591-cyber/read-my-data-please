import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/grayscale-pdf")({
  head: () => buildToolHead("grayscale-pdf"),
  component: () => <ToolPageView slug="grayscale-pdf" />,
});
