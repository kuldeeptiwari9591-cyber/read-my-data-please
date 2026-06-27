export function ToolPageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-2 py-6">
      <div className="mb-6 flex gap-2">
        <div className="skeleton-shimmer h-4 w-16 rounded" />
        <div className="skeleton-shimmer h-4 w-4 rounded" />
        <div className="skeleton-shimmer h-4 w-24 rounded" />
      </div>
      <div className="skeleton-shimmer mb-3 h-9 w-2/3 rounded" />
      <div className="skeleton-shimmer mb-8 h-5 w-1/2 rounded" />
      <div className="skeleton-shimmer mb-6 h-48 w-full rounded-xl border-2 border-dashed border-border/60" />
      <div className="skeleton-shimmer mx-auto h-12 w-48 rounded-lg" />
    </div>
  );
}
