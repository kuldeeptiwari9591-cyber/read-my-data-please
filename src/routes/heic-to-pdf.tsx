import { createFileRoute } from "@tanstack/react-router";
import { AliasFormatPage, aliasHead } from "@/components/seo/AliasFormatPage";

export const Route = createFileRoute("/heic-to-pdf")({
  head: () => aliasHead("heic-to-pdf"),
  component: () => <AliasFormatPage slug="heic-to-pdf" />,
});
