import { createFileRoute } from "@tanstack/react-router";
import { SizeTargetView, sizeTargetHead } from "@/components/seo/SizeTargetView";

export const Route = createFileRoute("/compress-pdf-to-200kb")({
  head: () => sizeTargetHead("200kb"),
  component: () => <SizeTargetView slug="200kb" />,
});
