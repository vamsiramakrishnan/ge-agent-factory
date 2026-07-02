#!/usr/bin/env node
// Build-time content sync: docs/ (the repo's canonical, GitHub-readable
// markdown) → this site's Starlight content tree. The website is a *view* of
// docs/, never a second copy to maintain — this script runs before every
// `astro dev`/`astro build` (see package.json pre-scripts), and everything it
// writes is gitignored. Edit docs/*.md, not the generated files.
//
// What it does per page, in order:
//   1. frontmatter: keep title/description, map Jekyll nav_order → Starlight
//      sidebar order, point editUrl at the docs/ source file
//   2. drop the leading h1 (Starlight renders the title)
//   3. kramdown callouts (`> …` + `{: .note }`) → Starlight asides (:::note)
//   4. strip kramdown TOC blocks / leftover IAL lines ({:toc}, {: .no_toc })
//   5. rewrite relative .html/.md links to site routes; links that leave the
//      published set (SETUP.md, runbooks/…) become GitHub blob URLs
//   6. copy referenced images/SVGs into public/ and absolutize their URLs
//   7. emit .mdx: escape MDX-hostile prose tokens ({, <placeholder>), drop
//      HTML comments, self-close void tags (lib/mdx-transform.mjs) — authors
//      keep writing plain CommonMark in docs/, MDX stays a build detail
//   8. upgrade plain-markdown conventions to Starlight components
//      (lib/enrich.mjs): the cookbooks' `**Scope:** …` strip → <Badge>, a
//      `## Steps` ordered list → <Steps>, injecting the import line needed
//   9. auto-link the first prose occurrence of each docs/GLOSSARY.md term to
//      the glossary page, with the entry's first sentence as a hover title
//      (lib/glossary.mjs)
//  10. validate: every emitted page must parse as MDX (the compiler Astro
//      itself will use); any error fails the sync with docs/<file>:<line>
//      context, so a future hostile token never reaches `astro build`
//
//   node apps/docs/scripts/sync-content.mjs [--dry-run]
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  convertCallouts,
  convertIndexTables,
  convertScopeStrip,
  wrapSteps,
} from "./lib/enrich.mjs";
import { linkGlossaryTerms, parseGlossary } from "./lib/glossary.mjs";
import {
  convertAutolinks,
  escapeMdxHostileTokens,
  restoreFences,
  restoreInlineCode,
  selfCloseVoidTags,
  shelterFences,
  shelterInlineCode,
  stripHtmlComments,
  validateMdx,
} from "./lib/mdx-transform.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..", "..");
const SRC = join(REPO, "docs");
const DEST = join(HERE, "..", "src", "content", "docs");
const PUBLIC = join(HERE, "..", "public");
const DRY = process.argv.includes("--dry-run");

const BASE = "/ge-agent-factory"; // must match astro.config.mjs `base`
const REPO_URL = "https://github.com/vamsiramakrishnan/ge-agent-factory";
const EDIT_URL = `${REPO_URL}/edit/main/docs`;
const BLOB_URL = `${REPO_URL}/blob/main`;

// Trees that are site-internal or deliberately unpublished — the same set the
// Jekyll site excluded (docs/_config.yml `exclude`), so site scope is stable
// across the migration. Links into these trees become GitHub blob URLs.
const SKIP_DIRS = new Set([
  "_includes",
  "_layouts",
  "_sass",
  "_site",
  "assets",
  "adr",
  "collateral",
  "diagrams-src",
  "plans",
  "runbooks",
  "skills",
  "design-specs",
  "vendor",
]);

// docs/-relative path → where the page lives in the content tree. Top-level
// pages must be mapped explicitly (the script fails on an unmapped one) so a
// new page is a conscious IA decision, not a file that lands wherever.
// `order`/`title`/`label` override what the source frontmatter provides.
const PAGE_MAP = new Map([
  ["index.md", { dest: "start/what-is-the-factory.md", title: "What is the factory", order: 1 }],
  ["developers.md", { dest: "start/developer-guide.md", order: 3 }],
  ["OPERATIONS.md", { dest: "operations.md" }],
  ["MCP.md", { dest: "reference/mcp.md", title: "MCP server", order: 90 }],
  ["GLOSSARY.md", { dest: "reference/glossary.md", order: 95 }],
  ["DESIGN.md", { dest: "contributing/docs-design.md", title: "Docs design system", order: 1 }],
  ["modularization-audit.md", null], // internal audit notes, never published
]);

