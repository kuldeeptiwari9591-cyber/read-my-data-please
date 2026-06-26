import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/jpg-to-pdf")({
  head: () => buildToolHead("jpg-to-pdf"),
  component: () => <ToolPageView slug="jpg-to-pdf" />,
});
