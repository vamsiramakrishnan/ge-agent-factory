---
type: Proof Obligation
title: "Golden eval obligation — Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-duplicate-invoice-detector-end-to-end"
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

# Golden eval obligation — Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [duplicate-invoice-detector-end-to-end](/tests/duplicate-invoice-detector-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_duplicate_invoice_detector_controls_playbook](/tools/lookup-duplicate-invoice-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_block](/tools/action-sap-s-4hana-fi-block.md)

## Entities that must be referenced

- gl_entries
- requisitions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute block without two-system evidence

# Citations

- [duplicate-invoice-detector-controls-playbook](/documents/duplicate-invoice-detector-controls-playbook.md)
