import { createFileRoute } from "@tanstack/react-router";
import { SizeTargetView, sizeTargetHead } from "@/components/seo/SizeTargetView";

export const Route = createFileRoute("/compress-pdf-to-300kb")({
  head: () => sizeTargetHead("300kb"),
  component: () => <SizeTargetView slug="300kb" />,
});
