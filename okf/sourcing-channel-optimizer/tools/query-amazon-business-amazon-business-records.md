---
type: Agent Tool
title: query_amazon_business_amazon_business_records
description: Retrieve amazon business records from Amazon Business for the Sourcing Channel Optimizer workflow.
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

# query_amazon_business_amazon_business_records

Retrieve amazon business records from Amazon Business for the Sourcing Channel Optimizer workflow.

- **Kind:** query
- **Source system:** [Amazon Business](/systems/amazon-business.md)

## Inputs

- lookup_key
- date_range

## Outputs

- amazon_business_records_records
- amazon_business_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Amazon Business](/systems/amazon-business.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [transaction_data_assembly](/workflow/transaction-data-assembly.md)

## Evals

- [Run the Sourcing Channel Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sourcing-channel-optimizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- amazon_business_records_records
- amazon_business_records_summary

# Examples

```
query_amazon_business_amazon_business_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Amazon Business](/systems/amazon-business.md)
