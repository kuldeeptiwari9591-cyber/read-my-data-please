import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/excel-to-pdf")({
  head: () => buildToolHead("excel-to-pdf"),
  component: () => <ToolPageView slug="excel-to-pdf" />,
});