// kramdown callout class → Starlight aside. `status` keeps its label via the
// custom-title syntax; `important` maps to the strongest aside like the red
// swatch it had on the Jekyll site.
const CALLOUTS = {
  note: ":::note",
  tip: ":::tip",
  warning: ":::caution",
  important: ":::danger",
  status: ":::note[Status]",
};

const warnings = [];
const copiedAssets = new Set();

function walk(dir, acc = [], rel = "") {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
      walk(join(dir, entry.name), acc, entryRel);
    } else if (entry.name.endsWith(".md")) {
      acc.push(entryRel);
    }
  }
  return acc;
}

function destFor(srcRel) {
  if (PAGE_MAP.has(srcRel)) return PAGE_MAP.get(srcRel); // may be null (skip)
  const [head] = srcRel.split("/");
  if (["concepts", "cookbooks", "reference"].includes(head)) return { dest: srcRel };
  throw new Error(
    `docs/${srcRel} has no place in the site's information architecture yet — ` +
      `add it to PAGE_MAP in apps/docs/scripts/sync-content.mjs (or to SKIP_DIRS/PAGE_MAP as unpublished).`,
  );
}

function slugFor(contentRel) {
  return contentRel
    .replace(/\.mdx?$/, "")
    .replace(/(^|\/)index$/, "")
    .toLowerCase();
}

