import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/duplicate-pages-pdf")({
  head: () => buildToolHead("duplicate-pages-pdf"),
  component: () => <ToolPageView slug="duplicate-pages-pdf" />,
});
