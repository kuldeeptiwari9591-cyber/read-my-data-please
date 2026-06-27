import { createFileRoute } from "@tanstack/react-router";
import { AliasFormatPage, aliasHead } from "@/components/seo/AliasFormatPage";

export const Route = createFileRoute("/txt-to-pdf")({
  head: () => aliasHead("txt-to-pdf"),
  component: () => <AliasFormatPage slug="txt-to-pdf" />,
});
