---
title: Live Proof
parent: Core Concepts
nav_order: 8
layout: default
description: Verifying the shipped agent through the same assist surface real users hit — sessions, responder identity, transcripts, budgets, and how live verdicts gate promotion.
---

# Live Proof

**Definition:** live proof verifies that the *deployed* agent still satisfies
its behavioral contract — through the same streaming assist surface real
users talk to, not a local re-enactment of it.

## Why it exists

Local proof shows the agent you built behaves. It cannot show that the agent
you *shipped* behaves: deployment adds registration, identity, routing,
retrieval configuration, and a streaming transport, and each of those can
silently change behavior. Live proof drives recorded conversations at the
deployed agent, captures what actually streamed back, and grades it with the
same criteria the local suite used — so "works on my machine" and "works in
production" become the same sentence with two verdicts.

## What a live run checks

Every live conversation produces one **transcript** — the shared record used
by interactive driving, proof runs, and load runs alike. From it, live proof
asserts four things the local lane never could:

- **Session threading.** A multi-turn conversation must continue the session
  the service handed back on the previous turn; a dropped session is a
  correctness failure, not a cosmetic one.
- **Responder identity.** The response must come from the agent you meant to
  test. Identity is asserted from evidence in the stream, and an
  unverifiable responder is reported as `unknown` rather than assumed.
- **Streaming health.** Time to first text, full-response time, and
  inter-chunk stalls are measured per turn and checked against budgets.
- **Behavioral parity.** The same graded criteria as the local lane —
  response quality, grounding, safety, task completion — applied to what the
  deployed surface actually said. Metrics that need internals the live
  stream does not expose are marked *not applicable*, never silently passed.

## Recording and replay

Live traffic costs money and changes with every model update, so live proof
records. Each run can save its exact stream — request bodies, chunk timings,
final states — as a replayable file. Replays make the whole live feature set
testable offline: the default test suite runs entirely against recordings,
and real traffic is an explicit, budget-capped opt-in. A green live run can
also be promoted to a *baseline*; later runs compare against it and report
drift in behavior, identity, tools, or citations.

## From verdict to gate

A live run does not end in a chart; it ends in a verdict — pass or fail
against the contract's expectations and the configured budgets, with named
blockers and a next command. That verdict can be required before release the
same way local proof already is: local proof for every change, live proof for
release branches, latency budgets for promotion to production.

## Where to go next

- [The Behavioral Compiler](./behavioral-compiler.html) — where live
  conversation scripts come from.
- [Evals as Proof](./evals-as-proof.html) — why verdicts, not dashboards,
  gate release.
- [Agent Passport & Proof Pack](./agent-passport-and-proof-pack.html) — where
  live transcripts and verdicts land as auditable files.
