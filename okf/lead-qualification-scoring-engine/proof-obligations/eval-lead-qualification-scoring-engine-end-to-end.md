---
type: Proof Obligation
title: "Golden eval obligation — Run the Lead Qualification Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-lead-qualification-scoring-engine-end-to-end"
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

# Golden eval obligation — Run the Lead Qualification Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [lead-qualification-scoring-engine-end-to-end](/tests/lead-qualification-scoring-engine-end-to-end.md)


## Mechanisms

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

## Entities that must be referenced

- subscriber_accounts
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [lead-qualification-scoring-engine-assurance-runbook](/documents/lead-qualification-scoring-engine-assurance-runbook.md)
