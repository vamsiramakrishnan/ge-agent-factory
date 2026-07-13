// Logic behind the /llms.txt and /llms-full.txt endpoints (src/pages/*.txt.js):
// turn the synced Starlight content collection back into plain, LLM-legible
// markdown, in a deterministic order. Pure functions — no astro imports — so
// tests can exercise them directly (apps/docs/tests/llms-txt.test.mjs).
//
// Why the collection body (the synced .mdx) and not the raw docs/ markdown?
// The synced pages ARE the published set — curated pages included, unpublished
// trees excluded, links already rewritten to absolute site routes, kramdown
// noise ({: .note} IALs, {:toc}) already gone. What the sync added on top of
// CommonMark is mechanical and inverted here: MDX escapes (\{, &lt;tag),
// glossary tooltip anchors, component tags, ESM import lines.
import {
  restoreFences,
  restoreInlineCode,
  shelterFences,
  shelterInlineCode,
} from "../../scripts/lib/mdx-transform.mjs";
import { SITE_SECTIONS } from "./site-ia.mjs";

const SECTION_ORDER = SITE_SECTIONS.map(({ key }) => key);
const SECTION_LABELS = Object.fromEntries(SITE_SECTIONS.map(({ key, label }) => [key, label]));

const ASIDE_LABELS = { note: "Note", tip: "Tip", caution: "Caution", danger: "Important" };

export function sectionOf(id) {
  if (id === "index") return "start";
  if (id === "catalog" || id === "catalog-verticals" || id.startsWith("catalog/")) return "catalog";
  return id.split("/")[0];
}

export function sectionLabelOf(id) {
  const section = sectionOf(id);
  return SECTION_LABELS[section] ?? section.charAt(0).toUpperCase() + section.slice(1);
}

function sectionRank(id) {
  const i = SECTION_ORDER.indexOf(sectionOf(id));
  return i === -1 ? SECTION_ORDER.length : i;
}

function orderKey(page) {
  if (page.id === "index") return -1; // the landing page leads its section
  const order = page.data?.sidebar?.order;
  return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
}

// Deterministic page order: sidebar section (astro.config order), then the
// page's sidebar order, then slug — no dependence on filesystem enumeration.
export function orderPages(pages) {
  return [...pages].sort((a, b) => {
    const rank = sectionRank(a.id) - sectionRank(b.id);
    if (rank !== 0) return rank;
    const aSection = sectionOf(a.id);
    const bSection = sectionOf(b.id);
    if (aSection !== bSection) return aSection < bSection ? -1 : 1;
    const order = orderKey(a) - orderKey(b);
    if (order !== 0) return order;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

export function siteRootFrom(site, base) {
  return `${String(site ?? "").replace(/\/+$/, "")}${String(base ?? "").replace(/\/+$/, "")}`;
}

export function urlFor(id, siteRoot) {
  return `${siteRoot}/${id === "index" ? "" : `${id}/`}`;
}

// Synced .mdx / curated .mdx → plain markdown. Everything runs with fenced
// blocks and inline code sheltered, so code samples pass through untouched.
// Pass { base, siteRoot } to also absolutize base-relative page links
// (`](/ge-agent-factory/…` → `](https://…/ge-agent-factory/…`) so the plain
// file is legible away from the site.
export function plainifyMdx(body, { base, siteRoot } = {}) {
  const { sheltered, blocks } = shelterFences(String(body ?? ""));
  const { sheltered: prose, spans } = shelterInlineCode(sheltered);
  let text = prose;

  // MDX ESM import lines (curated pages import Starlight components).
  text = text.replace(/^import\s[^\n]*from\s+['"][^'"]+['"];?[ \t]*$/gm, "");

  // Glossary tooltip anchors (injected by scripts/lib/glossary.mjs) → the
  // plain term; other HTML anchors → markdown links.
  text = text.replace(/<a\s[^>]*\btitle="[^"]*"[^>]*>([\s\S]*?)<\/a>/g, "$1");
  text = text.replace(/<a\s[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)");

  // HTML images → markdown images; drop the <p align> wrappers around them.
  text = text.replace(/<img\s([^<>]*?)\/?>/g, (_, attrs) => {
    const src = attrs.match(/\bsrc="([^"]*)"/)?.[1] ?? "";
    const alt = attrs.match(/\balt="([^"]*)"/)?.[1] ?? "";
    return `![${alt}](${src})`;
  });
  text = text.replace(/<p\b[^>]*>|<\/p>/g, "");

  // Starlight asides → a bold label line; the body stays as-is.
  text = text.replace(
    /^:::([a-z]+)(?:\[([^\]]*)\])?[ \t]*$/gm,
    (_, kind, label) => `**${label || ASIDE_LABELS[kind] || kind}:**`,
  );
  text = text.replace(/^:::[ \t]*$/gm, "");

  // Components that carry prose in their attributes keep it …
  text = text.replace(/^([ \t]*)<(?:TabItem|Card)\s[^>]*\b(?:label|title)="([^"]*)"[^>]*>[ \t]*$/gm, "$1**$2**");
  text = text.replace(/<Badge\s([^<>]*?)\/>/g, (_, attrs) => {
    const label = attrs.match(/\btext="([^"]*)"/)?.[1];
    return label ? `**${label}**` : "";
  });
  text = text.replace(/<LinkCard\s([^<>]*?)\/>/g, (_, attrs) => {
    const title = attrs.match(/\btitle="([^"]*)"/)?.[1];
    const href = attrs.match(/\bhref="([^"]*)"/)?.[1];
    const description = attrs.match(/\bdescription="([^"]*)"/)?.[1];
    return title && href ? `- [${title}](${href})${description ? `: ${description}` : ""}` : "";
  });
  // … the rest (wrappers like <CardGrid>, <Steps>, </TabItem>, <CommandCard/>)
  // are presentation and drop away.
  text = text.replace(/^[ \t]*<\/?[A-Z][\w.]*(?:\s[^<>]*)?>[ \t]*$/gm, "");
  text = text.replace(/<\/?[A-Z][\w.]*(?:\s[^<>]*)?\/?>/g, "");

  // Undo the sync's MDX escapes (escapeMdxHostileTokens) and HTML entities.
  text = text.replace(/\\\{/g, "{");
  text = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

  if (base && siteRoot) {
    text = text.split(`](${String(base).replace(/\/+$/, "")}/`).join(`](${siteRoot}/`);
  }

  text = restoreInlineCode(text, spans);
  text = restoreFences(text, blocks);
  return `${text.replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

// First prose sentence of a plainified body — the llms.txt description for
// pages whose frontmatter doesn't provide one.
export function firstProseSentence(plain, max = 200) {
  const noFences = String(plain ?? "").replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, "");
  for (const para of noFences.split(/\n[ \t]*\n/)) {
    const squashed = para
      .replace(/\s+/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images drop away entirely …
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // … links flatten to their text
      .trim();
    if (!squashed || !/^[A-Za-z`"'(]/.test(squashed)) continue;
    const sentence = squashed.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? squashed;
    if (sentence.length <= max) return sentence;
    return `${sentence.slice(0, max).replace(/\s+\S*$/, "")}…`;
  }
  return "";
}

