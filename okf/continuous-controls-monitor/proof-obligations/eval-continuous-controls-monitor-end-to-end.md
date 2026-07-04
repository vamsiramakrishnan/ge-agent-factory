---
type: Proof Obligation
title: "Golden eval obligation — Run the Continuous Controls Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-continuous-controls-monitor-end-to-end"
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

# Golden eval obligation — Run the Continuous Controls Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [continuous-controls-monitor-end-to-end](/tests/continuous-controls-monitor-end-to-end.md)


## Mechanisms

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_continuous_controls_monitor_controls_playbook](/tools/lookup-continuous-controls-monitor-controls-playbook.md)

## Entities that must be referenced

- control_tests
- transactions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [continuous-controls-monitor-controls-playbook](/documents/continuous-controls-monitor-controls-playbook.md)
