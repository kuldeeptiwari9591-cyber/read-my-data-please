import { createFileRoute } from "@tanstack/react-router";
import { AliasFormatPage, aliasHead } from "@/components/seo/AliasFormatPage";

export const Route = createFileRoute("/webp-to-pdf")({
  head: () => aliasHead("webp-to-pdf"),
  component: () => <AliasFormatPage slug="webp-to-pdf" />,
});
