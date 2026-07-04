---
type: Agent Tool
title: query_ardoq_ardoq_records
description: "Retrieve ardoq records from Ardoq for the API Catalog & Governance workflow."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ardoq_ardoq_records

Retrieve ardoq records from Ardoq for the API Catalog & Governance workflow.

- **Kind:** query
- **Source system:** [Ardoq](/systems/ardoq.md)

## Inputs

- lookup_key
- date_range

## Outputs

- ardoq_records_records
- ardoq_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ardoq](/systems/ardoq.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [api_discovery](/workflow/api-discovery.md)

## Evals

- [Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/api-catalog-governance-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- ardoq_records_records
- ardoq_records_summary

# Examples

```
query_ardoq_ardoq_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Ardoq](/systems/ardoq.md)