function catalogScopeText(catalogScope) {
  const count = Number(catalogScope?.detailPageCount ?? 0);
  const amount = count > 0 ? `${count} generated agent detail pages` : "the generated agent detail pages";
  return `Catalog scope: this export includes the catalog overview pages and links to the browser-only explorer. It intentionally omits ${amount}; those pages remain available on the website.`;
}

// The llms.txt index: title, one-line description, then every published
// content page grouped once in the same order as the site sidebar. The
// browser-only catalog surface is linked with an explicit scope statement.
export function buildLlmsTxt({ title, description, siteRoot, pages, catalogScope }) {
  const out = [`# ${title}`, "", `> ${description}`];
  const groups = new Map();
  for (const page of orderPages(pages)) {
    const section = sectionOf(page.id);
    const group = groups.get(section) ?? [];
    group.push(page);
    groups.set(section, group);
  }
  for (const [section, sectionPages] of groups) {
    out.push("", `## ${sectionLabelOf(section)}`, "");
    if (section === "catalog" && catalogScope) out.push(`> ${catalogScopeText(catalogScope)}`, "");
    for (const page of sectionPages) {
      const desc = page.description ? `: ${page.description}` : "";
      out.push(`- [${page.title}](${urlFor(page.id, siteRoot)})${desc}`);
    }
    if (section === "catalog" && catalogScope) {
      out.push(`- [Catalog explorer](${siteRoot}/catalog/explorer/): filter the complete catalog by industry, function, and value stream (web-only)`);
    }
  }
  out.push(
    "",
    "## Optional",
    "",
    `- [llms-full.txt](${siteRoot}/llms-full.txt): the documentation content pages above as one plain-markdown file; the catalog explorer and generated agent detail pages stay web-only`,
  );
  return `${out.join("\n")}\n`;
}

// The llms-full.txt concatenation: every page as plain markdown, in the same
// deterministic order, separated by thematic breaks.
export function buildLlmsFullTxt({ title, description, siteRoot, pages, catalogScope }) {
  const out = [
    `# ${title} — full documentation`,
    "",
    `> ${description}`,
    "",
    `Index of pages: ${siteRoot}/llms.txt · Site: ${urlFor("index", siteRoot)}`,
  ];
  if (catalogScope) {
    const scope = catalogScopeText(catalogScope).replace(/^Catalog scope:\s*/, "");
    out.push("", `Catalog scope: ${scope} Explorer: ${siteRoot}/catalog/explorer/`);
  }
  for (const page of orderPages(pages)) {
    out.push("", "---", "", `# ${page.title}`, "", `URL: ${urlFor(page.id, siteRoot)}`, "", page.plain.trimEnd());
  }
  return `${out.join("\n")}\n`;
}
