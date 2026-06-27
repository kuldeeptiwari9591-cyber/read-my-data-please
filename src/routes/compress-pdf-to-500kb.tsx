import { createFileRoute } from "@tanstack/react-router";
import { SizeTargetView, sizeTargetHead } from "@/components/seo/SizeTargetView";

export const Route = createFileRoute("/compress-pdf-to-500kb")({
  head: () => sizeTargetHead("500kb"),
  component: () => <SizeTargetView slug="500kb" />,
});
