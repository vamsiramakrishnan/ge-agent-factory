---
type: Proof Obligation
title: "Golden eval obligation — Run the Unplanned Downtime Root-Cause Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-unplanned-downtime-root-cause-agent-end-to-end"
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

# Golden eval obligation — Run the Unplanned Downtime Root-Cause Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [unplanned-downtime-root-cause-agent-end-to-end](/tests/unplanned-downtime-root-cause-agent-end-to-end.md)


## Mechanisms

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)
- [action_siemens_opcenter_mes_escalate](/tools/action-siemens-opcenter-mes-escalate.md)

## Entities that must be referenced

- production_orders
- sensor_readings
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [unplanned-downtime-root-cause-agent-sop](/documents/unplanned-downtime-root-cause-agent-sop.md)
