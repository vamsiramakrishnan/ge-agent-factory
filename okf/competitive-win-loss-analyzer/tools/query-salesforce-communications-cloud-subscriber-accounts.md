---
type: Agent Tool
title: query_salesforce_communications_cloud_subscriber_accounts
description: "Retrieve subscriber accounts from Salesforce Communications Cloud for the Competitive Win-Loss Analyzer workflow."
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

Retrieve subscriber accounts from Salesforce Communications Cloud for the Competitive Win-Loss Analyzer workflow.

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

- [closed_opportunity_intake_loss_coding](/workflow/closed-opportunity-intake-loss-coding.md)
- [recommend_escalate](/workflow/recommend-escalate.md)

## Evals

- [Run the Competitive Win-Loss Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-win-loss-analyzer-end-to-end.md)
- [Quote #24681095 in service_quotes shows a discount_pct of 22.5% on a term_36 contract, but the matching order_captures record (capture_id 412987650) logs sales_channel as dealer_indirect with device_financing eip_36_month and no note of deal-desk approval on file. Reconcile whether this closed-won deal should be coded as a discount-authority breach or a legitimate indirect-channel promotion before it goes into this week's win-loss briefing, and cite your basis.](/tests/competitive-win-loss-analyzer-discount-reconciliation.md)

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
