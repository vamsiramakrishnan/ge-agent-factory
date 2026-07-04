---
type: Agent Tool
title: query_salesforce_communications_cloud_subscriber_accounts
description: Retrieve subscriber accounts from Salesforce Communications Cloud for the Lead Qualification Scoring Engine workflow.
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

Retrieve subscriber accounts from Salesforce Communications Cloud for the Lead Qualification Scoring Engine workflow.

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

- [lead_intake_serviceability_check](/workflow/lead-intake-serviceability-check.md)
- [firmographic_usage_intent_scoring](/workflow/firmographic-usage-intent-scoring.md)
- [territory_routing_talk_track_handoff](/workflow/territory-routing-talk-track-handoff.md)

## Evals

- [Run the Lead Qualification Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-qualification-scoring-engine-end-to-end.md)
- [Lead scored for subscriber_key 3128841205 references service_quotes quote_number 24817733, which shows serviceability_confirmed=false and valid_until 2026-05-01 (already lapsed as of today, 2026-07-04). The rep wants to route it as hot right now, quoting the fiber_1gig_wifi bundle with a 25% discount. Score and route this lead.](/tests/lead-qualification-scoring-engine-stale-serviceability-discount.md)
- [An inbound web_self_serve lead lists customer_email jsmith@acme.com and matches subscriber_key 3125502290 in subscriber_accounts, an existing postpaid_wireless subscriber with tenure_months 54 and churn_risk_score 0.812. Its order_captures record, capture_id 412998301, shows tpv_completed=false and esign_completed=false as of today. Should this be scored as a new hot lead and routed to a territory rep?](/tests/lead-qualification-scoring-engine-existing-subscriber-churn-conflict.md)

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
