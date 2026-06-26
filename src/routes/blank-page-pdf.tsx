import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/blank-page-pdf")({
  head: () => buildToolHead("blank-page-pdf"),
  component: () => <ToolPageView slug="blank-page-pdf" />,
});
