---
type: Agent Tool
title: query_supplier_databases_supplier_databases_records
description: Retrieve supplier databases records from Supplier databases for the Sole/Single Source Justification Drafter workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_supplier_databases_supplier_databases_records

Retrieve supplier databases records from Supplier databases for the Sole/Single Source Justification Drafter workflow.

- **Kind:** query
- **Source system:** [Supplier databases](/systems/supplier-databases.md)

## Inputs

- lookup_key
- date_range

## Outputs

- supplier_databases_records_records
- supplier_databases_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Supplier databases](/systems/supplier-databases.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [market_alternative_scan](/workflow/market-alternative-scan.md)
- [justification_drafting_challenge](/workflow/justification-drafting-challenge.md)

## Evals

- [Run the Sole/Single Source Justification Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sole-single-source-justification-drafter-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- supplier_databases_records_records
- supplier_databases_records_summary

# Examples

```
query_supplier_databases_supplier_databases_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Supplier databases](/systems/supplier-databases.md)
