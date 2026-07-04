---
type: Proof Obligation
title: "Golden eval obligation — Run the Tax Research Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-tax-research-assistant-end-to-end"
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

# Golden eval obligation — Run the Tax Research Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [tax-research-assistant-end-to-end](/tests/tax-research-assistant-end-to-end.md)


## Mechanisms

- [query_cch_answerconnect_cch_answerconnect_records](/tools/query-cch-answerconnect-cch-answerconnect-records.md)
- [query_bloomberg_tax_bloomberg_tax_records](/tools/query-bloomberg-tax-bloomberg-tax-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_tax_research_assistant_controls_playbook](/tools/lookup-tax-research-assistant-controls-playbook.md)

## Entities that must be referenced

- cch_answerconnect_records
- bloomberg_tax_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [tax-research-assistant-controls-playbook](/documents/tax-research-assistant-controls-playbook.md)
