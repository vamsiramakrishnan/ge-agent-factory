---
type: Agent Tool
title: query_salesforce_financial_services_cloud_client_households
description: Retrieve client households from Salesforce Financial Services Cloud for the Advisory Fee Billing Anomaly Analyzer workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_salesforce_financial_services_cloud_client_households

Retrieve client households from Salesforce Financial Services Cloud for the Advisory Fee Billing Anomaly Analyzer workflow.

- **Kind:** query
- **Source system:** [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)

## Inputs

- household_id
- date_range

## Outputs

- client_households_records
- client_households_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Advisory Fee Billing Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/advisory-fee-billing-anomaly-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- household_id
- date_range

## Produces

- client_households_records
- client_households_summary

# Examples

```
query_salesforce_financial_services_cloud_client_households(household_id=<household_id>, date_range=<date_range>)
```

# Citations

- [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
