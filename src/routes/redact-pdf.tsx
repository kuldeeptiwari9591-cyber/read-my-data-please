import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/redact-pdf")({
  head: () => buildToolHead("redact-pdf"),
  component: () => <ToolPageView slug="redact-pdf" />,
});
