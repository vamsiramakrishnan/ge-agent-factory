---
type: Proof Obligation
title: "Golden eval obligation — Run the SOX Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sox-control-testing-agent-end-to-end"
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

# Golden eval obligation — Run the SOX Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sox-control-testing-agent-end-to-end](/tests/sox-control-testing-agent-end-to-end.md)


## Mechanisms

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sox_control_testing_agent_controls_playbook](/tools/lookup-sox-control-testing-agent-controls-playbook.md)

## Entities that must be referenced

- auditboard_records
- control_tests
- transactions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [sox-control-testing-agent-controls-playbook](/documents/sox-control-testing-agent-controls-playbook.md)
