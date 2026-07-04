---
type: Proof Obligation
title: "Golden eval obligation — Run the Investor Relations Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-investor-relations-prep-agent-end-to-end"
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

# Golden eval obligation — Run the Investor Relations Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [investor-relations-prep-agent-end-to-end](/tests/investor-relations-prep-agent-end-to-end.md)


## Mechanisms

- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [query_s_p_capital_iq_s_p_capital_iq_records](/tools/query-s-p-capital-iq-s-p-capital-iq-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_investor_relations_prep_agent_controls_playbook](/tools/lookup-investor-relations-prep-agent-controls-playbook.md)

## Entities that must be referenced

- bloomberg_records
- s_p_capital_iq_records
- analytics_events
- presentations

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [investor-relations-prep-agent-controls-playbook](/documents/investor-relations-prep-agent-controls-playbook.md)
