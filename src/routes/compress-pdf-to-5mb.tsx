import { createFileRoute } from "@tanstack/react-router";
import { SizeTargetView, sizeTargetHead } from "@/components/seo/SizeTargetView";

export const Route = createFileRoute("/compress-pdf-to-5mb")({
  head: () => sizeTargetHead("5mb"),
  component: () => <SizeTargetView slug="5mb" />,
});
