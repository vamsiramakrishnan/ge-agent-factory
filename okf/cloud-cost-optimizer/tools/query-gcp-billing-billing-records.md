---
type: Agent Tool
title: query_gcp_billing_billing_records
description: Retrieve billing records from GCP Billing for the Cloud Cost Optimizer workflow.
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

# query_gcp_billing_billing_records

Retrieve billing records from GCP Billing for the Cloud Cost Optimizer workflow.

- **Kind:** query
- **Source system:** [GCP Billing](/systems/gcp-billing.md)

## Inputs

- lookup_key
- date_range

## Outputs

- billing_records_records
- billing_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [GCP Billing](/systems/gcp-billing.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_cloud_spend_aggregation](/workflow/multi-cloud-spend-aggregation.md)

## Evals

- [Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cloud-cost-optimizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- billing_records_records
- billing_records_summary

# Examples

```
query_gcp_billing_billing_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GCP Billing](/systems/gcp-billing.md)
