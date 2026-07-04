---
type: Proof Obligation
title: "Golden eval obligation — Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-board-deck-generator-end-to-end"
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

# Golden eval obligation — Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [board-deck-generator-end-to-end](/tests/board-deck-generator-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_board_deck_generator_controls_playbook](/tools/lookup-board-deck-generator-controls-playbook.md)
- [action_google_slides_generate](/tools/action-google-slides-generate.md)

## Entities that must be referenced

- analytics_events
- dashboards
- presentations

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [board-deck-generator-controls-playbook](/documents/board-deck-generator-controls-playbook.md)
