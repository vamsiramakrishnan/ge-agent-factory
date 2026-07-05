---
title: Agent lifecycle
parent: Reference
nav_order: 16
layout: default
description: How an agent moves through its OKF-bundle lifecycle — customize a variant from a base, register it as a tracked agent, and track its provenance and variant lineage.
---

# Agent lifecycle

An agent's source of truth is its [OKF bundle](okf.html) (OKF: Open
Knowledge Format): one directory per agent under the corpus root
(`okf/<agent-id>/`, or `GE_OKF_ROOT` when set), whose root `index.md`
frontmatter carries the bundle's **provenance** — where it came from and
where it stands. Everything downstream (the generated use-case catalog, the
compiled JSON spec, the built agent) is a compiled artifact of that bundle.

Three verbs move an agent through the lifecycle, and all three run the same
core (`tools/lib/okf-lifecycle.mjs`) from the CLI, the console registry, and
the MCP (Model Context Protocol) server (`factory_okf_customize`,
`factory_agents_register`, `factory_agents_track`):

```bash
ge okf customize --base <agent-id> --id <new-agent-id>   # produce a variant bundle from a base agent
ge agents register --bundle <agent-id> --owner <email>   # draft → registered (+ catalog refresh)
ge agents track --id <agent-id>                          # provenance · registry · lineage
```

## Provenance states

The root `index.md` frontmatter records provenance as flat keys
(`provenance_origin`, `provenance_status`, `provenance_version`,
`provenance_owner`, `provenance_source_ref`, `provenance_created_at`,
`provenance_lineage`). Status moves through four states:

| Status | Meaning | How it gets there |
|---|---|---|
| `draft` | Authored but not yet a tracked agent | interview emission, `ge okf customize`, migration |
| `registered` | Compiled clean and known to the catalog | `ge agents register` |
| `promoted` | Released past the build boundary | release tooling (`ge handoff`) |
| `retired` | No longer built or served | manual edit |

Origins name where a bundle came from: `interview` (the
[interviewing-specs skill](../../skills/interviewing-specs/SKILL.md) emits
bundles via `spec-to-okf-bundle.mjs`), `variant` (`ge okf customize`), `deck`
/ `migration` (imported corpora), or `manual`.

## Customize: variants of a base agent

`ge okf customize` scaffolds the **minimal** variant bundle — a root
`index.md` declaring `variant_of`/`variant_kind` plus one
[Variant Binding](okf.html) concept — and immediately compiles it against its
base with full variant resolution, so a bad swap fails at scaffold time with
the compiler's structured error, never as a silent no-op:

```bash
ge okf customize --base expense-audit --id expense-audit-sap \
  --swap-system concur=sap_concur \
  --rename Concur=SAP \
  --vertical healthcare
```

- `--swap-system <from>=<to>` (repeatable or comma-separated) rewrites every
  reference to a source system the base declares; swapping an undeclared
  system is `OKF_BINDING_UNKNOWN_SYSTEM`.
- `--rename <term>=<replacement>` rewrites display terminology (system names,
  prose, prompts) deterministically, longest term first.
- `--vertical <name>` sets `variant_kind: vertical` and adds a policy-overlay
  stub to edit; without it the kind is `source-swap` (when systems swap) or
  `custom`.
- `--out <dir>` overrides the default `<okf root>/<id>` destination.

The variant's provenance starts as origin `variant`, status `draft`, with the
base id in `provenance_lineage`. Output is deterministic: the same inputs
produce identical bytes.

## Register: draft → registered

`ge agents register --bundle <agent-id | path>` does three things, in order:

1. **Compiles the bundle** (variant resolution included — the base resolves
   as the sibling directory named by `variant_of`, falling back to the corpus
   root). Any compile error blocks registration, reported in the compiler's
   structured what/where/why/fix shape.
2. **Flips provenance** in the root `index.md`: status → `registered`,
   `provenance_version` +1 per run, owner and `provenance_created_at`
   stamped. The edit goes through the OKF parse/render primitives, so every
   other frontmatter key and the body survive byte-for-byte.
3. **Regenerates the catalog** (`bun run catalog`) and reports whether the
   generated registry now carries the agent (`catalogEntry: true/false`).

## Track: where does this agent stand?

`ge agents track --id <agent-id>` reads one bundle and answers three
questions without mutating anything: the provenance block (origin, status,
version, owner), whether the generated registry currently knows the agent,
and the **variant lineage chain** — `variant_of` walked bundle by bundle back
to the root base, with missing links and cycles called out:

```text
Agent — expense-audit-sap
  status     registered
  origin     variant
  version    1
  registry   present
  lineage expense-audit-sap → expense-audit
```

## The corpus root and `GE_OKF_ROOT`

All three verbs resolve agent ids under one corpus root: `GE_OKF_ROOT` when
set (absolute, or relative to the working directory), else `okf/` under the
working directory. Tests and sandboxes point `GE_OKF_ROOT` at a fixture
corpus; explicit directory paths bypass the root entirely.

## Interview → bundle → registered agent

The end-to-end path from a rough idea to a tracked agent:

```bash
# 1. interview produces a validated normalized spec (interviewing-specs skill)
node skills/interviewing-specs/scripts/validate-usecase-spec.mjs <spec.json>

# 2. emit the OKF bundle (origin interview, status draft)
node skills/interviewing-specs/scripts/spec-to-okf-bundle.mjs --spec <spec.json>

# 3. register it — the bundle is now the source of truth
ge agents register --bundle okf/<id> --owner <email>

# 4. build it, and check on it anytime
ge agents build --ids <id> --local
ge agents track --id <id>
```
