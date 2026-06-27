import { createFileRoute } from "@tanstack/react-router";
import { SizeTargetView, sizeTargetHead } from "@/components/seo/SizeTargetView";

export const Route = createFileRoute("/compress-pdf-to-1mb")({
  head: () => sizeTargetHead("1mb"),
  component: () => <SizeTargetView slug="1mb" />,
});
