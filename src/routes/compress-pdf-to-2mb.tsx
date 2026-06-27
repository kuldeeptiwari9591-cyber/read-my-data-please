import { createFileRoute } from "@tanstack/react-router";
import { SizeTargetView, sizeTargetHead } from "@/components/seo/SizeTargetView";

export const Route = createFileRoute("/compress-pdf-to-2mb")({
  head: () => sizeTargetHead("2mb"),
  component: () => <SizeTargetView slug="2mb" />,
});
