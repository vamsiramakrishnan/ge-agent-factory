---
type: Query Capability
title: "Gemini synthesizes an answer from retrieved knowledge, incorporating recent c..."
description: "Gemini synthesizes an answer from retrieved knowledge, incorporating recent changes (e.g., 'use GlobalProtect instead of Cisco AnyConnect since March 2024'). Adapts language to user's technical level."
source_id: "contextual-answer-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini synthesizes an answer from retrieved knowledge, incorporating recent changes (e.g., 'use GlobalProtect instead of Cisco AnyConnect since March 2024'). Adapts language to user's technical level.

## Tools used

- [lookup_knowledge_base_auto_resolver_runbook](/tools/lookup-knowledge-base-auto-resolver-runbook.md)

## Runs in

- [contextual_answer_generation](/workflow/contextual-answer-generation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/knowledge-base-auto-resolver-end-to-end.md)

# Citations

- [Knowledge Base Auto-Resolver Operations Runbook](/documents/knowledge-base-auto-resolver-runbook.md)
