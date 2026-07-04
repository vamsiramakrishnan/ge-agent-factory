---
type: Agent Tool
title: query_palo_alto_palo_alto_records
description: "Retrieve palo alto records from Palo Alto for the Network & DNS Health Monitor workflow."
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

# query_palo_alto_palo_alto_records

Retrieve palo alto records from Palo Alto for the Network & DNS Health Monitor workflow.

- **Kind:** query
- **Source system:** [Palo Alto](/systems/palo-alto.md)

## Inputs

- lookup_key
- date_range

## Outputs

- palo_alto_records_records
- palo_alto_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Palo Alto](/systems/palo-alto.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [health_data_collection](/workflow/health-data-collection.md)

## Evals

- [Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/network-dns-health-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- palo_alto_records_records
- palo_alto_records_summary

# Examples

```
query_palo_alto_palo_alto_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Palo Alto](/systems/palo-alto.md)
