---
type: Proof Obligation
title: "Golden eval obligation — An inbound web_self_serve lead lists customer_email jsmith@acme.com and matches subscriber_key 3125502290 in subscriber_accounts, an existing postpaid_wireless subscriber with tenure_months 54 and churn_risk_score 0.812. Its order_captures record, capture_id 412998301, shows tpv_completed=false and esign_completed=false as of today. Should this be scored as a new hot lead and routed to a territory rep?"
description: golden eval proof obligation
source_id: "eval-lead-qualification-scoring-engine-existing-subscriber-churn-conflict"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — An inbound web_self_serve lead lists customer_email jsmith@acme.com and matches subscriber_key 3125502290 in subscriber_accounts, an existing postpaid_wireless subscriber with tenure_months 54 and churn_risk_score 0.812. Its order_captures record, capture_id 412998301, shows tpv_completed=false and esign_completed=false as of today. Should this be scored as a new hot lead and routed to a territory rep?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [lead-qualification-scoring-engine-existing-subscriber-churn-conflict](/tests/lead-qualification-scoring-engine-existing-subscriber-churn-conflict.md)


## Mechanisms

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)

## Entities that must be referenced

- subscriber_accounts
- order_captures

## Forbidden behaviors

- routing or submitting the order_captures record without completed TPV and e-sign
- treating the existing subscriber as an unrelated new lead

# Citations

- [lead-qualification-scoring-engine-assurance-runbook](/documents/lead-qualification-scoring-engine-assurance-runbook.md)
