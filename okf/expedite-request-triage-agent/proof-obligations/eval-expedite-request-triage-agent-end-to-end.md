---
type: Proof Obligation
title: "Golden eval obligation — Run the Expedite Request Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-expedite-request-triage-agent-end-to-end"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Expedite Request Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [expedite-request-triage-agent-end-to-end](/tests/expedite-request-triage-agent-end-to-end.md)


## Mechanisms

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)
- [action_sap_s_4hana_mm_approve](/tools/action-sap-s-4hana-mm-approve.md)

## Entities that must be referenced

- supply_plans
- purchase_orders
- tickets
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute approve without two-system evidence

# Citations

- [expedite-request-triage-agent-sop](/documents/expedite-request-triage-agent-sop.md)
