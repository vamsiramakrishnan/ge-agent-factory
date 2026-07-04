---
type: Agent Tool
title: query_salesforce_communications_cloud_subscriber_accounts
description: Retrieve subscriber accounts from Salesforce Communications Cloud for the Site Serviceability Qualification Agent workflow.
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

# query_salesforce_communications_cloud_subscriber_accounts

Retrieve subscriber accounts from Salesforce Communications Cloud for the Site Serviceability Qualification Agent workflow.

- **Kind:** query
- **Source system:** [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)

## Inputs

- subscriber_key
- account_number
- date_range

## Outputs

- subscriber_accounts_records
- subscriber_accounts_summary

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

- [multi_site_address_intake_crm_reconciliation](/workflow/multi-site-address-intake-crm-reconciliation.md)
- [serviceability_matrix_publish_opportunity_handoff](/workflow/serviceability-matrix-publish-opportunity-handoff.md)

## Evals

- [Run the Site Serviceability Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/site-serviceability-qualification-agent-end-to-end.md)
- [Service quote Q24817635 for business account 'Meridian Health Partners' (enterprise_dia_100m bundle, 36-month term) shows serviceability_confirmed = true and mrr_usd of $4,850 in Salesforce Communications Cloud, but the TELCO 3 facilities record for that address (telco_3_records source_record_id 88214) is still status = pending with no lit-building confirmation logged. Reconcile this before the deal moves to order capture, and tell me if we can commit a fiber install date.](/tests/site-serviceability-qualification-agent-conflicting-serviceability-flag.md)

## Evidence emitted

- source_system_record

## Required inputs

- subscriber_key
- account_number
- date_range

## Produces

- subscriber_accounts_records
- subscriber_accounts_summary

# Examples

```
query_salesforce_communications_cloud_subscriber_accounts(subscriber_key=<subscriber_key>, account_number=<account_number>, date_range=<date_range>)
```

# Citations

- [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)
