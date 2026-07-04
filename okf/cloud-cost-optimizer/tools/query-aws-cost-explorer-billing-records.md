---
type: Agent Tool
title: query_aws_cost_explorer_billing_records
description: Retrieve billing records from AWS Cost Explorer for the Cloud Cost Optimizer workflow.
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

# query_aws_cost_explorer_billing_records

Retrieve billing records from AWS Cost Explorer for the Cloud Cost Optimizer workflow.

- **Kind:** query
- **Source system:** [AWS Cost Explorer](/systems/aws-cost-explorer.md)

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

No explicit permission scopes declared; source-system access is tied to [AWS Cost Explorer](/systems/aws-cost-explorer.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_cloud_spend_aggregation](/workflow/multi-cloud-spend-aggregation.md)
- [approval_tracking](/workflow/approval-tracking.md)

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
query_aws_cost_explorer_billing_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [AWS Cost Explorer](/systems/aws-cost-explorer.md)
