import { createFileRoute } from "@tanstack/react-router";
import { SizeTargetView, sizeTargetHead } from "@/components/seo/SizeTargetView";

export const Route = createFileRoute("/compress-pdf-to-10mb")({
  head: () => sizeTargetHead("10mb"),
  component: () => <SizeTargetView slug="10mb" />,
});
