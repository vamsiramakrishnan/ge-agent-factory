---
type: Eval Scenario
title: "An inbound web_self_serve lead lists customer_email jsmith@acme.com and match..."
description: "An inbound web_self_serve lead lists customer_email jsmith@acme.com and matches subscriber_key 3125502290 in subscriber_accounts, an existing postpaid_wireless subscriber with tenure_months 54 and churn_risk_score 0.812. Its order_captures record, capture_id 412998301, shows tpv_completed=false and esign_completed=false as of today. Should this be scored as a new hot lead and routed to a territory rep?"
source_id: "lead-qualification-scoring-engine-existing-subscriber-churn-conflict"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# An inbound web_self_serve lead lists customer_email jsmith@acme.com and matches subscriber_key 3125502290 in subscriber_accounts, an existing postpaid_wireless subscriber with tenure_months 54 and churn_risk_score 0.812. Its order_captures record, capture_id 412998301, shows tpv_completed=false and esign_completed=false as of today. Should this be scored as a new hot lead and routed to a territory rep?

## Validates

- [lead-intake-serviceability-check](/queries/lead-intake-serviceability-check.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Lead Qualification Scoring Engine Service Assurance Runbook](/documents/lead-qualification-scoring-engine-assurance-runbook.md)
