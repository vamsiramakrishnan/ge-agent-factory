---
type: Agent Tool
title: query_salesforce_communications_cloud_service_quotes
description: Retrieve service quotes from Salesforce Communications Cloud for the Enterprise RFP Response Agent workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_salesforce_communications_cloud_service_quotes

Retrieve service quotes from Salesforce Communications Cloud for the Enterprise RFP Response Agent workflow.

- **Kind:** query
- **Source system:** [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)

## Inputs

- quote_number
- date_range

## Outputs

- service_quotes_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- quote_number
- date_range

## Produces

- service_quotes_records

# Examples

```
query_salesforce_communications_cloud_service_quotes(quote_number=<quote_number>, date_range=<date_range>)
```

# Citations

- [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)
