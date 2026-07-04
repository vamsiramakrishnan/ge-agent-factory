---
type: Proof Obligation
title: "Golden eval obligation — Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-dunning-communication-drafter-end-to-end"
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

# Golden eval obligation — Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [dunning-communication-drafter-end-to-end](/tests/dunning-communication-drafter-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)
- [action_sap_s_4hana_fi_draft](/tools/action-sap-s-4hana-fi-draft.md)

## Entities that must be referenced

- gl_entries
- payment_remittances
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [dunning-communication-drafter-controls-playbook](/documents/dunning-communication-drafter-controls-playbook.md)
