/**
 * Pre-renders the architecture deck to a clean, 16:9 landscape PDF.
 *
 * Runs as a Cloud Build step on the official Puppeteer image
 * (ghcr.io/puppeteer/puppeteer) which bundles Chromium. The PDF is written
 * next to the HTML under apps/presentation/public/architecture/, so the
 * presentation build (Vite copies public/ -> dist/) serves it at
 *   /architecture/agent-factory-assembly-line.pdf
 *
 * Page size + per-slide pagination come from the deck's own @media print /
 * @page CSS (1280x720), so the PDF matches the on-screen slides exactly.
 *
 * Local use: `node tools/print-deck.cjs` (requires a local puppeteer install).
 */
const path = require("path");
const puppeteer = require("puppeteer");

const DIR = path.resolve(__dirname, "..", "apps/presentation/public/architecture");
const HTML = path.join(DIR, "agent-factory-assembly-line.html");
const OUT = path.join(DIR, "agent-factory-assembly-line.pdf");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });
  try {
    const page = await browser.newPage();
    await page.goto("file://" + HTML, { waitUntil: "networkidle0", timeout: 90000 });
    // Make sure the web fonts have actually loaded before printing.
    try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch (_) {}
    await page.pdf({
      path: OUT,
      preferCSSPageSize: true, // honor the deck's @page { size:1280px 720px }
      printBackground: true,
    });
    console.log("wrote " + OUT);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error("print-deck failed:", err && err.message ? err.message : err);
  process.exit(1);
});
