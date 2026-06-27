import { createFileRoute } from "@tanstack/react-router";
import { AliasFormatPage, aliasHead } from "@/components/seo/AliasFormatPage";

export const Route = createFileRoute("/csv-to-pdf")({
  head: () => aliasHead("csv-to-pdf"),
  component: () => <AliasFormatPage slug="csv-to-pdf" />,
});
