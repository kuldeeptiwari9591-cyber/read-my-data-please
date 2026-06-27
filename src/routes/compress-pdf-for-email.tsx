import { createFileRoute } from "@tanstack/react-router";
import { UseCaseView, useCaseHead } from "@/components/seo/UseCaseView";

export const Route = createFileRoute("/compress-pdf-for-email")({
  head: () => useCaseHead("email"),
  component: () => <UseCaseView slug="email" />,
});
