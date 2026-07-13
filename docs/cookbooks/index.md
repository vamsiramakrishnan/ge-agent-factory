---
title: Guides
description: Complete a factory task from capture through proof and handoff, with runnable commands, expected outputs, failure modes, and repair steps.
nav_order: 4
has_children: true
layout: default
---

# Guides

Use these guides to **capture** an Enterprise Agent Contract, **prove** a
generated workspace against that contract, and **hand off** the same proven
workspace to the runtime your organization operates. Compilation, source-system
simulation, evaluation, admission, deployment, and live verification sit inside
those three outcomes.

Throughout, "the contract" means the enterprise agent contract — concretely,
the use-case spec (`usecase-spec.json`, or `agent-spec.json` when it comes out
of the interview). Its portable Markdown form is the OKF (Open Knowledge Format) bundle. See
[The enterprise agent contract](../concepts/enterprise-agent-contract.html)
and the [Glossary](../GLOSSARY.html).

## Recommended paths

<p align="center">
  <img src="../assets/diagrams/cookbook-paths.svg" alt="four guide paths: fresh clone with no cloud runs getting started, capture in the interview, compile a contract, prove an agent; business use case runs capture from documents, capture in the interview, contract to OKF, compile a contract; new source system runs capture from OpenAPI, generate simulations, prove an agent; first cloud release runs provision the platform, deploy the agent gateway, run and observe" width="800">
</p>

| Situation | Path |
|---|---|
| Fresh clone, no cloud | [Getting started](../start/getting-started.html) → [Capture a contract in the interview](capture-from-interview.html) → [Compile a contract](compile-a-contract.html) → [Prove an agent](prove-an-agent.html) |
| Business use case, no contract yet | [Capture a contract from documents](capture-from-documents.html) → [Capture a contract in the interview](capture-from-interview.html) → [Contract ⇄ OKF](spec-to-okf.html) → [Compile a contract](compile-a-contract.html) |
| New source system | [Capture a source system from OpenAPI](capture-from-openapi.html) → [Generate simulations](generate-simulations.html) → [Prove an agent](prove-an-agent.html) |
| First cloud release | [Provision the platform](../operations/provision-the-platform.html) → [Deploy and publish a proven workspace](handoff-adk-gemini-enterprise.html) → [Prove it live](prove-live.html) |

## Capture

| Guide | Outcome |
|---|---|
| [Capture a contract in the interview](capture-from-interview.html) | A saved contract with a workflow and answerable queries |
| [Capture a contract from documents](capture-from-documents.html) | A contract grounded in a BRD or policy source |
| [Capture a source system from OpenAPI](capture-from-openapi.html) | A simulated source-system twin synthesized from an API description |
| [Contract ⇄ OKF](spec-to-okf.html) | A portable Open Knowledge Format bundle and a verified round-trip |

## Prove

| Guide | Outcome |
|---|---|
| [Compile a contract](compile-a-contract.html) | A runnable agent workspace generated from the contract |
| [Generate simulations](generate-simulations.html) | Deterministic source-system twins mounted or promoted into the corpus |
| [Compile behavioral evaluations](compile-behavioral-evals.html) | An executable evaluation suite with coverage, grading data, and a load profile |
| [Prove an agent](prove-an-agent.html) | Contract-derived evaluations and promotion evidence for a local workspace |
| [Repair a failed proof](repair-failed-proof.html) | A diagnosed blocker and a repaired, re-proven workspace |
| [Admit an agent](admit-an-agent.html) | A signed Agent Passport and a recorded admission decision |

## Hand off and operate

| Guide | Outcome |
|---|---|
| [Use a generated workspace with agents-cli](handoff-agents-cli.html) | The standard agents-cli and Agent Development Kit project opened and evaluated directly |
| [Deploy and publish a proven workspace](handoff-adk-gemini-enterprise.html) | The proven workspace deployed to Agent Engine and published to Gemini Enterprise |
| [Drive a shipped agent](drive-a-shipped-agent.html) | A live, instrumented conversation that can become an evaluation case or cassette |
| [Prove the shipped agent live](prove-live.html) | Evaluation cases run through the deployed assist surface with a live gate verdict |
| [Bench against live budgets](bench-live-budgets.html) | Latency and error budgets checked against live traffic or cassette replay |

## Extend

| Guide | Outcome |
|---|---|
| [Bring your own systems](bring-your-own-systems.html) | System bindings, evaluation packs, models, and policy choices packaged in one validated manifest |

> Each guide states its scope before the first command, including whether the
> task is local-only or can change cloud resources.
{: .note }
