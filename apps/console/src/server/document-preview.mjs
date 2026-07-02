/**
 * Server-side document text extraction for interview BRD grounding.
 *
 * Adapted from the pixelpitch daemon (apps/daemon/src/document-preview.ts):
 * - plain text formats (txt/md/csv/json/…) are decoded directly (no deps)
 * - PDF via the `pdftotext` system binary (graceful if absent)
 * - docx/pptx/xlsx via an OPTIONAL JSZip import (graceful if the dep is absent)
 *
 * The XXE / zip-bomb / size guards are preserved. Output is plain extracted text
 * (plus light section structure) used to ground the interview, never executed.
 */
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

const MAX_COMPRESSED_PREVIEW_BYTES = 10 * 1024 * 1024;
const MAX_UNCOMPRESSED_PREVIEW_BYTES = 50 * 1024 * 1024;
const MAX_XML_ENTRY_BYTES = 5 * 1024 * 1024;
/** Hard cap on extracted text we return / persist (keeps grounding bounded). */
export const MAX_EXTRACT_CHARS = 200_000;

const TEXT_EXTENSIONS = new Set([
  "txt", "text", "md", "markdown", "mdx", "csv", "tsv", "json", "jsonl",
  "yaml", "yml", "log", "rst", "org", "html", "htm", "xml", "ini", "conf", "cfg",
]);

export function kindForName(name) {
  const ext = String(name || "").toLowerCase().split(".").pop() || "";
  if (ext === "pdf") return "pdf";
  if (ext === "docx") return "document";
  if (ext === "pptx") return "presentation";
  if (ext === "xlsx") return "spreadsheet";
  if (TEXT_EXTENSIONS.has(ext)) return "text";
  return "unknown";
}

/**
 * @param {{ name: string, buffer: Buffer }} file
 * @returns {Promise<{ kind: string, title: string, text: string, sections: Array<{title:string,lines:string[]}>, truncated: boolean, charCount: number, note?: string }>}
 */
export async function extractDocument(file) {
  const kind = kindForName(file.name);
  const title = path.basename(file.name);

  let sections;
  let note;
  if (kind === "text") {
    sections = [{ title, lines: decodeText(file.buffer).split(/\r?\n/) }];
  } else if (kind === "pdf") {
    sections = await previewPdf(file.buffer);
  } else if (kind === "document" || kind === "presentation" || kind === "spreadsheet") {
    const result = await previewOoxml(kind, title, file.buffer);
    sections = result.sections;
    note = result.note;
  } else {
    const err = new Error(`unsupported document type: ${file.name}`);
    err.statusCode = 415;
    throw err;
  }

  const text = sectionsToText(sections);
  const truncated = text.length > MAX_EXTRACT_CHARS;
  const clipped = truncated ? text.slice(0, MAX_EXTRACT_CHARS) : text;
  return { kind, title, text: clipped, sections, truncated, charCount: clipped.length, note };
}

function decodeText(buffer) {
  return buffer.toString("utf8");
}

function sectionsToText(sections) {
  return sections
    .map((s) => {
      const body = (s.lines || []).filter((l) => l && l.trim()).join("\n");
      return sections.length > 1 ? `## ${s.title}\n${body}` : body;
    })
    .join("\n\n")
    .trim();
}

async function previewPdf(buffer) {
  assertPreviewInputSize(buffer.length);
  let tmpDir;
  try {
    tmpDir = await mkdtemp(path.join(tmpdir(), "ge-doc-"));
    const tmpFile = path.join(tmpDir, "input.pdf");
    await writeFile(tmpFile, buffer, { flag: "wx" });
    const { stdout } = await execFileP("pdftotext", ["-layout", tmpFile, "-"], {
      timeout: 8000,
      maxBuffer: 8 * 1024 * 1024,
    });
    const lines = stdout.split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.trim().length > 0);
    return [{ title: "PDF", lines: lines.length ? lines : ["No readable text found in the PDF."] }];
  } catch {
    return [
      {
        title: "PDF",
        lines: [
          "PDF text extraction is unavailable on this server (pdftotext not installed).",
          "Paste the relevant text directly, or upload a .txt/.md/.docx version.",
        ],
      },
    ];
  } finally {
    if (tmpDir) rm(tmpDir, { recursive: true, force: true }).catch((error) => console.warn(`[document-preview] temp dir cleanup failed (${tmpDir}): ${error?.message || error}`));
  }
}

async function previewOoxml(kind, title, buffer) {
  assertPreviewInputSize(buffer.length);
  let JSZip;
  try {
    ({ default: JSZip } = await import("jszip"));
  } catch {
    return {
      sections: [
        {
          title,
          lines: [
            "Office document parsing is unavailable on this server (jszip not installed).",
            "Paste the relevant text directly, or upload a .txt/.md version.",
          ],
        },
      ],
      note: "jszip-missing",
    };
  }
  const zip = await JSZip.loadAsync(buffer);
  assertZipPreviewSize(zip);
  if (kind === "document") return { sections: await previewDocx(zip) };
  if (kind === "presentation") return { sections: await previewPptx(zip) };
  return { sections: await previewXlsx(zip) };
}

