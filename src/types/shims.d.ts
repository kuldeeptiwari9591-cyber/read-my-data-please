declare module "pdfkit/js/pdfkit.standalone.js" {
  const PDFDocument: new (options?: Record<string, unknown>) => {
    pipe<T>(stream: T): T;
    addPage(options?: Record<string, unknown>): unknown;
    image(src: string | ArrayBuffer | Uint8Array, x: number, y: number, options?: Record<string, unknown>): unknown;
    end(): void;
  };
  export default PDFDocument;
}

declare module "blob-stream" {
  interface BlobStream {
    on(event: "finish", cb: () => void): void;
    toBlob(type?: string): Blob;
  }
  const blobStream: () => BlobStream;
  export default blobStream;
}
