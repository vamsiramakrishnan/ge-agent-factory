---
type: Agent Tool
title: query_carrier_reports_carrier_reports_records
description: "Retrieve carrier reports records from Carrier Reports for the Benefits Utilization & Cost Analyzer workflow."
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

# query_carrier_reports_carrier_reports_records

Retrieve carrier reports records from Carrier Reports for the Benefits Utilization & Cost Analyzer workflow.

- **Kind:** query
- **Source system:** [Carrier Reports](/systems/carrier-reports.md)

## Inputs

- lookup_key
- date_range

## Outputs

- carrier_reports_records_records
- carrier_reports_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Carrier Reports](/systems/carrier-reports.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [carrier_data_aggregation](/workflow/carrier-data-aggregation.md)

## Evals

- [Run the Benefits Utilization & Cost Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/benefits-utilization-cost-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- carrier_reports_records_records
- carrier_reports_records_summary

# Examples

```
query_carrier_reports_carrier_reports_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Carrier Reports](/systems/carrier-reports.md)
