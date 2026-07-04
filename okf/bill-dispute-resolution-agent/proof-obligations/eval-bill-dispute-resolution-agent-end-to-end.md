---
type: Proof Obligation
title: "Golden eval obligation — Run the Bill Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-bill-dispute-resolution-agent-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Bill Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [bill-dispute-resolution-agent-end-to-end](/tests/bill-dispute-resolution-agent-end-to-end.md)


## Mechanisms

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)
- [action_amdocs_ces_billing_send](/tools/action-amdocs-ces-billing-send.md)

## Entities that must be referenced

- billing_accounts
- analytics_events
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute send without two-system evidence

# Citations

- [bill-dispute-resolution-agent-assurance-runbook](/documents/bill-dispute-resolution-agent-assurance-runbook.md)
