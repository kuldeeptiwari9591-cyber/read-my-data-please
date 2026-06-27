import { createFileRoute } from "@tanstack/react-router";
import { AliasFormatPage, aliasHead } from "@/components/seo/AliasFormatPage";

export const Route = createFileRoute("/png-to-pdf")({
  head: () => aliasHead("png-to-pdf"),
  component: () => <AliasFormatPage slug="png-to-pdf" />,
});
