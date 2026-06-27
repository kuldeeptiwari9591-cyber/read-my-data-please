import { createFileRoute } from "@tanstack/react-router";
import { UseCaseView, useCaseHead } from "@/components/seo/UseCaseView";

export const Route = createFileRoute("/compress-pdf-for-whatsapp")({
  head: () => useCaseHead("whatsapp"),
  component: () => <UseCaseView slug="whatsapp" />,
});
