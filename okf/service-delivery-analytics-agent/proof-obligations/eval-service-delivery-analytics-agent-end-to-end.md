---
type: Proof Obligation
title: "Golden eval obligation — Run the Service Delivery Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-service-delivery-analytics-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Service Delivery Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [service-delivery-analytics-agent-end-to-end](/tests/service-delivery-analytics-agent-end-to-end.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_service_delivery_analytics_agent_policy_handbook](/tools/lookup-service-delivery-analytics-agent-policy-handbook.md)

## Entities that must be referenced

- tickets
- employees
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [service-delivery-analytics-agent-policy-handbook](/documents/service-delivery-analytics-agent-policy-handbook.md)