async function previewDocx(zip) {
  const xml = await readZipText(zip, "word/document.xml");
  const paragraphs = Array.from(xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g))
    .map((m) => extractTextRuns(m[0]).join(" ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return [{ title: "Document", lines: paragraphs.length ? paragraphs : ["No readable text found."] }];
}

async function previewPptx(zip) {
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort(numericPathSort);
  const sections = [];
  for (let i = 0; i < slideNames.length; i++) {
    const xml = await readZipText(zip, slideNames[i]);
    const lines = extractTextRuns(xml);
    sections.push({ title: `Slide ${i + 1}`, lines: lines.length ? lines : ["No readable text found."] });
  }
  return sections.length ? sections : [{ title: "Presentation", lines: ["No readable slides found."] }];
}

async function previewXlsx(zip) {
  const sharedStrings = await readSharedStrings(zip);
  const workbook = await readWorkbook(zip);
  const sections = [];
  for (const sheet of workbook) {
    const xml = await readZipText(zip, sheet.path).catch(() => ""); // best-effort: unreadable sheet degrades to the "No readable cell values" placeholder
    const lines = extractWorksheetRows(xml, sharedStrings);
    sections.push({ title: sheet.name, lines: lines.length ? lines : ["No readable cell values found."] });
  }
  return sections.length ? sections : [{ title: "Spreadsheet", lines: ["No readable sheets found."] }];
}

async function readSharedStrings(zip) {
  const xml = await readZipText(zip, "xl/sharedStrings.xml").catch(() => ""); // best-effort: sharedStrings is an optional zip member
  if (!xml) return [];
  return Array.from(xml.matchAll(/<si\b[\s\S]*?<\/si>/g)).map((m) => extractTextRuns(m[0]).join(""));
}

async function readWorkbook(zip) {
  const workbookXml = await readZipText(zip, "xl/workbook.xml").catch(() => ""); // best-effort: preview degrades to "No readable sheets found"
  const relsXml = await readZipText(zip, "xl/_rels/workbook.xml.rels").catch(() => ""); // best-effort: missing rels only loses sheet-name mapping
  const rels = new Map();
  for (const rel of relsXml.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const attrs = parseAttrs(rel[1]);
    if (attrs.Id && attrs.Target) rels.set(attrs.Id, attrs.Target);
  }
  const sheets = [];
  for (const sheet of workbookXml.matchAll(/<sheet\b([^>]*)\/?>/g)) {
    const attrs = parseAttrs(sheet[1]);
    const relId = attrs["r:id"];
    const target = relId ? rels.get(relId) : null;
    if (!target) continue;
    sheets.push({ name: attrs.name || `Sheet ${sheets.length + 1}`, path: `xl/${target.replace(/^\/?xl\//, "")}` });
  }
  if (sheets.length) return sheets;
  return Object.keys(zip.files)
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(name))
    .sort(numericPathSort)
    .map((name, i) => ({ name: `Sheet ${i + 1}`, path: name }));
}

function extractWorksheetRows(xml, sharedStrings) {
  const rows = [];
  for (const row of xml.matchAll(/<row\b[\s\S]*?<\/row>/g)) {
    const values = [];
    for (const cell of row[0].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = parseAttrs(cell[1]);
      const body = cell[2];
      let value = "";
      if (attrs.t === "s") {
        const idx = Number(extractFirst(body, /<v>([\s\S]*?)<\/v>/));
        value = Number.isInteger(idx) ? sharedStrings[idx] ?? "" : "";
      } else if (attrs.t === "inlineStr") {
        value = extractTextRuns(body).join("");
      } else {
        value = decodeXml(extractFirst(body, /<v>([\s\S]*?)<\/v>/));
      }
      if (value.trim()) values.push(value.trim());
    }
    if (values.length) rows.push(values.join(" | "));
  }
  return rows;
}

function extractTextRuns(xml) {
  return Array.from(xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>|<w:t[^>]*>([\s\S]*?)<\/w:t>|<t[^>]*>([\s\S]*?)<\/t>/g))
    .map((m) => decodeXml(m[1] ?? m[2] ?? m[3] ?? "").trim())
    .filter(Boolean);
}

async function readZipText(zip, name) {
  const entry = zip.file(name);
  if (!entry) throw new Error(`missing ${name}`);
  const size = entry._data?.uncompressedSize ?? 0;
  if (size > MAX_XML_ENTRY_BYTES) {
    const err = new Error("document section too large to preview");
    err.statusCode = 413;
    throw err;
  }
  const xml = await entry.async("text");
  assertSafeXml(xml);
  return xml;
}

function parseAttrs(raw) {
  const attrs = {};
  for (const m of raw.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[m[1]] = decodeXml(m[2]);
  return attrs;
}

function extractFirst(raw, pattern) {
  const m = raw.match(pattern);
  return m ? m[1] ?? "" : "";
}

function decodeXml(raw) {
  return String(raw)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function assertPreviewInputSize(size) {
  if (size > MAX_COMPRESSED_PREVIEW_BYTES) {
    const err = new Error("document too large to preview");
    err.statusCode = 413;
    throw err;
  }
}

function assertZipPreviewSize(zip) {
  let total = 0;
  for (const entry of Object.values(zip.files)) {
    total += entry._data?.uncompressedSize ?? 0;
    if (total > MAX_UNCOMPRESSED_PREVIEW_BYTES) {
      const err = new Error("document too large to preview");
      err.statusCode = 413;
      throw err;
    }
  }
}

function assertSafeXml(xml) {
  if (/<!DOCTYPE\b|<!ENTITY\b/i.test(xml)) {
    const err = new Error("unsupported XML entities");
    err.statusCode = 415;
    throw err;
  }
}

function numericPathSort(a, b) {
  const an = Number(a.match(/(\d+)(?=\.xml$)/)?.[1] ?? 0);
  const bn = Number(b.match(/(\d+)(?=\.xml$)/)?.[1] ?? 0);
  return an - bn || a.localeCompare(b);
}
