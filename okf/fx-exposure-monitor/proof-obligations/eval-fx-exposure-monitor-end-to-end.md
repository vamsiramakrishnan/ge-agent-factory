---
type: Proof Obligation
title: "Golden eval obligation — Run the FX Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-fx-exposure-monitor-end-to-end"
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

# Golden eval obligation — Run the FX Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [fx-exposure-monitor-end-to-end](/tests/fx-exposure-monitor-end-to-end.md)


## Mechanisms

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fx_exposure_monitor_controls_playbook](/tools/lookup-fx-exposure-monitor-controls-playbook.md)
- [action_kyriba_recommend](/tools/action-kyriba-recommend.md)

## Entities that must be referenced

- cash_positions
- bloomberg_records
- gl_entries
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [fx-exposure-monitor-controls-playbook](/documents/fx-exposure-monitor-controls-playbook.md)
