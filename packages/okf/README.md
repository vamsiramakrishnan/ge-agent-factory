# @ge/okf

A standalone, dependency-free toolkit for the **Open Knowledge Format (OKF)** v0.1.

OKF (see GoogleCloudPlatform/knowledge-catalog `okf/SPEC.md`) models a *Knowledge
Bundle* as a directory tree of UTF-8 Markdown **Concepts**. Each concept is YAML
frontmatter (between `---` fences, with a required non-empty `type`) followed by a
free-form Markdown body. Relationships between concepts are plain Markdown links,
preferably **bundle-absolute** (e.g. `/systems/blackline.md`). Only the root
`index.md` carries `okf_version: "0.1"`.

This package is the reusable primitive layer — slugging, frontmatter emit/parse,
concept read/write, and link helpers. It has **no domain-specific logic** and
depends only on Node builtins (`node:fs/promises`, `node:path`).

## API

| Export | Purpose |
| --- | --- |
| `OKF_VERSION` | The `"0.1"` version string. |
| `slug(value)` | Filesystem/link-safe concept id segment (collision-disambiguation is the caller's job). |
| `link(conceptId, label?)` | Bundle-absolute Markdown link to a concept. |
| `emitFrontmatter(fields)` | Emit YAML frontmatter for flat scalar/list shapes (key order preserved). |
| `renderConcept(fields, body?)` | Render frontmatter + body into a concept Markdown string. |
| `parseConcept(text)` | Parse a concept into `{ frontmatter, body }`. |
| `bodySections(body)` | Split a body into sections keyed by heading text. |
| `extractLinks(markdown)` | Pull all bundle-absolute concept ids out of a blob. |
| `writeConceptFile(absPath, contents)` | Atomic-ish write (temp + rename). |
| `readConceptFile(absPath)` | Read + parse a concept file. |
| `findUseCase(catalog, id)` | Resolve an entry by `id` from an array/object catalog. |
| `joinBundle(outDir, ...segments)` | `path.join` helper for bundle paths. |

## Usage

```js
import { renderConcept, parseConcept, link } from "@ge/okf";

const md = renderConcept(
  { type: "Source System", title: "BlackLine", okf_version: undefined },
  `# Overview\n\nSee ${link("tables/journal-entries", "Journal Entries")}.`,
);
const { frontmatter, body } = parseConcept(md); // { type: "Source System", ... }
```
