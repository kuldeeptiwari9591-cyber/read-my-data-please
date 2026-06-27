import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/about-crisppdf")({
  beforeLoad: () => {
    throw redirect({ to: "/why-crisppdf", statusCode: 301 });
  },
  component: () => null,
});
