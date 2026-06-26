import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/esign-pdf")({
  head: () => buildToolHead("esign-pdf"),
  component: () => <ToolPageView slug="esign-pdf" />,
});
