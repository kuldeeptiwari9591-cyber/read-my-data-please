import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/base64-pdf")({
  head: () => buildToolHead("base64-pdf"),
  component: () => <ToolPageView slug="base64-pdf" />,
});
