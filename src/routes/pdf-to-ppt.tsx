import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/pdf-to-ppt")({
  head: () => buildToolHead("pdf-to-ppt"),
  component: () => <ToolPageView slug="pdf-to-ppt" />,
});
