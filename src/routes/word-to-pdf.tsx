import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/word-to-pdf")({
  head: () => buildToolHead("word-to-pdf"),
  component: () => <ToolPageView slug="word-to-pdf" />,
});
