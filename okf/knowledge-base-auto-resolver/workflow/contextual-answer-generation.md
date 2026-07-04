---
type: Workflow Stage
title: Contextual Answer Generation
description: "Gemini synthesizes an answer from retrieved knowledge, incorporating recent changes (e.g., 'use GlobalProtect instead of Cisco AnyConnect since March 2024'). Adapts language to user's technical level."
source_id: contextual_answer_generation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contextual Answer Generation

Gemini synthesizes an answer from retrieved knowledge, incorporating recent changes (e.g., 'use GlobalProtect instead of Cisco AnyConnect since March 2024'). Adapts language to user's technical level.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [lookup_knowledge_base_auto_resolver_runbook](/tools/lookup-knowledge-base-auto-resolver-runbook.md)

Next: [Resolution Tracking & Gap Detection](/workflow/resolution-tracking-gap-detection.md)
