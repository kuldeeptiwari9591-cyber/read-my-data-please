import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/reverse-pdf")({
  head: () => buildToolHead("reverse-pdf"),
  component: () => <ToolPageView slug="reverse-pdf" />,
});
