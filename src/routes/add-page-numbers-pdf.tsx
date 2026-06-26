import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/add-page-numbers-pdf")({
  head: () => buildToolHead("add-page-numbers-pdf"),
  component: () => <ToolPageView slug="add-page-numbers-pdf" />,
});