function routeFor(contentRel, fragment = "") {
  const slug = slugFor(contentRel);
  return `${BASE}/${slug ? `${slug}/` : ""}${fragment}`;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const km = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (km) fm[km[1]] = km[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return { fm, body: text.slice(m[0].length) };
}

function stripTocAndIals(text) {
  return text
    .replace(/^#{1,3}\s+Table of contents\s*\n(\{:[^}]*\}\s*\n)?/gim, "")
    .replace(/^\d+\.\s+TOC\s*\n\{:toc\}\s*\n?/gm, "")
    .replace(/^[ \t]*\{:[^}]*\}[ \t]*\n?/gm, "");
}

const ASSET_RE = /\.(svg|png|jpe?g|gif|webp)$/i;

function isExternal(url) {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//") || url.startsWith("#");
}

// Resolve a relative URL from a docs/ page to a site route, a copied public
// asset, or a GitHub blob URL — in that order of preference.
function rewriteUrl(url, srcRel) {
  if (isExternal(url) || url.startsWith("/")) return url;
  const fragMatch = url.match(/[#?].*$/);
  const fragment = fragMatch ? fragMatch[0] : "";
  const rawPath = fragMatch ? url.slice(0, fragMatch.index) : url;
  if (!rawPath) return url;
  const fromDir = posix.dirname(srcRel);
  const resolved = posix.normalize(posix.join(fromDir === "." ? "" : fromDir, rawPath));
  if (resolved.startsWith("..")) {
    // Points outside docs/ (e.g. ../../SETUP.md) — send it to GitHub.
    const repoRel = posix.normalize(posix.join("docs", resolved));
    return `${BLOB_URL}/${repoRel}${fragment}`;
  }

  if (ASSET_RE.test(resolved)) {
    const abs = join(SRC, resolved);
    if (!existsSync(abs)) {
      warnings.push(`${srcRel}: asset not found: ${url}`);
      return url;
    }
    if (!DRY) {
      const out = join(PUBLIC, resolved);
      mkdirSync(dirname(out), { recursive: true });
      cpSync(abs, out);
    }
    copiedAssets.add(resolved);
    return `${BASE}/${resolved}${fragment}`;
  }

  // Page link: `foo.html`, `foo.md`, `foo/`, or a bare directory.
  const noExt = resolved.replace(/\/+$/, "").replace(/\.(html|md)$/i, "");
  const candidates = [`${noExt}.md`, posix.normalize(`${noExt}/index.md`)];
  for (const candidate of candidates) {
    if (!existsSync(join(SRC, candidate))) continue;
    const mapped = destFor(candidate);
    if (mapped) return routeFor(mapped.dest, fragment);
    return `${BLOB_URL}/docs/${candidate}${fragment}`; // published nowhere → GitHub
  }
  try {
    // Unpublished tree (runbooks/, adr/, …) or a non-page file — GitHub blob.
    if (existsSync(join(SRC, resolved))) return `${BLOB_URL}/docs/${resolved}${fragment}`;
  } catch {}
  warnings.push(`${srcRel}: unresolved link: ${url}`);
  return url;
}

function rewriteLinks(text, srcRel) {
  return text
    .replace(/(\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g, (_, pre, url, post) => `${pre}${rewriteUrl(url, srcRel)}${post}`)
    .replace(/(<(?:img|a)\b[^>]*?\s(?:src|href)=")([^"]+)(")/g, (_, pre, url, post) => `${pre}${rewriteUrl(url, srcRel)}${post}`);
}

// Glossary auto-linking: headwords + anchors + first sentences, parsed once
// from the canonical source; every synced page (except the glossary itself)
// gets its first mention of each term linked to the glossary page.
const GLOSSARY_SRC = "GLOSSARY.md";
const GLOSSARY_ENTRIES = parseGlossary(readFileSync(join(SRC, GLOSSARY_SRC), "utf8"));
const GLOSSARY_ROUTE = routeFor(PAGE_MAP.get(GLOSSARY_SRC).dest);

function transform(srcRel, mapped) {
  const raw = readFileSync(join(SRC, srcRel), "utf8");
  const { fm, body } = parseFrontmatter(raw);

  const h1 = body.match(/^#\s+(.+)$/m);
  const title = mapped.title ?? fm.title ?? (h1 ? h1[1].trim().replace(/`/g, "") : posix.basename(srcRel, ".md"));
  const order = mapped.order ?? (fm.nav_order != null && fm.nav_order !== "" ? Number(fm.nav_order) : undefined);
  const isSectionIndex = posix.basename(mapped.dest) === "index.md";

  const out = ["---", `title: ${JSON.stringify(title)}`];
  if (fm.description) out.push(`description: ${JSON.stringify(fm.description)}`);
  out.push(`editUrl: ${JSON.stringify(`${EDIT_URL}/${srcRel}`)}`);
  const sidebar = [];
  if (isSectionIndex) sidebar.push("  label: Overview", "  order: 0");
  else if (order !== undefined && Number.isFinite(order)) sidebar.push(`  order: ${order}`);
  if (mapped.label) sidebar.push(`  label: ${JSON.stringify(mapped.label)}`);
  if (sidebar.length) out.push("sidebar:", ...sidebar);
  out.push("---", "");

  let prose = body.replace(/^\s*#\s+.+\n+/, ""); // Starlight renders the title itself
  const { sheltered, blocks } = shelterFences(prose);
  const { sheltered: proseOnly, spans } = shelterInlineCode(sheltered);
  let text = proseOnly;
  text = convertCallouts(text, CALLOUTS);
  text = stripTocAndIals(text);
  text = stripHtmlComments(text);
  text = convertAutolinks(text);
  text = rewriteLinks(text, srcRel);
  // Plain-markdown conventions → Starlight components (lib/enrich.mjs): the
  // cookbooks' `**Scope:** …` strip becomes a Badge, a `## Steps` ordered
  // list becomes <Steps>, and a section index's link tables become a
  // <CardGrid> of <LinkCard>s. All added *here* so docs/ authors never write
  // JSX; the import line for whatever was used is injected below.
  const scope = convertScopeStrip(text);
  text = scope.text;
  const steps = wrapSteps(text);
  text = steps.text;
  const cards = isSectionIndex ? convertIndexTables(text) : { text, used: false };
  text = cards.text;
  const components = [
    scope.used && "Badge",
    steps.used && "Steps",
    cards.used && "CardGrid",
    cards.used && "LinkCard",
  ].filter(Boolean);
  // MDX safety: the page is emitted as .mdx, but docs/ is plain CommonMark —
  // escape what MDX would read as JSX ({expr}, <placeholder>) and self-close
  // void tags. Code is sheltered; only prose is touched.
  text = escapeMdxHostileTokens(text);
  text = selfCloseVoidTags(text);
  if (srcRel !== GLOSSARY_SRC) {
    text = linkGlossaryTerms(text, GLOSSARY_ENTRIES, { route: GLOSSARY_ROUTE });
  }
  text = restoreInlineCode(text, spans);
  prose = restoreFences(text, blocks);

  const importBlock = components.length
    ? `import { ${components.join(", ")} } from '@astrojs/starlight/components';\n\n`
    : "";
  return out.join("\n") + importBlock + prose;
}

// Best-effort mapping of an emitted-.mdx line back to its docs/ source line:
// undo the mechanical escapes/links, then look the text up in the source.
function sourceLineFor(raw, emittedLine) {
  const probe = (emittedLine ?? "")
    .replace(/<a href="[^"]*" title="[^"]*">([\s\S]*?)<\/a>/g, "$1")
    .replace(/\\\{/g, "{")
    .replace(/&lt;/g, "<")
    .replace(/ \/>/g, ">")
    .trim();
  if (!probe) return null;
  const lines = raw.split("\n");
  const exact = lines.findIndex((l) => l.trim() === probe);
  if (exact !== -1) return exact + 1;
  const partial = lines.findIndex((l) => probe.length > 16 && l.includes(probe.slice(0, 40)));
  return partial === -1 ? null : partial + 1;
}

// ── run ─────────────────────────────────────────────────────────────────────
const pages = [];
for (const srcRel of walk(SRC).sort()) {
  const mapped = destFor(srcRel);
  if (!mapped) continue;
  pages.push([srcRel, mapped]);
}

// Curated (checked-in) pages live in start/ and at the content root — never
// clear those. Fully generated roots are wiped so deletions in docs/ propagate.
// Single-file entries are wiped in both .md and .mdx form so a tree synced
// before the .mdx migration doesn't leave duplicate-route leftovers.
const WIPE_DIRS = ["concepts", "cookbooks", "reference", "contributing"];
const WIPE_FILES = ["operations", "start/what-is-the-factory", "start/developer-guide"];
if (!DRY) {
  for (const p of WIPE_DIRS) rmSync(join(DEST, p), { recursive: true, force: true });
  for (const p of WIPE_FILES) for (const ext of [".md", ".mdx"]) rmSync(join(DEST, p + ext), { force: true });
  rmSync(join(PUBLIC, "assets"), { recursive: true, force: true });
  rmSync(join(PUBLIC, "architecture.svg"), { force: true });
}

const emitted = [];
for (const [srcRel, mapped] of pages) {
  const rendered = transform(srcRel, mapped);
  // Emitted as .mdx (routes are extension-less, so slugs don't change): the
  // curated pages and the generated view share one MDX pipeline/components.
  const out = join(DEST, mapped.dest.replace(/\.md$/, ".mdx"));
  emitted.push({ srcRel, out, rendered });
  if (DRY) {
    console.log(`${srcRel.padEnd(42)} → ${relative(join(HERE, ".."), out)}`);
  } else {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, rendered);
  }
}

// MDX-parse guard: every emitted page must compile with the same MDX compiler
// Astro will use. This is what keeps docs/ authoring safe — a hostile token
// that slips past the mechanical escapes fails here, with source context,
// instead of deep inside `astro build`.
let mdxUnavailable = false;
for (const { srcRel, out, rendered } of emitted) {
  const errors = await validateMdx(rendered);
  if (errors === null) {
    mdxUnavailable = true;
    break;
  }
  for (const err of errors) {
    const emittedLine = err.line ? rendered.split("\n")[err.line - 1] : null;
    const srcLine = err.line ? sourceLineFor(readFileSync(join(SRC, srcRel), "utf8"), emittedLine) : null;
    warnings.push(
      `docs/${srcRel}${srcLine ? `:${srcLine}` : ""} does not survive MDX emission: ${err.reason}` +
        `\n      emitted ${relative(join(HERE, ".."), out)}${err.line ? `:${err.line}` : ""}` +
        (emittedLine ? `\n      > ${emittedLine.trim()}` : ""),
    );
  }
}
if (mdxUnavailable) {
  console.warn(
    "⚠ @mdx-js/mdx not resolvable through @astrojs/starlight → @astrojs/mdx — " +
      "skipping the per-page MDX parse guard (astro build will fail loudly instead).",
  );
}

console.log(
  `${DRY ? "[dry-run] would sync" : "synced"} ${pages.length} pages, ${copiedAssets.size} assets from docs/ → apps/docs`,
);
if (warnings.length) {
  console.error(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.error(`  - ${w}`);
  process.exitCode = 1;
}
