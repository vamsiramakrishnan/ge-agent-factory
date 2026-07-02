# @ge/docs — the docs website

Astro + [Starlight](https://starlight.astro.build) site that publishes the
repo's documentation. **Content is not authored here.** The canonical markdown
lives in `docs/` (readable on GitHub, checked by `bun run docs:gate`);
`scripts/sync-content.mjs` renders it into `src/content/docs/` before every
dev/build, so this app is presentation only: theme, information architecture,
and a handful of curated pages.

```bash
mise run docs-site          # dev server (syncs content, then astro dev)
bun run docs:site:build     # production build → apps/docs/dist
node scripts/sync-content.mjs --dry-run   # preview the docs/ → site mapping
```

## How a docs/ page becomes a site page

`sync-content.mjs` walks `docs/` (minus the trees the Jekyll site also
excluded: `runbooks/`, `adr/`, `plans/`, …) and, per page:

1. keeps `title`/`description`, maps Jekyll `nav_order` → Starlight
   `sidebar.order`, and points `editUrl` at the `docs/` source file
2. converts kramdown callouts (`> …` + `{: .note }`) into Starlight asides
3. strips kramdown TOC blocks (Starlight renders its own)
4. rewrites relative `.html`/`.md` links to site routes; links that leave the
   published set (`SETUP.md`, `docs/runbooks/…`) become GitHub blob URLs
5. copies referenced images/SVGs (the beautiful-mermaid diagrams in
   `docs/assets/diagrams/`) into `public/` and absolutizes their URLs
6. emits **`.mdx`** (routes don't change — slugs are extension-less), escaping
   the tokens MDX would read as JSX (`{…}`, `<placeholder>`) so authors keep
   writing plain CommonMark; every emitted page is then parsed with the same
   MDX compiler Astro uses, and the sync **fails with `docs/<file>:<line>`
   context** on anything hostile that slips past the escapes
7. auto-links the first prose mention of each `docs/GLOSSARY.md` term to the
   glossary page, with the entry's first sentence as an `<a title>` hover
   tooltip (never inside code, links, or headings — see
   `scripts/lib/glossary.mjs`)

Because pages are MDX, generated and curated content can use the components
in `src/components/` — e.g. `CommandCard.astro`, which renders a command's
label/CLI/risk/requirements straight from `tools/lib/ge-command-registry.mjs`
at build time (via the `src/lib/ge-commands.mjs` shim), so command docs can
never drift from the registry.

Everything the script writes is gitignored (see `.gitignore`) — edit the
`docs/` source, never the generated files. Top-level `docs/*.md` pages must be
placed explicitly in `PAGE_MAP` inside the script; the sync fails loudly on an
unmapped page so a new page is an IA decision, not an accident. The script
also exits non-zero on unresolvable links, which makes `--dry-run` a cheap
link check for the site.

## Curated pages (tracked in git)

- `src/content/docs/index.mdx` — the landing page (splash + cards)
- `src/content/docs/start/quickstart.mdx` — Steps/Tabs quickstart

## Theme

`src/styles/custom.css` derives everything from the product's design tokens
(`packages/design/src/tokens.css`, same palette as
`docs/_sass/color_schemes/ge.scss`): primary `#1a73e8`, Space Grotesk for
headings/chrome, Geist Mono for code (self-hosted via Fontsource), plus a
Google-dark palette for dark mode. If the palette changes, change `tokens.css`
first — `node tools/check-design-tokens.mjs` guards the other copies.

## Deployment

`.github/workflows/deploy-docs.yml` builds and deploys to GitHub Pages on
pushes to `main` that touch `docs/` or `apps/docs/`. The repo's Pages settings
must have **Source = GitHub Actions** (the legacy Jekyll site under `docs/`
serves until that switch is flipped).
