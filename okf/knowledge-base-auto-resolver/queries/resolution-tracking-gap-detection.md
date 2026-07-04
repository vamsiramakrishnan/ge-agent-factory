---
type: Query Capability
title: "Track self-service resolution rates. Identify knowledge gaps where users cons..."
description: "Track self-service resolution rates. Identify knowledge gaps where users consistently escalate despite KB articles existing. Auto-suggest new articles for common unresolved queries."
source_id: "resolution-tracking-gap-detection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track self-service resolution rates. Identify knowledge gaps where users consistently escalate despite KB articles existing. Auto-suggest new articles for common unresolved queries.

## Tools used

- [lookup_knowledge_base_auto_resolver_runbook](/tools/lookup-knowledge-base-auto-resolver-runbook.md)

## Runs in

- [resolution_tracking_gap_detection](/workflow/resolution-tracking-gap-detection.md)

## Evidence expected

- document_reference

## Evals

- [Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/knowledge-base-auto-resolver-end-to-end.md)

# Citations

- [Knowledge Base Auto-Resolver Operations Runbook](/documents/knowledge-base-auto-resolver-runbook.md)
