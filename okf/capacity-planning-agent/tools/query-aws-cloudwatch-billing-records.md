---
type: Agent Tool
title: query_aws_cloudwatch_billing_records
description: Retrieve billing records from AWS CloudWatch for the Capacity Planning Agent workflow.
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

# query_aws_cloudwatch_billing_records

Retrieve billing records from AWS CloudWatch for the Capacity Planning Agent workflow.

- **Kind:** query
- **Source system:** [AWS CloudWatch](/systems/aws-cloudwatch.md)

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

No explicit permission scopes declared; source-system access is tied to [AWS CloudWatch](/systems/aws-cloudwatch.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [utilization_collection](/workflow/utilization-collection.md)

## Evals

- [Run the Capacity Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capacity-planning-agent-end-to-end.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- billing_records_records
- billing_records_summary

# Examples

```
query_aws_cloudwatch_billing_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [AWS CloudWatch](/systems/aws-cloudwatch.md)
