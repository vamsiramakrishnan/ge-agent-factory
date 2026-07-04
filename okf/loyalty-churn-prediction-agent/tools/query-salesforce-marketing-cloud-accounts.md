---
type: Agent Tool
title: query_salesforce_marketing_cloud_accounts
description: Retrieve accounts from Salesforce Marketing Cloud for the Loyalty Churn Prediction Agent workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_salesforce_marketing_cloud_accounts

Retrieve accounts from Salesforce Marketing Cloud for the Loyalty Churn Prediction Agent workflow.

- **Kind:** query
- **Source system:** [Salesforce Marketing Cloud](/systems/salesforce-marketing-cloud.md)

## Inputs

- lookup_key
- date_range

## Outputs

- accounts_records
- accounts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Marketing Cloud](/systems/salesforce-marketing-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [member_signal_ingestion](/workflow/member-signal-ingestion.md)
- [treatment_incrementality_selection](/workflow/treatment-incrementality-selection.md)
- [save_journey_activation](/workflow/save-journey-activation.md)

## Evals

- [Run the Loyalty Churn Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loyalty-churn-prediction-agent-end-to-end.md)
- [Loyalty account tied to accounts record for Meridian Retail Partners redeemed 48,750 points between 2026-07-01 08:00 and 2026-07-02 07:45 (trailing 24 hours), against a trailing-90-day average daily earn of 3,200 points — an 11.2x velocity spike per analytics_events. The account is also flagged in this week's churn-scoring batch as a top save-treatment candidate. Should we proceed with the concierge outreach and points-bonus offer for this account this week?](/tests/loyalty-churn-prediction-agent-points-velocity-threshold-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- accounts_records
- accounts_summary

# Examples

```
query_salesforce_marketing_cloud_accounts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Salesforce Marketing Cloud](/systems/salesforce-marketing-cloud.md)
