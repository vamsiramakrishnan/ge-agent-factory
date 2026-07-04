---
type: Agent Tool
title: query_salesforce_marketing_cloud_accounts
description: Retrieve accounts from Salesforce Marketing Cloud for the Premium Delinquency Outreach Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_salesforce_marketing_cloud_accounts

Retrieve accounts from Salesforce Marketing Cloud for the Premium Delinquency Outreach Agent workflow.

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

- [nightly_past_due_extraction_plan_reconciliation](/workflow/nightly-past-due-extraction-plan-reconciliation.md)
- [cure_probability_scoring](/workflow/cure-probability-scoring.md)
- [channel_eligibility_campaign_suppression](/workflow/channel-eligibility-campaign-suppression.md)
- [authority_notice_period_gate](/workflow/authority-notice-period-gate.md)
- [reminder_dispatch_escalation_audit](/workflow/reminder-dispatch-escalation-audit.md)

## Evals

- [Run the Premium Delinquency Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/premium-delinquency-outreach-agent-end-to-end.md)

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
