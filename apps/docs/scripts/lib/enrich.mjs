// Content-enrichment transforms for the docs/ → site sync: plain-markdown
// conventions authored in docs/ (kramdown callouts, the cookbooks' scope
// strip, `## Steps` sections) become richer Starlight constructs in the
// emitted .mdx. docs/ stays canonical CommonMark — GitHub and the Jekyll site
// render the plain form; the website upgrades it mechanically. Pure
// functions, exercised by enrich.test.mjs.

// kramdown callout (`> …` + `{: .note }`) → Starlight aside (`:::note`).
// Indentation-aware: a callout nested inside a list item (the cookbooks use
// this for step-level gotchas) converts too, keeping its indent so the aside
// stays part of the list item in MDX.
export function convertCallouts(text, callouts) {
  return text.replace(
    /^([ \t]*)(>.*\n(?:\1>.*\n)*)\1\{:\s*\.([a-z_-]+)[^}]*\}[ \t]*$/gm,
    (all, indent, quote, cls) => {
      const open = callouts[cls];
      if (!open) return all;
      const body = quote
        .split("\n")
        .map((line) => (line.startsWith(indent) ? line.slice(indent.length) : line).replace(/^>\s?/, ""))
        .join("\n")
        .replace(/\n+$/, "");
      const reindented = body
        .split("\n")
        .map((line) => (line ? `${indent}${line}` : line))
        .join("\n");
      return `${indent}${open}\n${reindented}\n${indent}:::\n`;
    },
  );
}

// The cookbooks' scope strip — a `**Scope:** <label> — <description>` line
// right under the title — becomes a Starlight Badge so a reader can tell
// local-only from touches-your-cloud-project recipes at a glance.
const SCOPE_VARIANTS = [
  [/^local-only/i, "success"],
  [/^cloud/i, "caution"],
];

export function convertScopeStrip(text) {
  let used = false;
  const out = text.replace(/^\*\*Scope:\*\*\s+([^\n]+)$/m, (all, rest) => {
    const parts = rest.match(/^(.*?)\s+—\s+(.*)$/);
    if (!parts) return all;
    const label = parts[1].trim();
    if (!label || /[*`_[\]<>"]/.test(label)) return all;
    const variant = SCOPE_VARIANTS.find(([re]) => re.test(label))?.[1] ?? "note";
    const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
    used = true;
    return `<Badge text=${JSON.stringify(capitalized)} variant="${variant}" /> ${parts[2]}`;
  });
  return { text: out, used };
}

// Wrap the ordered list of a `## Steps` section in Starlight's <Steps>
// component. Only the maximal run of top-level ordered-list content is
// wrapped (leading prose/images stay outside; a `###` sub-heading or other
// column-0 block ends the run), so pages whose Steps section isn't a single
// list degrade gracefully to plain markdown.
export function wrapSteps(text) {
  const lines = text.split("\n");
  const isItem = (line) => /^\d+[.)]\s/.test(line);
  const isListContent = (line) => line.trim() === "" || isItem(line) || /^[ \t]/.test(line);
  let used = false;
  for (let i = 0; i < lines.length; i++) {
    if (!/^##\s+Steps\s*$/.test(lines[i])) continue;
    let end = i + 1;
    while (end < lines.length && !/^##?\s/.test(lines[end])) end++;
    let start = i + 1;
    while (start < end && !isItem(lines[start])) start++;
    if (start === end) continue;
    let stop = start;
    let lastContent = start;
    while (stop < end && isListContent(lines[stop])) {
      if (lines[stop].trim() !== "") lastContent = stop;
      stop++;
    }
    lines.splice(lastContent + 1, 0, "", "</Steps>");
    lines.splice(start, 0, "<Steps>", "");
    used = true;
    i = lastContent + 4;
  }
  return { text: lines.join("\n"), used };
}
