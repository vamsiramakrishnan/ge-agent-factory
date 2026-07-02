// Glossary term auto-linking (jargon detox) for the docs/ → site sync.
//
// docs/GLOSSARY.md is the single source of jargon truth. At sync time we
// parse its headwords + anchors and, in every synced page's PROSE, link the
// first occurrence of each term to the glossary page — rendered as a plain
// HTML <a> whose title attribute carries the entry's first sentence, so
// hovering any linked term gives a zero-JS tooltip definition.
//
// Never links inside code (fences/inline code are sheltered by the caller as
// ` FENCEn ` / ` ICODEn ` tokens), markdown links/images, headings, aside
// markers, or raw HTML tags/attributes.

// Same id the site's markdown renderer (github-slugger via Astro) produces
// for a heading — lowercase, drop punctuation, spaces → hyphens. Matches the
// kramdown auto_ids the Jekyll site used for these ASCII headings too.
export function headingSlug(heading) {
  return heading
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9 _-]/g, "")
    .replace(/ /g, "-");
}

// Strip markdown + MDX-hostile characters so the sentence is safe inside an
// HTML title attribute embedded in MDX prose.
function cleanSentenceText(text) {
  return text
    .replace(/\*\*?|__|`/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[<>{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(text) {
  const clean = cleanSentenceText(text);
  const m = clean.match(/^.*?[.!?]["')\]]*(?=\s|$)/);
  return (m ? m[0] : clean).trim();
}

// "OKF / Knowledge Bundle" and "Scenario Packs (a.k.a. Simulator Packs)" are
// one glossary entry each but several prose spellings — expand the headword
// into the aliases a page would actually use.
function aliasesFor(headword) {
  const aliases = [];
  const aka = headword.match(/^(.*?)\s*\(a\.k\.a\.\s+(.*?)\)\s*$/i);
  const base = aka ? aka[1] : headword;
  for (const part of base.split(/\s+\/\s+/)) aliases.push(part.trim());
  if (aka) aliases.push(aka[2].trim());
  return aliases.filter(Boolean);
}

/**
 * Parse docs/GLOSSARY.md into linkable entries.
 *
 * Two entry shapes exist in the file:
 *  - `### Headword` sections with a `**What it is:**` paragraph → one entry
 *    anchored at the heading's own slug;
 *  - a `### …` section whose body is a `- **Term** — definition` bullet list
 *    → one entry per bullet, all anchored at the section heading's slug.
 *
 * Returns [{ term, aliases, anchor, title }] where `title` is the entry's
 * first sentence (the hover tooltip text).
 */
export function parseGlossary(markdown) {
  const entries = [];
  const sections = [...markdown.matchAll(/^###\s+(.+)\s*$([\s\S]*?)(?=^###\s|(?![\s\S]))/gm)];
  for (const [, heading, body] of sections) {
    const headword = heading.trim();
    const bullets = [...body.matchAll(/^-\s+\*\*(.+?)\*\*\s*—\s*([\s\S]*?)(?=^-\s+\*\*|(?![\s\S]))/gm)];
    const whatItIs = body.match(/\*\*What it is:\*\*\s*([\s\S]*?)(?:\n[ \t]*\n|$)/);
    if (whatItIs) {
      entries.push({
        term: headword,
        aliases: aliasesFor(headword),
        anchor: headingSlug(headword),
        title: firstSentence(whatItIs[1]),
      });
    } else if (bullets.length) {
      const anchor = headingSlug(headword);
      for (const [, term, definition] of bullets) {
        entries.push({
          term: term.trim(),
          aliases: aliasesFor(term.trim()),
          anchor,
          title: firstSentence(definition),
        });
      }
    }
  }
  return entries;
}

// Regions of the prose the linker must never touch: headings, existing
// markdown links/images, raw HTML tags (and everything between <a>…</a>),
// aside markers. Code is already sheltered as FENCEn/ICODEn tokens.
const MASK_PATTERNS = [
  /^#{1,6}[ \t].*$/gm, // headings
  /^:{3,}.*$/gm, // aside open/close markers
  /!?\[[^\]]*\]\([^)]*\)/g, // markdown links + images (label and URL)
  /<a[\s>][\s\S]*?<\/a>/gi, // whole HTML anchors (already-linked text)
  /<[^<>\n]+>/g, // any other raw HTML tag incl. attributes
];

function buildMask(text) {
  const mask = new Uint8Array(text.length);
  for (const pattern of MASK_PATTERNS) {
    pattern.lastIndex = 0;
    for (const m of text.matchAll(pattern)) {
      mask.fill(1, m.index, m.index + m[0].length);
    }
  }
  return mask;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary pattern for one alias: hyphens count as boundaries only
// outward ("google-agents-cli" must NOT match "agents-cli"), inner spaces
// tolerate a line wrap, and a trailing s/es keeps plurals linkable.
function aliasPattern(alias) {
  let core;
  if (/s$/i.test(alias)) core = `${escapeRegExp(alias.slice(0, -1))}s?`;
  else core = `${escapeRegExp(alias)}(?:e?s)?`;
  core = core.split(" ").join("(?:[ \\t]+|[ \\t]*\\n[ \\t]*)");
  return new RegExp(`(?<![\\w-])${core}(?![\\w-])`, "gi");
}

function attrEscape(text) {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * Link the first prose occurrence of each glossary term in `text` to
 * `${route}#${anchor}` as `<a href title>` (title = first sentence of the
 * entry → hover tooltip). Longest alias wins where terms overlap; each entry
 * links at most once (its earliest-occurring alias).
 *
 * `text` must arrive with code sheltered (the sync pipeline's FENCE/ICODE
 * tokens) — the linker itself masks headings, links, and HTML.
 */
export function linkGlossaryTerms(text, entries, { route }) {
  const mask = buildMask(text);
  const aliases = [];
  for (const entry of entries) {
    for (const alias of entry.aliases) aliases.push({ alias, entry });
  }
  aliases.sort((a, b) => b.alias.length - a.alias.length);

  const claimed = []; // [start, end) ranges already taken (longest-first)
  const overlaps = (s, e) => claimed.some(([cs, ce]) => s < ce && e > cs);
  const masked = (s, e) => {
    for (let i = s; i < e; i++) if (mask[i]) return true;
    return false;
  };

  const candidates = [];
  for (const { alias, entry } of aliases) {
    const re = aliasPattern(alias);
    for (const m of text.matchAll(re)) {
      const start = m.index;
      const end = start + m[0].length;
      if (masked(start, end) || overlaps(start, end)) continue;
      claimed.push([start, end]);
      candidates.push({ start, end, entry, matched: m[0] });
      break; // first eligible occurrence of this alias only
    }
  }

  // One link per entry: keep its earliest-occurring alias.
  const byEntry = new Map();
  for (const c of candidates) {
    const prev = byEntry.get(c.entry);
    if (!prev || c.start < prev.start) byEntry.set(c.entry, c);
  }

  const chosen = [...byEntry.values()].sort((a, b) => b.start - a.start);
  let out = text;
  for (const { start, end, entry, matched } of chosen) {
    const href = `${route}#${entry.anchor}`;
    const link = `<a href="${href}" title="${attrEscape(entry.title)}">${matched}</a>`;
    out = out.slice(0, start) + link + out.slice(end);
  }
  return out;
}
