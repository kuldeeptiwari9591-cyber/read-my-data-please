import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/compress-pdf")({
  head: () => buildToolHead("compress-pdf"),
  component: () => <ToolPageView slug="compress-pdf" />,
});
