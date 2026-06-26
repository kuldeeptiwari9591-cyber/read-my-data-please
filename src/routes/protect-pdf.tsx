import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/protect-pdf")({
  head: () => buildToolHead("protect-pdf"),
  component: () => <ToolPageView slug="protect-pdf" />,
});
