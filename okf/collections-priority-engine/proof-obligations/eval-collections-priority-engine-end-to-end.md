---
type: Proof Obligation
title: "Golden eval obligation — Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-collections-priority-engine-end-to-end"
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

# Golden eval obligation — Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [collections-priority-engine-end-to-end](/tests/collections-priority-engine-end-to-end.md)


## Mechanisms

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_collections_priority_engine_controls_playbook](/tools/lookup-collections-priority-engine-controls-playbook.md)
- [action_highradius_recommend](/tools/action-highradius-recommend.md)

## Entities that must be referenced

- payment_remittances
- gl_entries
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [collections-priority-engine-controls-playbook](/documents/collections-priority-engine-controls-playbook.md)
