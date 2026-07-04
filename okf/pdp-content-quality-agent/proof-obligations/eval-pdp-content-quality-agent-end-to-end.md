---
type: Proof Obligation
title: "Golden eval obligation — Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-pdp-content-quality-agent-end-to-end"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [pdp-content-quality-agent-end-to-end](/tests/pdp-content-quality-agent-end-to-end.md)


## Mechanisms

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_publish](/tools/action-salesforce-commerce-cloud-publish.md)

## Entities that must be referenced

- online_orders
- session_events
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [pdp-content-quality-agent-execution-playbook](/documents/pdp-content-quality-agent-execution-playbook.md)
