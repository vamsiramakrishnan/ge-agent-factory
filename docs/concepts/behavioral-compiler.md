---
title: The Behavioral Compiler
parent: Core Concepts
nav_order: 7
layout: default
description: How an Enterprise Agent Contract compiles into executable behavior — capability, authority, and tool-behavior graphs that become evalsets, live conversations, and proof artifacts.
---

# The Behavioral Compiler

**Definition:** the behavioral compiler turns an
[Enterprise Agent Contract](./enterprise-agent-contract.html) into
*executable behavior*: typed graphs of what the agent must do, must not do,
and must prove — from which evalsets, simulated conversations, live
conversation scripts, and load profiles are generated rather than
brainstormed.

## Why it exists

An eval suite written by hand mirrors what its author remembered to worry
about. A compiled suite mirrors the contract itself: every capability the
contract claims, every evidence rule it imposes, every tool it authorizes gets
its scenarios *derived*, the way a type checker derives obligations from a
signature. The compiler is what keeps proof honest as contracts evolve —
change the contract, recompile, and the suite changes with it.

## Inputs

The compiler reads what already exists, in priority order:

1. the captured agent contract (the same one the Interview produces),
2. the agent spec's behavior contract — scope, tool intents, evidence
   requirements, escalation and refusal rules, golden evals
   (see the [spec reference](../reference/spec-schema.html)),
3. the generated workspace manifest.

## Intermediate graphs

| Graph | Nodes / edges | Compiled from |
| --- | --- | --- |
| Capability | things the agent can be asked to do, with success and forbidden states | in-scope / out-of-scope declarations, answerable queries |
| Authority | claims → evidence sources, with citation and freshness rules | evidence requirements (see [The Authority Graph](./authority-graph.html)) |
| Tool behavior | read/write character, confirmation and idempotency obligations | tool intents |
| Persona | who is asking, and how (confused, impatient, expert, unauthorized) | user roles |
| World | small deterministic states of the surrounding systems (healthy, degraded, conflicting) | source systems |
| Conversation | planned multi-turn cases with expectations (must call, must cite, must refuse) | all of the above |

## From graphs to artifacts

The conversation graph deliberately over-generates: every capability gets a
happy path, a missing-evidence case, a conflicting-evidence case, an
out-of-scope probe, an ambiguous opening, and an interruption; every write
tool gets confirmation, duplicate-submission, cancellation, and
permission-failure cases. A set-cover selector then picks the smallest suite
that still covers every capability, claim, write tool, refusal, and
escalation — weighted so risky writes and sensitive claims are never the ones
trimmed.

The selected cases are emitted as ordinary, tool-compatible artifacts: ADK
(Agent Development Kit) evalsets, grading datasets, live conversation
scripts, and load profiles. GE compiles behavior and carries the verdicts;
the grading engines and metrics stay the platform's (ADK and the agents
CLI). Coverage — what was generated, what was selected, what remains
uncovered — is itself an artifact, not a claim.

## Local and live, same behavior

The same compiled cases run against two execution targets: the local build
(fast, free, debuggable) and the deployed agent's real assist surface
([Live Proof](./live-proof.html)). Local runs are for iteration; live runs
are release verification. Because both consume the same graph, a behavior
that passes locally and fails live is a *deployment* discrepancy by
construction, not a test-authoring discrepancy.

## Relation to evals as proof

[Evals as Proof](./evals-as-proof.html) explains why passing evals gate
release. The behavioral compiler is where those evals come from. Together
they close the loop the factory promises: business authority in, compiled
behavior out, verdicts before release.
