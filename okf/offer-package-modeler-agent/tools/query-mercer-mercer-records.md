---
type: Agent Tool
title: query_mercer_mercer_records
description: Retrieve mercer records from Mercer for the Offer Package Modeler Agent workflow.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_mercer_mercer_records

Retrieve mercer records from Mercer for the Offer Package Modeler Agent workflow.

- **Kind:** query
- **Source system:** [Mercer](/systems/mercer.md)

## Inputs

- lookup_key
- date_range

## Outputs

- mercer_records_records
- mercer_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Mercer](/systems/mercer.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [market_data_assembly](/workflow/market-data-assembly.md)

## Evals

- [Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offer-package-modeler-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- mercer_records_records
- mercer_records_summary

# Examples

```
query_mercer_mercer_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Mercer](/systems/mercer.md)
