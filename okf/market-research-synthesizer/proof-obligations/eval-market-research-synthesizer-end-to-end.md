---
type: Proof Obligation
title: "Golden eval obligation — Run the Market Research Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-market-research-synthesizer-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Market Research Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [market-research-synthesizer-end-to-end](/tests/market-research-synthesizer-end-to-end.md)


## Mechanisms

- [query_gartner_gartner_records](/tools/query-gartner-gartner-records.md)
- [query_forrester_forrester_records](/tools/query-forrester-forrester-records.md)
- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_market_research_synthesizer_playbook](/tools/lookup-market-research-synthesizer-playbook.md)
- [action_gartner_archive](/tools/action-gartner-archive.md)

## Entities that must be referenced

- gartner_records
- forrester_records
- g2_records
- analytics_events
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute archive without two-system evidence

# Citations

- [market-research-synthesizer-playbook](/documents/market-research-synthesizer-playbook.md)
