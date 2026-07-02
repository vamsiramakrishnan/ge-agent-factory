// MDX-safety transforms for the docs/ → site content sync.
//
// docs/ stays canonical CommonMark (GitHub-readable, Jekyll-compatible); the
// site emits .mdx so curated pages and generated pages share one content
// pipeline. MDX treats raw `{expr}` and `<Tag>` in prose as JSX, so plain
// markdown that is perfectly valid on GitHub can break the site. These
// helpers make the emitted pages MDX-safe *mechanically* — authors never
// have to know MDX exists — and `validateMdx` is the guard that proves it,
// per emitted file, at sync time.
import { createRequire } from "node:module";

// ── fenced-block sheltering ─────────────────────────────────────────────────
// Shelter fenced code blocks from prose transforms, restore at the end. Used
// by the sync (docs/ → .mdx) and by the llms.txt plain-markdown rendering
// (src/lib/llms.mjs). The delimiters are NUL bytes (written escaped so this
// file stays text for git): NUL cannot occur in markdown, so the token can
// never collide with prose, and — unlike a space delimiter — it doesn't
// change what line-anchored prose transforms see next to the token.
export function shelterFences(text) {
  const blocks = [];
  const sheltered = text.replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, (block) => {
    blocks.push(block);
    return `\u0000FENCE${blocks.length - 1}\u0000`;
  });
  return { sheltered, blocks };
}

export function restoreFences(text, blocks) {
  return text.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => blocks[Number(i)]);
}

// ── inline-code sheltering ──────────────────────────────────────────────────
// Fenced blocks are sheltered by the sync script before any prose transform;
// inline code spans (`…`, ``…``) need the same treatment because CommonMark
// lets them wrap across a single newline (docs/ uses that for long
// `{field, lists}`), so a line-based transform would corrupt them.
export function shelterInlineCode(text) {
  const spans = [];
  const sheltered = text.replace(/(`+)([\s\S]+?)\1/g, (m) => {
    // A code span cannot cross a blank line — leave those alone (they are a
    // stray backtick, not a span) so we don't swallow paragraphs.
    if (/\n[ \t]*\n/.test(m)) return m;
    spans.push(m);
    return ` ICODE${spans.length - 1} `;
  });
  return { sheltered, spans };
}

export function restoreInlineCode(text, spans) {
  return text.replace(/ ICODE(\d+) /g, (_, i) => spans[Number(i)]);
}

// ── prose rewrites (run with fences + inline code sheltered) ────────────────

// MDX has no HTML comments ({/* … */} instead). docs/ comments are authoring
// notes (e.g. `<!-- screenshot: … -->`) — drop them from the published view.
export function stripHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, "");
}

// CommonMark autolinks (`<https://…>`) are gone in MDX — rewrite to an
// explicit link so the URL stays clickable instead of becoming escaped text.
export function convertAutolinks(text) {
  return text.replace(/<(https?:\/\/[^>\s]+)>/g, (_, url) => `[${url}](${url})`);
}

// Raw HTML tags that docs/ prose legitimately uses and that are valid JSX
// elements as written (paired, attribute-quoted). Anything else that looks
// like a tag (`<useCaseId>`, `<dir>`, …) is a placeholder, not markup.
const SAFE_TAGS = new Set(["img", "a", "p", "br", "details", "summary", "kbd"]);

// Escape the two token families MDX hijacks in prose:
//   `{` opens a JSX expression            → `\{` (CommonMark escapable punct)
//   `<lowercase` opens a JSX element      → `&lt;…` unless it's a known-safe
//                                           HTML tag docs/ really uses
// Runs only on prose — fences and inline code are sheltered by the callers.
export function escapeMdxHostileTokens(text) {
  return text
    .replace(/\{/g, "\\{")
    .replace(/<([a-z][a-z0-9-]*)/g, (m, name) => (SAFE_TAGS.has(name) ? m : `&lt;${name}`));
}

// JSX requires void elements to self-close; markdown-style `<img …>` / `<br>`
// are fine on GitHub but fatal in MDX. Mechanical fix, not an author burden.
export function selfCloseVoidTags(text) {
  return text.replace(/<(img|br|hr)\b([^<>]*?)\/?\s*>/gi, (_, tag, attrs) => {
    const body = attrs.trimEnd();
    return `<${tag}${body ? ` ${body.trimStart()}` : ""} />`;
  });
}

// ── the guard: per-file MDX parse at sync time ──────────────────────────────

// The site never declares @mdx-js/mdx directly — Starlight brings it in via
// @astrojs/mdx. Resolve it through that dependency chain so we always use
// exactly the compiler the Astro build will use (no version drift, no new
// dependency). Returns null if unresolvable; callers fall back to letting
// `astro build` fail loudly.
export function resolveMdxCompilerPath(from = import.meta.url) {
  const hops = [
    ["@mdx-js/mdx"],
    ["@astrojs/mdx", "@mdx-js/mdx"],
    ["@astrojs/starlight", "@astrojs/mdx", "@mdx-js/mdx"],
  ];
  for (const hop of hops) {
    try {
      let req = createRequire(from);
      let resolved = null;
      for (const spec of hop) {
        resolved = req.resolve(spec);
        req = createRequire(resolved);
      }
      return resolved;
    } catch {
      // try the next hop chain
    }
  }
  return null;
}

let compilePromise = null;
async function loadCompile() {
  if (!compilePromise) {
    compilePromise = (async () => {
      const path = resolveMdxCompilerPath();
      if (!path) return null;
      const { pathToFileURL } = await import("node:url");
      const mod = await import(pathToFileURL(path).href);
      return mod.compile;
    })();
  }
  return compilePromise;
}

/**
 * Parse `content` as MDX and return a list of errors (empty = valid).
 * Each error: { line, column, reason }. Returns null when the MDX compiler
 * is not resolvable (callers should warn — `astro build` is the backstop).
 */
export async function validateMdx(content) {
  const compile = await loadCompile();
  if (!compile) return null;
  try {
    await compile(content);
    return [];
  } catch (err) {
    const place = err.place?.start ?? err.place ?? {};
    return [
      {
        line: place.line ?? err.line ?? null,
        column: place.column ?? err.column ?? null,
        reason: err.reason ?? err.message ?? String(err),
      },
    ];
  }
}
