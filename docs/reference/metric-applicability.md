---
title: Metric applicability
parent: Reference
nav_order: 13
layout: default
description: Which eval metric families apply locally vs through the live assist surface, why, and the honest-status policy — unavailable and not_applicable are never silent passes.
---

# Metric applicability

Two rails run a compiled eval suite:

- **Local ADK** — the generated workspace's own eval run, with full control
  of the loop: reference answers, tool-call interception, deterministic
  fixtures.
- **Live stream-assist** — the deployed agent through its real assist
  surface, where GE owns transport-level facts the local rail cannot even
  see (real latency, session threading, responder identity) but can only
  observe what the stream exposes.

Not every metric can grade both rails. This matrix is the single answer to
"can metric X grade rail Y" — kept as data
(`packages/evalkit/src/metric-applicability.mjs`) so docs, the CLI,
and gating code all read the same source. `ge evals compile` also writes it
to `.ge/proof/metric-applicability.json` alongside every compiled suite.

```bash
bun tools/ge.mjs evals applicability             # human view
bun tools/ge.mjs evals applicability --markdown  # this table
```

## The matrix

| Metric | Family | Local ADK | Live stream-assist | Notes |
| --- | --- | --- | --- | --- |
| exact tool trajectory | tool_use | yes | conditional | live grading needs tool-call metadata surfaced in the stream-assist transcript; text-only transcripts cannot be graded for trajectory |
| response match | response_quality | yes | yes | applies on either rail whenever the case carries a reference answer |
| final response LLM judge | response_quality | yes | yes | reference-free rubric judging works on any final response |
| hallucination | grounding | yes | yes | needs grounding evidence (retrieved context or cited records) alongside the response on both rails |
| safety | safety | yes | yes | response-only classification; rail-independent |
| multi-turn task success | multi_turn | yes | yes | judged over the whole conversation; both rails replay the case's full turn list |
| multi-turn trajectory quality | multi_turn | yes | yes | conversation-level rubric (clarifies, recovers, stays on task) applies on both rails |
| latency budgets | operational | no | yes | GE-owned: only the live rail observes real transport and time-to-first-token |
| responder identity | operational | no | yes | GE-owned: verifies the deployed agent (not a fallback/proxy) answered; meaningless locally |
| session threading | operational | no | yes | GE-owned: checks turns land in one live session/thread; the local harness threads by construction |

## Honest statuses

When [`ge prove --live`](../cookbooks/prove-live.html) grades a case, every
metric reports one of `pass`, `fail`, `warning`, `unavailable`, or
`not_applicable` — and the last two are *reported*, never silently passed:

- **`unavailable`** — the metric applies in principle but the live stream did
  not carry the evidence to grade it. The canonical case is tool trajectory:
  when a case declares `mustCall` expectations but the stream exposed no tool
  metadata, the metric says so instead of passing by omission. Trajectory
  stays checkable on the local rail.
- **`not_applicable`** — the case declares no expectation for this metric
  (no reference answer for response match, no tool expectations, no citation
  requirements) or no expected agent was configured for responder identity.

## Owned vs delegated

The GE-owned metrics on the live rail are deterministic and structural:
transport, session threading, responder identity, latency budgets, token-F1
response match against recorded references, tool-set checks, and citation
presence. **Judged** metrics — LLM-judged final response quality,
hallucination, safety, multi-turn rubrics — delegate to the platform graders
that run the agents-cli grading dataset (`ge evals compile` emits
`<spec-id>.agents-cli-dataset.json` for exactly this). Live proof reports
its structural stand-ins explicitly as such (`response_match` labels itself
"structural check; judged quality is delegated") rather than impersonating a
judge.

See [The Behavioral Compiler](../concepts/behavioral-compiler.html) for how
suites are derived, and [Live Proof](../concepts/live-proof.html) for the
live rail's checks.
