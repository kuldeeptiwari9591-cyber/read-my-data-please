import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/repair-pdf")({
  head: () => buildToolHead("repair-pdf"),
  component: () => <ToolPageView slug="repair-pdf" />,
});
