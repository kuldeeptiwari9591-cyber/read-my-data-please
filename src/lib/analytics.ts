// GA4 + custom event helpers. Activates automatically when VITE_GA4_ID is set.
// When unset, every function is a no-op — never throws, never logs.

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const fn = (window as unknown as { gtag?: GtagFn }).gtag;
  if (typeof fn === "function") fn(...args);
}

export const analytics = {
  toolView: (toolName: string, category: string) =>
    gtag("event", "tool_view", { tool_name: toolName, tool_category: category }),

  fileUpload: (toolName: string, fileSize: number) =>
    gtag("event", "file_upload", { tool_name: toolName, file_size_bytes: fileSize }),

  toolComplete: (toolName: string, fileSizeIn: number, fileSizeOut: number, ms: number) =>
    gtag("event", "tool_complete", {
      tool_name: toolName,
      file_size_in: fileSizeIn,
      file_size_out: fileSizeOut,
      processing_ms: ms,
    }),

  toolError: (toolName: string, errorType: string) =>
    gtag("event", "tool_error", { tool_name: toolName, error_type: errorType }),

  shareClick: (toolName: string, platform: string) =>
    gtag("event", "share_click", { tool_name: toolName, share_platform: platform }),

  pageView: (path: string) => gtag("event", "page_view", { page_path: path }),
};
