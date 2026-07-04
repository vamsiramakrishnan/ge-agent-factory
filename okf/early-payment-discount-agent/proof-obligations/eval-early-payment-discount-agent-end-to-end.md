---
type: Proof Obligation
title: "Golden eval obligation — Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-early-payment-discount-agent-end-to-end"
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

# Golden eval obligation — Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [early-payment-discount-agent-end-to-end](/tests/early-payment-discount-agent-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_c2fo_c2fo_records](/tools/query-c2fo-c2fo-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_early_payment_discount_agent_controls_playbook](/tools/lookup-early-payment-discount-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

## Entities that must be referenced

- gl_entries
- taulia_records
- c2fo_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [early-payment-discount-agent-controls-playbook](/documents/early-payment-discount-agent-controls-playbook.md)
