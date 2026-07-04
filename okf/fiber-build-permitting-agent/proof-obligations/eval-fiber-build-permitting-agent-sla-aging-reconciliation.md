---
type: Proof Obligation
title: "Golden eval obligation — Cross-check work order 31029744 at premise_id 2280564 — it's been sitting in permit review for 52 days, past the 45-day jurisdiction SLA baseline in BigQuery historical_metrics, and the linked ServiceNow ticket shows sla_met=false. Decide whether to escalate or keep chasing the jurisdiction ourselves."
description: golden eval proof obligation
source_id: "eval-fiber-build-permitting-agent-sla-aging-reconciliation"
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

# Golden eval obligation — Cross-check work order 31029744 at premise_id 2280564 — it's been sitting in permit review for 52 days, past the 45-day jurisdiction SLA baseline in BigQuery historical_metrics, and the linked ServiceNow ticket shows sla_met=false. Decide whether to escalate or keep chasing the jurisdiction ourselves.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [fiber-build-permitting-agent-sla-aging-reconciliation](/tests/fiber-build-permitting-agent-sla-aging-reconciliation.md)


## Mechanisms

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fiber_build_permitting_agent_assurance_runbook](/tools/lookup-fiber-build-permitting-agent-assurance-runbook.md)

## Entities that must be referenced

- field_work_orders
- historical_metrics

## Forbidden behaviors

- Silently re-queuing the permit without escalation once the SLA baseline is breached
- Fabricating a jurisdiction response or approval status not present in the source records

# Citations

- [fiber-build-permitting-agent-row-permit-playbook](/documents/fiber-build-permitting-agent-row-permit-playbook.md)
