---
type: Agent Tool
title: query_salesforce_communications_cloud_subscriber_accounts
description: Retrieve subscriber accounts from Salesforce Communications Cloud for the B2B Quote Configuration Agent workflow.
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

Retrieve subscriber accounts from Salesforce Communications Cloud for the B2B Quote Configuration Agent workflow.

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

- [opportunity_site_intake](/workflow/opportunity-site-intake.md)
- [proposal_drafting_order_capture_routing](/workflow/proposal-drafting-order-capture-routing.md)

## Evals

- [Run the B2B Quote Configuration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/b2b-quote-configuration-agent-end-to-end.md)
- [Quote #24783011 for 'Meridian Logistics Group' shows mrr_usd=$5,240 on a term_36 contract, discount_pct=22.5%, and credit_check_status=deposit_required. The seller wants to push this straight to order capture today to hit end-of-month. Reconcile the discrepancy and tell me what has to happen before this quote can move.](/tests/b2b-quote-configuration-agent-discount-credit-conflict.md)
- [Quote #20456218 for 'Anchor Point Manufacturing' is an enterprise_dia_100m bundle across three sites. valid_until was 2026-06-20 and serviceability_confirmed was last recorded true on 2026-05-01. The customer wants to sign today, 2026-07-04, at the original quoted price. Reconcile and issue the order capture.](/tests/b2b-quote-configuration-agent-stale-multisite-serviceability.md)

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
