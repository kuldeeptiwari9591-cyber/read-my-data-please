import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/unlock-pdf")({
  head: () => buildToolHead("unlock-pdf"),
  component: () => <ToolPageView slug="unlock-pdf" />,
});
