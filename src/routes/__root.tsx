import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

import { Toaster } from "../components/ui/sonner";
import { CookieBanner } from "../components/CookieBanner";
import { SiteBanner } from "../components/SiteBanner";
import { MaintenanceGate } from "../components/MaintenanceGate";
import { Logo } from "../components/Logo";
const logoAsset = { url: "/crisppdf-logo.png" };
import { OG_DEFAULT } from "../lib/site-url";
import { organizationLd, websiteLd } from "../lib/seo/jsonld";
import { initPostHog } from "../lib/posthog";
import { initSentry } from "../lib/sentry";
import { startWebVitals } from "../lib/web-vitals";
import { startAxeAudit } from "../lib/a11y-dev";


function NotFoundComponent() {
  const quick = [
    { slug: "compress-pdf", name: "Compress PDF" },
    { slug: "merge-pdf", name: "Merge PDF" },
    { slug: "pdf-to-word", name: "PDF to Word" },
    { slug: "esign-pdf", name: "eSign PDF" },
  ];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 py-16 text-center">
      <h1
        className="font-display font-bold leading-none"
        style={{
          fontSize: "clamp(96px, 18vw, 144px)",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </h1>
      <div className="float-icon">
        <Logo size={56} withText={false} />
      </div>
      <h2 className="font-display text-2xl font-semibold text-foreground">
        This page got lost in the cloud.
      </h2>
      <p className="max-w-md text-base text-muted-foreground">
        The tool you're looking for might have moved or never existed.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Back to Homepage
        </Link>
        <Link
          to="/"
          hash="tools"
          className="rounded-lg border border-border bg-surface/40 px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/60"
        >
          Browse All Tools
        </Link>
      </div>
      <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
        {quick.map((q) => (
          <Link
            key={q.slug}
            to={("/" + q.slug) as never}
            className="rounded-lg border border-border bg-surface/40 px-4 py-3 text-sm font-medium transition-colors hover:border-primary/60"
          >
            {q.name}
          </Link>
        ))}
      </div>
      <style>{`
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .float-icon { animation: floaty 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .float-icon { animation: none; } }
      `}</style>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-primary"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "google-site-verification",
        content: "TrimKeUgP8gQUpomFVv6ApyFZD7Z3oyEcol8Y0FkdRs",
      },
      { title: "CrispPDF — 40 Free Online PDF Tools" },
      {
        name: "description",
        content:
          "Every PDF tool you need. Free, crisp, and fast. Merge, split, compress, convert, sign, and protect PDFs — no signup, no watermarks.",
      },
      { name: "author", content: "CrispPDF" },
      { property: "og:title", content: "CrispPDF — 40 Free Online PDF Tools" },
      {
        property: "og:description",
        content:
          "Every PDF tool you need. Free, crisp, and fast. No signup, no watermarks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: OG_DEFAULT },
      { name: "twitter:image", content: OG_DEFAULT },
      { name: "theme-color", content: "#0A0A0F" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: logoAsset.url },
      { rel: "apple-touch-icon", href: logoAsset.url },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationLd()) },
      { type: "application/ld+json", children: JSON.stringify(websiteLd()) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // SSR renders light theme; client applies stored preference pre-paint via
  // the inline script below to prevent a flash.
  const themeBootstrap = `(function(){try{var t=localStorage.getItem('crisppdf-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;
  const gaId =
    (import.meta.env.VITE_GA4_ID as string | undefined) || "G-0YDJKTV4F2";
  const gaBootstrap = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true,page_path:window.location.pathname});`;
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: gaBootstrap! }} />
          </>
        )}
      </head>
      <body className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    initSentry();
    initPostHog();
    startWebVitals();
    void startAxeAudit();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteBanner />
      <MaintenanceGate>
        <Outlet />
      </MaintenanceGate>
      <Toaster />
      <CookieBanner />
    </QueryClientProvider>
  );
}
