---
type: Agent Tool
title: query_salesforce_financial_services_cloud_financial_accounts
description: Retrieve financial accounts from Salesforce Financial Services Cloud for the Advisor Next Best Action Engine workflow.
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

# query_salesforce_financial_services_cloud_financial_accounts

Retrieve financial accounts from Salesforce Financial Services Cloud for the Advisor Next Best Action Engine workflow.

- **Kind:** query
- **Source system:** [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
- **API:** POST /api/salesforce_financial_services_cloud/recommend

## Inputs

- account_number
- household_id
- date_range

## Outputs

- financial_accounts_records

## Side Effects

- May change Salesforce Financial Services Cloud state because the spec classifies it as query.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — query_salesforce_financial_services_cloud_financial_accounts](/policies/confirmation-query-salesforce-financial-services-cloud-financial-accounts.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- account_number
- household_id
- date_range

## Produces

- financial_accounts_records

# Examples

```
query_salesforce_financial_services_cloud_financial_accounts(account_number=<account_number>, household_id=<household_id>, date_range=<date_range>)
```

# Citations

- [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
- [Confirmation policy — query_salesforce_financial_services_cloud_financial_accounts](/policies/confirmation-query-salesforce-financial-services-cloud-financial-accounts.md)
- [Idempotency policy — query_salesforce_financial_services_cloud_financial_accounts](/policies/idempotency-query-salesforce-financial-services-cloud-financial-accounts.md)
