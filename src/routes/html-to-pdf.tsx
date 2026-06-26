import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/html-to-pdf")({
  head: () => buildToolHead("html-to-pdf"),
  component: () => <ToolPageView slug="html-to-pdf" />,
});
