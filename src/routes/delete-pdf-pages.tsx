import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/delete-pdf-pages")({
  head: () => buildToolHead("delete-pdf-pages"),
  component: () => <ToolPageView slug="delete-pdf-pages" />,
});
