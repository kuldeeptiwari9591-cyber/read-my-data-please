import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/edit-metadata-pdf")({
  head: () => buildToolHead("edit-metadata-pdf"),
  component: () => <ToolPageView slug="edit-metadata-pdf" />,
});
