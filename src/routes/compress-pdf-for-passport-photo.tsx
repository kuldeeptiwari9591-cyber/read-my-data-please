import { createFileRoute } from "@tanstack/react-router";
import { UseCaseView, useCaseHead } from "@/components/seo/UseCaseView";

export const Route = createFileRoute("/compress-pdf-for-passport-photo")({
  head: () => useCaseHead("passport-photo"),
  component: () => <UseCaseView slug="passport-photo" />,
});
