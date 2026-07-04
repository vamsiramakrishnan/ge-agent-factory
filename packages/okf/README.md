# @ge/okf

A standalone toolkit for the **Open Knowledge Format (OKF)** v0.1, plus the
typed **OKF→spec compiler** (`@ge/okf/compile`) that makes OKF a first-class
authoring format for agent specs.

OKF (see GoogleCloudPlatform/knowledge-catalog `okf/SPEC.md`) models a *Knowledge
Bundle* as a directory tree of UTF-8 Markdown **Concepts**. Each concept is YAML
frontmatter (between `---` fences, with a required non-empty `type`) followed by a
free-form Markdown body. Relationships between concepts are plain Markdown links,
preferably **bundle-absolute** (e.g. `/systems/blackline.md`). Only the root
`index.md` carries `okf_version: "0.1"`.

The root export is the reusable primitive layer — slugging, frontmatter
emit/parse, concept read/write, and link helpers. It has **no domain-specific
logic** and depends only on Node builtins (`node:fs/promises`, `node:path`).
The `./compile` subpath is the compiler; it additionally depends on the
sibling leaf packages `@ge/std` (DxError) and `@ge/agent-spec` (Zod schemas),
never on `apps/*` or `tools/*`.

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

## The compiler (`@ge/okf/compile`)

A typed-IR pipeline: **parse** (concepts → typed IR, per-concept validation) →
**resolve** (variant resolution + cross-reference validation) → **emit**
(IR → normalized partial spec, every new field group validated against its
`@ge/agent-spec` Zod schema). Content problems never throw — they come back as
structured `{ code, conceptPath, message, fix }` errors alongside whatever
spec could still be compiled (`toDxError` aggregates them for CLI surfaces).
For bundles carrying only legacy concept types, the emitted spec is
byte-identical to the historical `okf-to-spec.mjs` output.

```js
import { compileOkfBundle, toDxError } from "@ge/okf/compile";

const { spec, ir, errors } = await compileOkfBundle("artifacts/okf/my-agent");
if (errors.length) throw toDxError(errors, "artifacts/okf/my-agent");
```

### Quality-bearing concept types

Each type below compiles into an OPTIONAL spec field (see
`@ge/agent-spec/schema` for the target shapes). Grammar is deterministic:
frontmatter scalars plus conventional sections (`| … |` tables and
`- key: value` bullets). `render*` functions in `compile/render.mjs` emit the
exact shape the parser reads — use them as authoring templates.

| Concept type | Conventional path | Frontmatter | Sections | Compiles into |
| --- | --- | --- | --- | --- |
| `Grounding Contract` | `grounding/<claim>.md` | `claim_type`, `citation_required: "true"\|"false"` | `## Evidence` table (System\|Tool\|Entity\|Field) | `behaviorContract.groundingContracts` |
| `Tool Contract` | `contracts/<tool>.md` | `tool`, `idempotency: safe\|idempotent\|effectful`, `confirmation_policy: never\|destructive\|always` | `## Preconditions`, `## Postconditions` bullets | `behaviorContract.toolContracts` |
| `Policy` (structured) | `policies/<id>.md` | `policy_kind: refusal\|escalation`, `trigger_kind`, `trigger_entity/_condition/_category/_authority/_sensitivity`, `handoff_target` | `## Response`, `## Rationale` | `behaviorContract.refusalPolicies` / `escalationPolicies` |
| `Persona` | `personas/<id>.md` | `persona_id`, `patience: low\|medium\|high`, `adversarial: "true"\|"false"` | `## Role`, `## Goals`, `## Vocabulary`, `## Simulation Instruction` | `behaviorContract.personas` |
| `Error Path` | `error-paths/<mode>.md` | `failure_mode`, `behavior`, `max_retries` | `## Fallback`, `## Tool Overrides` (`- <tool>: behavior = …; max_retries = …; fallback = …`) | `behaviorContract.errorPathBehavior` |
| `SLO` | `slos.md` | — | `## Task Success` / `## Latency` / `## Containment` (`- key: value` bullets) | `behaviorContract.slos` |
| `Variant Binding` | `variant/bindings.md` | — | `## System Bindings` + `## Terminology` (From\|To tables), `## Policy Overlays`, `## Workflow Overrides` bullets | `generationSpec.bindings` |

A `Policy` concept WITHOUT `policy_kind`/`trigger_kind` frontmatter is the
legacy prose form and is (deliberately) not compiled — the structured and
prose policies coexist. `Query Capability` concepts may additionally carry
`## Requires Systems` and `## Fallback` sections, compiled into
`behaviorContract.capabilityDependencies`.

**Provenance is root frontmatter, not a concept type**: it is single-valued
bundle metadata with no outgoing relationships, so it lives on the root
`index.md` (`provenance_origin`, `provenance_source_ref`,
`provenance_version`, `provenance_owner`, `provenance_status`,
`provenance_created_at`, `provenance_lineage`) — exactly one provenance per
bundle by construction, readable without loading concepts. It compiles into
`generationSpec.provenance`.

### Variant resolution

A bundle whose root `index.md` declares `variant_of: <baseId>` (plus
`variant_kind: vertical|source-swap|custom`) is a VARIANT: base bundle +
bindings. The base resolves from `--variant-base <dir>` (the `baseDir`
option) or the **sibling-path convention** `<bundleDir>/../<baseId>`.
Resolution order: merge variant concepts over the base by key → system swaps
(rewrite `sourceSystems`/`entities`/`toolIntents`/grounding/capability
system refs) → terminology (display strings only, longest term first) →
policy overlays (append) → workflow overrides (patch steps by id). Cycles
(including self-reference) are `OKF_VARIANT_CYCLE`; a swap naming a system
the base never declares is `OKF_BINDING_UNKNOWN_SYSTEM`. The emitted spec
carries the resolved content plus the `variantOf`/`bindings` declaration.

### Error codes

`OKF_UNKNOWN_CONCEPT_TYPE`, `OKF_INVALID_FIELD`, `OKF_GROUNDING_EMPTY`,
`OKF_GROUNDING_UNDECLARED_SYSTEM`, `OKF_GROUNDING_UNKNOWN_TOOL`,
`OKF_TOOL_CONTRACT_UNKNOWN_TOOL`, `OKF_ERROR_PATH_UNKNOWN_TOOL`,
`OKF_CAPABILITY_UNKNOWN_SYSTEM`, `OKF_POLICY_UNKNOWN_ENTITY`,
`OKF_BINDING_UNKNOWN_SYSTEM`, `OKF_WORKFLOW_OVERRIDE_UNKNOWN_STEP`,
`OKF_VARIANT_BASE_MISSING`, `OKF_VARIANT_CYCLE`, `OKF_SPEC_SCHEMA`
(compiler bug: parsed field failed its Zod schema). Every error carries a
literal `fix`.
