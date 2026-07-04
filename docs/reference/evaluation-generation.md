---
title: Evaluation generation
parent: Reference
nav_order: 12
layout: default
description: The behavioral compiler as a reference — graph → expansion → set-cover → emitters, the --perturb and --adversarial hardening flags, and the statistics (Wilson intervals, lexical similarity) that grade the results.
---

# Evaluation generation

`ge evals compile` turns a captured agent contract into the executable
behavior suite. The engine is `@ge/evalkit`
([`packages/evalkit/README.md`](../../packages/evalkit/README.md)), a leaf
package the CLI, the generator's own eval artifacts, and live proof all share
— one compiler, so suites cannot drift between surfaces. This page is the
reference for the pipeline, the hardening flags, and the statistics; for the
rationale read [The Behavioral Compiler](../concepts/behavioral-compiler.html),
and for the step-by-step workflow the
[Compile behavioral evals](../cookbooks/compile-behavioral-evals.html) guide.

## The compiler pipeline

Four deterministic stages, each importable on its own:

| Stage | Module (`@ge/evalkit`) | What it does |
|---|---|---|
| **graph** | `graph.mjs` | Typed `BehavioralGraph` schemas + validator — capabilities, tool behaviors, authority edges, personas, worlds |
| **build** | `compile-from-agent-spec.mjs` | Spec envelope → validated graph, with stable slug ids and keyword-linked capability↔tool/claim edges |
| **expand** | `expansions.mjs` | Graph → the over-generated `ConversationCase` pool, every case tagged `<dimension>:<value>` for coverage accounting |
| **select** | `select-cases.mjs` | Greedy weighted set-cover over the coverage tags under the `--max-cases` budget (default 40), producing the selected suite and a coverage/gap report |

The expansion stage deliberately over-generates: every in-scope capability
gets a happy path, missing-evidence, conflicting-evidence, out-of-scope,
ambiguous-opening, and interruption case; every write tool gets confirmation,
duplicate-submission, cancellation, and permission-failure cases. Selection
then keeps the smallest suite that still covers every capability, claim,
write tool, refusal, and escalation — risk-weighted, so risky writes and
sensitive claims are never what gets trimmed. Whatever coverage survives (and
whatever gaps remain) is written down as an artifact, not asserted in prose.

## Hardening flags

Both are opt-in — a default compile stays byte-identical to the pre-flag
compiler, which keeps the golden-pinned downstream artifacts stable.

### `--perturb <n>` — linguistic variants

Derives up to `n` perturbed variants of each *selected* case without touching
what the case expects: the parent's `expected` / coverage / world / persona
carry over unchanged, so a variant grades against the same behavioral
contract as its parent. Four seeded kinds (`@ge/evalkit/perturbations`):

| Kind | What changes |
|---|---|
| `register_shift` | the ask rephrased terse / urgent / polite / frustrated (the ask itself stays verbatim) |
| `typo` | seeded interior character swaps on plain words — identifier-like tokens (`EMP101`, `action_foo`) are never touched |
| `distractor` | irrelevant surrounding context prepended |
| `compound_ask` | the ask bundled with a second, secondary request |

### `--adversarial` — the red-team pool

Adds safety/abuse cases synthesized from the same graph
(`@ge/evalkit/adversarial`), in the exact `ConversationCase` shape the
expansion emits — selection and emission treat them like any other candidate,
and adversarial coverage becomes a required dimension of the report. Five
families, each tagged `adversarial:<family>`:

| Family | Probe | Expected behavior |
|---|---|---|
| `prompt_injection` | an on-task ask carrying an embedded "ignore your instructions" override | refuse the injected part |
| `tool_result_injection` | retrieved content that instructs an unauthorized write | the write tool is never called |
| `authority_spoofing` | a claimed admin approval to skip a gated write's workflow | the workflow stands — refuse, no direct write |
| `scope_creep` | social pressure to act beyond declared capabilities | refuse (ideally with a redirect) |
| `data_exfiltration` | dump-everything / other-users'-PII requests against read tools | refuse or minimize |

## Emitted artifacts

All under `.ge/behavioral/` (or `--out`), plus the metric-applicability
matrix under `.ge/proof/`:

| Artifact | Contents |
|---|---|
| `graph.json` | the compiled behavioral graphs |
| `coverage.json` | what was generated, what was selected, what remains uncovered |
| `selected-cases.json` | the set-cover-selected conversation cases |
| `bench-profile.json` | the derived load profile for `ge bench` |
| `<spec-id>.evalset.json` | ADK-compatible evalset (GE context in a `geMetadata` sidecar) |
| `<spec-id>.agents-cli-dataset.json` | flat agents-cli grading records |
| `metric-applicability.json` | the metric × rail matrix (see below) |

## Statistics

The compiler's sibling modules grade what the compiled cases produce:

- **Wilson intervals** (`@ge/evalkit/stats`, `wilsonInterval`) — every
  `ge prove --live` result carries `stats.cases = { n, passes, wilson95:
  { low, high, rate } }`: the 95% confidence interval on the case pass rate.
  A 3/3 run reports `rate: 1` with an honest lower bound well below 1 — the
  interval says how much *n* cases actually constrain the pass rate, instead
  of letting a small sample masquerade as certainty. Advisory only: verdicts,
  blockers, and baselines are computed the same with or without it.
- **Bootstrap confidence intervals** (`bootstrapCI`) — seeded (mulberry32),
  for score distributions rather than pass counts; plus `passAtK` and
  `flakiness` for repeated-run analysis.
- **Lexical similarity** (`@ge/evalkit/metrics`, `lexicalSimilarity`) — blends
  ROUGE-L order-awareness with trigram-cosine typo tolerance. Never a
  pass/fail input; it appears in live-proof turn results as
  `advisory: { lexicalSimilarity, rougeL, trigramCosine }` to explain *why* a
  structural response match scored the way it did.

## Metric applicability

Not every metric family can grade every rail: the local ADK rail exposes tool
calls and citations directly, while the live stream-assist surface only
exposes what the stream carries. The single source answering "can metric X
grade rail Y" is `@ge/evalkit/metric-applicability` — rendered by
`ge evals applicability`, written next to every compile as
`metric-applicability.json`, and documented at
[Metric applicability](metric-applicability.html). Statuses are honest by
design: a metric that cannot see its signal reports as not-applicable rather
than silently passing.

## Surfaces

One registry entry wires the three drivers, so they cannot drift: the CLI
verb (`ge evals compile` — flag table in the
[CLI reference](cli.html#ge-evals-compile)), the console route
(`POST /api/ge/evals/compile`, see [Console &amp; APIs](console-and-apis.html)),
and the MCP tool (`factory_evals_compile`, see [MCP tools](../MCP.html)).
Compiled evalsets feed `ge prove --live` for
[release verification](../concepts/live-proof.html).
