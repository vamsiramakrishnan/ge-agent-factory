---
type: Proof Obligation
title: "Golden eval obligation — Run the ESG & Sustainability Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-esg-sustainability-reporter-end-to-end"
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

# Golden eval obligation — Run the ESG & Sustainability Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [esg-sustainability-reporter-end-to-end](/tests/esg-sustainability-reporter-end-to-end.md)


## Mechanisms

- [query_workiva_workiva_records](/tools/query-workiva-workiva-records.md)
- [query_cdp_cdp_records](/tools/query-cdp-cdp-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_esg_sustainability_reporter_controls_playbook](/tools/lookup-esg-sustainability-reporter-controls-playbook.md)
- [action_workiva_draft](/tools/action-workiva-draft.md)

## Entities that must be referenced

- workiva_records
- cdp_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [esg-sustainability-reporter-controls-playbook](/documents/esg-sustainability-reporter-controls-playbook.md)
