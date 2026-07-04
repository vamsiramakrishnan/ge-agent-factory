---
type: Query Capability
title: Gemini generates specific implementation instructions for each optimization —...
description: "Gemini generates specific implementation instructions for each optimization — rewritten queries, DDL for partitioning, and clustering recommendations with before/after cost projections."
source_id: "implementation-guidance"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates specific implementation instructions for each optimization — rewritten queries, DDL for partitioning, and clustering recommendations with before/after cost projections.

## Tools used

- [lookup_cost_per_query_optimizer_runbook](/tools/lookup-cost-per-query-optimizer-runbook.md)
- [action_bigquery_recommend](/tools/action-bigquery-recommend.md)

## Runs in

- [implementation_guidance](/workflow/implementation-guidance.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Cost-per-Query Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cost-per-query-optimizer-end-to-end.md)

# Citations

- [Cost-per-Query Optimizer Operations Runbook](/documents/cost-per-query-optimizer-runbook.md)
