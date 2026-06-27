import { createFileRoute } from "@tanstack/react-router";
import { SizeTargetView, sizeTargetHead } from "@/components/seo/SizeTargetView";

export const Route = createFileRoute("/compress-pdf-to-100kb")({
  head: () => sizeTargetHead("100kb"),
  component: () => <SizeTargetView slug="100kb" />,
});
