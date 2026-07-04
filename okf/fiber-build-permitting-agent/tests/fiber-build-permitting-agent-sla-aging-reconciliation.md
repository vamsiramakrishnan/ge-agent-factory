---
type: Eval Scenario
title: "Cross-check work order 31029744 at premise_id 2280564 — it's been sitting in ..."
description: "Cross-check work order 31029744 at premise_id 2280564 — it's been sitting in permit review for 52 days, past the 45-day jurisdiction SLA baseline in BigQuery historical_metrics, and the linked ServiceNow ticket shows sla_met=false. Decide whether to escalate or keep chasing the jurisdiction ourselves."
source_id: "fiber-build-permitting-agent-sla-aging-reconciliation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-check work order 31029744 at premise_id 2280564 — it's been sitting in permit review for 52 days, past the 45-day jurisdiction SLA baseline in BigQuery historical_metrics, and the linked ServiceNow ticket shows sla_met=false. Decide whether to escalate or keep chasing the jurisdiction ourselves.

## Validates

- [permit-gated-work-order-triage](/queries/permit-gated-work-order-triage.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fiber_build_permitting_agent_assurance_runbook](/tools/lookup-fiber-build-permitting-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Municipal Right-of-Way Permitting & 811 Locate Compliance Playbook](/documents/fiber-build-permitting-agent-row-permit-playbook.md)
