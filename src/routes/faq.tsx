import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { abs, OG_DEFAULT } from "@/lib/site-url";
import { hreflangLinks } from "@/lib/hreflang";

const CANONICAL = abs("/faq");
const TITLE = "FAQ — Frequently Asked Questions | CrispPDF";
const DESC =
  "Answers to the most common questions about CrispPDF PDF tools. Privacy, file safety, supported formats, limits, and more.";

interface FAQ { q: string; a: string }
interface Group { title: string; faqs: FAQ[] }

const GROUPS: Group[] = [
  {
    title: "About CrispPDF",
    faqs: [
      { q: "What is CrispPDF?", a: "CrispPDF is a free, privacy-first online PDF toolkit with 40 tools — merge, split, compress, convert, OCR, eSign, redact and more. 30 tools run entirely in your browser so your files never leave your device. The other 10 use stateless edge functions that hold files in memory for the duration of a single request and then discard them." },
      { q: "Who is CrispPDF for?", a: "Anyone who works with PDFs — students preparing assignments, professionals compressing contracts for email, government applicants hitting strict size limits, lawyers redacting sensitive documents, and developers extracting data. No account, no install, no payment required." },
      { q: "Is CrispPDF really 100% free?", a: "Yes. All 40 tools are free with no daily limits, no file count caps, no premium tier, and no watermarks on output. There is no Pro plan that unlocks features. Soft rate-limits exist only to prevent automated abuse and won't affect normal use." },
      { q: "How does CrispPDF stay free?", a: "It's currently funded out of pocket by the founders. Future revenue may come from an optional developer API and a self-hosted enterprise version. The free consumer tools at crisppdf.com will always remain free with no feature paywalls." },
      { q: "Why should I trust CrispPDF with my files?", a: "Because for 30 of 40 tools you don't have to — the file never leaves your browser. Open DevTools → Network tab while using Merge, Split, Compress, or Redact and you'll see zero upload requests. For server tools, files exist in RAM for one HTTP request and are gone before you can refresh the page." },
      { q: "Does CrispPDF require me to sign up?", a: "No. There is no account system for the public tools — every operation works anonymously. An account is only required if you opt into saving a history of past operations (a future feature). Without an account, nothing about your session is retained after you close the tab." },
      { q: "What browsers does CrispPDF support?", a: "Chrome, Edge, Firefox, Safari, Brave, Opera, and Arc on desktop (latest 2 major versions). Mobile Safari (iOS 14+) and Chrome on Android (last 3 years of devices). Older browsers without WebAssembly support won't work for OCR but most other tools degrade gracefully." },
      { q: "How is CrispPDF different from iLovePDF or Smallpdf?", a: "Three big differences: (1) every tool is free with no daily limits — they paywall most features. (2) 30 tools run in your browser so files never upload — their tools upload everything. (3) No accounts, no watermarks, no upsell popups. Trade-off: we don't yet have a desktop app or team workspace." },
    ],
  },
  {
    title: "Privacy & Security",
    faqs: [
      { q: "Does CrispPDF upload my files to the internet?", a: "For 30 of CrispPDF's 40 tools, no file ever leaves your device — all processing happens locally in your browser using JavaScript. For the 10 tools that require server processing (Office conversion, OCR on large scans, HTML to PDF), the file is sent over an encrypted HTTPS connection, processed in memory, and discarded. We never store uploaded files." },
      { q: "Where are my files processed?", a: "Browser-based tools process your file inside your browser's memory using pdf-lib and pdf.js. Server-based tools run on isolated edge functions that read the file into RAM, transform it, return the result, and free the memory. Neither path writes your file to a database, S3 bucket, or disk." },
      { q: "How long does CrispPDF keep my files?", a: "Browser tools never receive your file in the first place. Server tools hold the file in memory only for the duration of one HTTP request, typically a few seconds. After the response is sent, the buffer is released and the file is gone. We keep zero copies, zero backups, zero archives." },
      { q: "Can CrispPDF employees see my documents?", a: "No. The 30 browser-based tools physically cannot transmit your file to us. The 10 server tools process files in stateless functions — there is no admin dashboard, no S3 bucket, and no log line where staff could view file contents. We log only the tool slug, duration, and byte size." },
      { q: "Is CrispPDF safe for confidential legal documents?", a: "Yes. For sensitive legal work use browser-based tools like Merge, Split, Redact, Protect, eSign, and Watermark — the file stays on your device. Redact PDF permanently removes the underlying text, not just visually overlays it. For client confidentiality, avoid the server tools (OCR, Office conversion) when handling privileged material." },
      { q: "Is CrispPDF safe for medical records and health documents?", a: "Yes, when using browser-based tools the file never leaves your device, which meets the spirit of HIPAA's minimum-necessary principle. CrispPDF is not a HIPAA Business Associate, so do not use server-based tools (OCR, Office conversion) for PHI. Stick to Compress, Merge, Split, Protect, and Redact for medical files." },
      { q: "Is CrispPDF GDPR compliant?", a: "Yes. We process minimal personal data (only an anonymised hashed IP for rate limiting), publish a clear privacy policy, do not use advertising trackers, do not transfer data outside the EU for browser tools, and respond to data subject requests at hello@crisppdf.com. The browser-first architecture means most users generate no processable personal data at all." },
      { q: "Does CrispPDF use cookies to track me?", a: "We use one functional cookie to remember your theme (light/dark) and one to remember your language preference. We do not use any third-party advertising, marketing, or cross-site tracking cookies. Analytics is opt-in and respects Do Not Track." },
      { q: "Is CrispPDF compliant with India's DPDP Act?", a: "Yes. India's Digital Personal Data Protection Act 2023 requires lawful purpose, minimal data, and clear notice. CrispPDF's browser-first design means most operations generate no personal data at all. For server tools, files are processed transiently and deleted immediately. We do not transfer Indian user data outside India for browser tools." },
      { q: "What happens if I accidentally close the browser mid-processing?", a: "Nothing bad. Because processing is local, closing the tab simply cancels the operation — there is no half-uploaded file sitting on a server. Reopen the tool and start again. For server-based tools, the request is aborted and the in-flight file buffer is garbage-collected within seconds." },
    ],
  },
  {
    title: "File Compatibility",
    faqs: [
      { q: "What PDF versions does CrispPDF support?", a: "CrispPDF supports PDF 1.0 through PDF 2.0, including all common variants — PDF/A (archival), PDF/X (print), PDF/UA (accessibility), and tagged PDFs. We handle both the older Acrobat 4–11 specification and the newer ISO 32000-2 (2020) standard. Older PDF 1.0 and 1.1 files from the 1990s also work." },
      { q: "Does CrispPDF work with password-protected PDFs?", a: "Yes. Use the Unlock PDF tool if you know the password — it removes the encryption locally in your browser. If you don't know the password, we cannot help you (and neither can anyone else, ethically). To add a password, use Protect PDF. We support 40-bit RC4, 128-bit RC4, 128-bit AES, and 256-bit AES encryption." },
      { q: "Can CrispPDF process scanned PDFs?", a: "Yes. Scanned PDFs are image-based — you can compress, merge, split, rotate, and watermark them with browser tools. To make the text inside searchable or selectable, use OCR PDF, which runs Tesseract.js for small files in your browser or a server function for larger scans. OCR supports 100+ languages." },
      { q: "Does CrispPDF support PDF forms with fillable fields?", a: "Yes. Merge, Split, Rotate, and Compress preserve AcroForm and XFA fields. Flatten PDF converts fillable form fields into baked-in static content so reviewers cannot change them. To fill a form, open the PDF in your browser's built-in viewer and download the filled copy — then use CrispPDF tools on the result." },
      { q: "What image formats can CrispPDF convert to PDF?", a: "JPG/JPEG, PNG, WebP, HEIC/HEIF (iPhone photos), BMP, and TIFF can all be converted to PDF using JPG to PDF or the format-specific aliases (heic-to-pdf, webp-to-pdf, png-to-pdf). Multi-page TIFFs become multi-page PDFs. EXIF rotation is respected automatically." },
      { q: "Can CrispPDF process PDFs with embedded fonts?", a: "Yes. CrispPDF preserves all embedded fonts during merge, split, rotate, compress, watermark, and reorder operations. We never re-encode or substitute fonts, so the visual fidelity is identical. For PDF to Word conversion, fonts are mapped to the closest system equivalent in the output document." },
      { q: "Does CrispPDF support PDF/A files?", a: "Yes. PDF/A files can be processed by every tool. We also offer a dedicated PDF to PDF/A converter that turns regular PDFs into ISO 19005 compliant archival format with embedded fonts, no transparency, and no encryption — required by many government archives and legal e-filing systems." },
      { q: "What is the maximum number of pages CrispPDF can handle?", a: "There is no hard limit. We have processed PDFs with over 10,000 pages in the browser. Practical limits depend on your device's RAM — a phone may struggle past 500 pages, while a desktop with 16GB RAM comfortably handles 5,000+ page documents. Compress and Split work best for very large files." },
      { q: "Can CrispPDF process very large PDFs (over 100MB)?", a: "Yes, but browser tools become slower as the file grows because everything runs in your device's memory. For files over 100MB, expect 30–90 seconds of processing on a mid-range laptop. We recommend Split PDF first to break it into smaller chunks, then operate on each chunk separately." },
      { q: "Does CrispPDF work with right-to-left text (Arabic, Hebrew)?", a: "Yes. RTL text in Arabic, Hebrew, Persian, and Urdu is preserved correctly during merge, split, rotate, compress, watermark, and reorder operations because we never re-render the underlying text. For PDF to Word conversion, RTL direction is also preserved in the output document." },
    ],
  },
  {
    title: "Tool-Specific",
    faqs: [
      { q: "Why does my compressed PDF look blurry?", a: "Aggressive compression downsamples embedded images. If your PDF is image-heavy (scanned pages, photos), the 'Maximum' compression preset will reduce image DPI to ~72, which looks soft. Use 'Recommended' or 'Low' for sharper output, or set a target size (e.g. compress-pdf-to-1mb) and we'll pick the best quality that hits your target." },
      { q: "Why won't my PDF compress below a certain size?", a: "PDFs contain text streams, fonts, images, and metadata. Text and fonts are already efficiently encoded and cannot shrink much. If your PDF is mostly text, the minimum size is set by the font subset. If it is mostly images, removing or downsampling images is the only way to go smaller — try Extract Images and re-insert at lower DPI." },
      { q: "Can I merge more than 10 PDFs at once?", a: "Yes. There is no upper limit on the number of files in Merge PDF — we have tested with 200+ source PDFs. Drag and drop them all into the upload area, reorder by dragging the page thumbnails, and click Merge. Memory usage scales with total size, not file count, so 200 small PDFs work fine." },
      { q: "Will merging PDFs remove bookmarks and links?", a: "Internal page links and bookmarks within each source PDF are preserved in the merged output, but bookmarks from different source files are concatenated as separate top-level entries. External URL links remain clickable. If you need a unified table of contents, edit the merged PDF in a dedicated editor afterward." },
      { q: "Does OCR work on handwritten text?", a: "Tesseract.js (the engine behind CrispPDF's OCR) is trained on printed text and performs poorly on handwriting — expect 30–60% accuracy on neat handwriting and worse on messy writing. For printed text it achieves 95%+ accuracy. Use a specialised handwriting OCR service for cursive notes, not CrispPDF." },
      { q: "Which languages does CrispPDF's OCR support?", a: "OCR PDF supports 100+ languages including English, Hindi, Spanish, Portuguese, French, German, Chinese (Simplified and Traditional), Japanese, Korean, Arabic, Russian, Bengali, Tamil, Telugu, and Marathi. Auto-detection picks the language from the document. You can also force a specific language for mixed-script documents." },
      { q: "Is an eSignature from CrispPDF legally valid?", a: "An eSignature added with CrispPDF is a 'simple electronic signature', which is legally valid in the US (ESIGN Act), EU (eIDAS), UK, India (IT Act 2000), and most jurisdictions for everyday contracts. It is not a 'qualified electronic signature' — for notarised deeds or regulated financial documents you need a QES provider with identity verification." },
      { q: "Can I add multiple signatures to one PDF?", a: "Yes. eSign PDF supports placing as many signature instances as you need on any page. You can also use multiple distinct signatures (e.g. signer 1 and signer 2). Each placement can be dragged, resized, and removed independently. Save the signed file, then open it again to add a co-signer's signature." },
      { q: "Does redaction in CrispPDF permanently remove text?", a: "Yes. Redact PDF removes the underlying text stream, not just paints a black rectangle over it. Once you download the redacted file, the original text is gone — copy-paste, search, and forensic tools will find nothing under the redaction marks. This is true redaction, not visual masking." },
      { q: "What is the difference between Flatten PDF and Protect PDF?", a: "Flatten PDF converts interactive elements (form fields, annotations, signatures) into static content baked into the page — preventing edits to those specific elements. Protect PDF adds a password that prevents opening or modifying the document at all. Use Flatten before sharing forms; use Protect before sharing confidential files." },
      { q: "Can I undo changes after downloading a processed PDF?", a: "No. The original file on your device is untouched — CrispPDF generates a new file as output. Keep your original and re-run the tool with different settings if you need a different result. There is no version history because we don't store anything." },
      { q: "Does CrispPDF preserve hyperlinks when converting PDF to Word?", a: "Yes. URL hyperlinks and email links embedded in the source PDF are preserved as clickable links in the Word output. Internal cross-references (table of contents, footnotes) are converted to bookmarks where possible. Page-anchored hyperlinks may not survive if the page layout reflows significantly in Word." },
      { q: "Can I convert a multi-page PDF to individual JPG images?", a: "Yes. PDF to JPG outputs one JPG file per page, automatically packaged into a ZIP archive for download. Quality is configurable (72/150/300 DPI). For a single combined image use a separate merge tool after extracting. PDF to PNG works the same way and is better for screenshots with text." },
      { q: "Does watermarking affect text selectability in the PDF?", a: "No. Watermark PDF overlays the watermark as a separate semi-transparent layer above the page content. The underlying text remains fully selectable, searchable, and copyable. To make watermarked text uneditable, run the file through Flatten PDF after watermarking." },
      { q: "Can I add page numbers starting from a number other than 1?", a: "Yes. Add Page Numbers offers a 'Start at' field — set it to any number (useful when appending pages to an existing document or numbering Chapter 2 onward). You can also choose the position (top/bottom, left/center/right), format (1, i, I, a, A), and skip the cover page if needed." },
    ],
  },
  {
    title: "Technical & Browser",
    faqs: [
      { q: "Why is PDF processing slow on my device?", a: "Browser tools use your device's CPU and RAM, so performance depends on your hardware. A 100MB PDF on a 2018 phone may take a minute; the same file on a desktop takes 5 seconds. Close other tabs to free memory, prefer Chrome or Edge over Safari for very large files, and Split PDF first if you are stuck." },
      { q: "Does CrispPDF work on older iPhones?", a: "Yes, on any iPhone running iOS 14 or newer (released since 2020). Older iPhones with iOS 13 or below work for small files but may run out of memory on PDFs over 30MB because Safari aggressively limits per-tab RAM. iPhone 7 and earlier are not recommended for heavy use." },
      { q: "Can I use CrispPDF on a Chromebook?", a: "Yes. CrispPDF works perfectly on Chromebooks — open Chrome, navigate to crisppdf.com, and use any tool. There is no app to install. Processing uses the Chromebook's CPU, so older models may be slower with large files. Linux/Android Chromebook apps are not needed." },
      { q: "Does CrispPDF work on Firefox?", a: "Yes. Firefox 88 and newer fully support every CrispPDF feature including OCR via WebAssembly, drag-and-drop uploads, and large file processing. Firefox actually outperforms Chrome on some pdf-lib operations because of its more efficient WebAssembly runtime." },
      { q: "Why does my browser ask to download a file in a new tab?", a: "Some browsers (Safari especially) prevent silent downloads on first interaction. If you see a 'download this file?' prompt or the file opens in a new tab instead of saving, that is browser security policy, not a CrispPDF bug. Right-click the result and choose 'Save link as' or 'Download'." },
      { q: "Can I use CrispPDF offline after loading the page?", a: "Partially. Once a tool page has loaded, the browser-based tools (30 of 40) will continue to work even if you lose internet — the JavaScript is already in memory. Server-based tools (OCR, Office conversion) require an active connection. We do not currently offer an installable PWA." },
      { q: "Does CrispPDF have a mobile app?", a: "No, and intentionally. CrispPDF is built as a Progressive Web App that works in any mobile browser without installation, app store gatekeeping, or update prompts. Add the website to your home screen from Safari or Chrome for a one-tap launch experience that behaves like a native app." },
      { q: "Why does my ad blocker interfere with CrispPDF?", a: "Some aggressive ad blockers (uBlock Origin with custom lists, Brave Shields on strict) block the script that loads pdf.js worker files, which breaks the preview thumbnails. CrispPDF shows no ads, so safe-listing crisppdf.com costs you nothing and restores full functionality." },
      { q: "Does CrispPDF work with screen readers (accessibility)?", a: "Yes. CrispPDF follows WCAG 2.1 AA — all upload zones, buttons, and form controls have ARIA labels, all images have alt text, and the focus order is logical. We test with NVDA on Windows, VoiceOver on macOS and iOS, and TalkBack on Android. Report any issues to feedback@crisppdf.com." },
      { q: "Can I use CrispPDF via a keyboard only (no mouse)?", a: "Yes. Every interactive element is reachable by Tab, activatable by Enter or Space, and visibly focus-ringed. File uploads support the file picker via keyboard. Drag-to-reorder operations have keyboard equivalents (use the arrow keys after focusing a thumbnail to move it)." },
    ],
  },
  {
    title: "India-Specific",
    faqs: [
      { q: "What is the password for Aadhaar PDF?", a: "The password for an Aadhaar e-PDF downloaded from UIDAI is the first 4 letters of your name in CAPITAL letters followed by your year of birth in YYYY format. Example: if your name is Ramesh and you were born in 1990, the password is RAME1990. Use Unlock PDF to remove it permanently." },
      { q: "What is the password for PAN card PDF?", a: "The password for an e-PAN PDF from NSDL or UTIITSL is your date of birth in DDMMYYYY format (no spaces or slashes). Example: for a date of birth of 5 March 1995, the password is 05031995. CrispPDF's Unlock PDF removes this password locally in your browser." },
      { q: "What size PDF does UPSC require for application forms?", a: "UPSC online applications require photos under 300 KB and signatures under 20 KB, both as JPG. PDF documents (certificates, mark sheets) typically need to be under 2 MB and 300 DPI. Use CrispPDF's Compress PDF with a target size (compress-pdf-to-2mb) to hit UPSC's requirements without quality loss." },
      { q: "How do I compress a PDF for a government portal that rejects files over 100KB?", a: "Use CrispPDF's dedicated /compress-pdf-to-100kb page. It automatically selects the maximum compression preset and image downsampling needed to hit 100 KB while keeping text legible. For scanned documents that won't shrink that small, use Split PDF first and upload each page separately." },
      { q: "Can I use CrispPDF to convert passport photos to PDF for online applications?", a: "Yes. Use JPG to PDF or HEIC to PDF (for iPhone photos) to convert your passport photo. For Indian government forms requiring a specific photo size in KB, follow up with Compress PDF using a target like 50 KB or 100 KB. We have a dedicated guide at /compress-pdf-for-passport-photo." },
    ],
  },
];

const ALL_FAQS: FAQ[] = GROUPS.flatMap((g) => g.faqs);

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_DEFAULT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_DEFAULT },
    ],
    links: [{ rel: "canonical", href: CANONICAL }, ...hreflangLinks("/faq")],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "FAQPage",
              mainEntity: ALL_FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable='true']"] },
          ],
        }),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <header>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-3 text-base text-muted-foreground">50 deep answers about how CrispPDF works, what's safe, what's supported, and what's specific to India.</p>
        </header>

        <div className="mt-12 space-y-10">
          {GROUPS.map((g) => (
            <section key={g.title}>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">{g.title}</h2>
              <Accordion type="single" collapsible className="mt-4 rounded-2xl border border-border bg-surface/40 px-4">
                {g.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`${g.title}-${i}`} className="border-border last:border-0">
                    <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground" data-speakable="true">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
