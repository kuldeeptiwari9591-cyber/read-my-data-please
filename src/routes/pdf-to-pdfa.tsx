import { createFileRoute } from "@tanstack/react-router";
import { ToolPageView } from "@/components/ToolPageView";
import { buildToolHead } from "@/lib/tool-head";

export const Route = createFileRoute("/pdf-to-pdfa")({
  head: () => buildToolHead("pdf-to-pdfa"),
  component: () => <ToolPageView slug="pdf-to-pdfa" />,
});
