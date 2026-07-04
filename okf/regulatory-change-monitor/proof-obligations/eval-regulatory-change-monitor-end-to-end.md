---
type: Proof Obligation
title: "Golden eval obligation — Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-regulatory-change-monitor-end-to-end"
tags:
  - finance
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

- [query_bloomberg_tax_bloomberg_tax_records](/tools/query-bloomberg-tax-bloomberg-tax-records.md)
- [query_cch_answerconnect_cch_answerconnect_records](/tools/query-cch-answerconnect-cch-answerconnect-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_change_monitor_controls_playbook](/tools/lookup-regulatory-change-monitor-controls-playbook.md)

## Entities that must be referenced

- bloomberg_tax_records
- cch_answerconnect_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [regulatory-change-monitor-controls-playbook](/documents/regulatory-change-monitor-controls-playbook.md)
