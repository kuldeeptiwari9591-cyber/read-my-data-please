import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: `/${params.slug}` as never,
      statusCode: 301,
      replace: true,
    });
  },
  component: () => null,
});
