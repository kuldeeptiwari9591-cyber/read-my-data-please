import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/flatten-pdf")({
  head: () => buildToolHead("flatten-pdf"),
  component: () => <ToolPageView slug="flatten-pdf" />,
});
