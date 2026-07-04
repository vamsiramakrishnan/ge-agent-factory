---
type: Agent Tool
title: query_asn_data_asn_data_records
description: Retrieve asn data records from ASN Data for the Delivery Performance Monitor workflow.
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

# query_asn_data_asn_data_records

Retrieve asn data records from ASN Data for the Delivery Performance Monitor workflow.

- **Kind:** query
- **Source system:** [ASN Data](/systems/asn-data.md)

## Inputs

- lookup_key
- date_range

## Outputs

- asn_data_records_records
- asn_data_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ASN Data](/systems/asn-data.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [shipment_data_ingestion](/workflow/shipment-data-ingestion.md)
- [otif_analytics_prediction](/workflow/otif-analytics-prediction.md)

## Evals

- [Run the Delivery Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/delivery-performance-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- asn_data_records_records
- asn_data_records_summary

# Examples

```
query_asn_data_asn_data_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [ASN Data](/systems/asn-data.md)
