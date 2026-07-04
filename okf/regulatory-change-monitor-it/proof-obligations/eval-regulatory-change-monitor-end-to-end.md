---
type: Proof Obligation
title: "Golden eval obligation — Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-regulatory-change-monitor-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [regulatory-change-monitor-end-to-end](/tests/regulatory-change-monitor-end-to-end.md)


## Mechanisms

- [query_thomson_reuters_thomson_reuters_records](/tools/query-thomson-reuters-thomson-reuters-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_change_monitor_runbook](/tools/lookup-regulatory-change-monitor-runbook.md)
- [action_thomson_reuters_update](/tools/action-thomson-reuters-update.md)

## Entities that must be referenced

- thomson_reuters_records
- onetrust_records
- tickets
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute update without two-system evidence

# Citations

- [regulatory-change-monitor-runbook](/documents/regulatory-change-monitor-runbook.md)
