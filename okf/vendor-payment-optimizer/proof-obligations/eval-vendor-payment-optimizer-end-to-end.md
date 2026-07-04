---
type: Proof Obligation
title: "Golden eval obligation — Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-vendor-payment-optimizer-end-to-end"
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

# Golden eval obligation — Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [vendor-payment-optimizer-end-to-end](/tests/vendor-payment-optimizer-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_payment_optimizer_controls_playbook](/tools/lookup-vendor-payment-optimizer-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

## Entities that must be referenced

- gl_entries
- cash_positions
- taulia_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [vendor-payment-optimizer-controls-playbook](/documents/vendor-payment-optimizer-controls-playbook.md)
