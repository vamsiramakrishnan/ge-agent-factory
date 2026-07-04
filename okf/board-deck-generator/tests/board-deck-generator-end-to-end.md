---
type: Eval Scenario
title: Run the Board Deck Generator workflow for the current period. Cite the releva...
description: "Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "board-deck-generator-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [deck-assembly-delivery](/queries/deck-assembly-delivery.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_board_deck_generator_controls_playbook](/tools/lookup-board-deck-generator-controls-playbook.md)
- [action_google_slides_generate](/tools/action-google-slides-generate.md)

## Success rubric

Action generate executed against Google Slides, with audit-trail entry and CFO notified of outcomes.

# Citations

- [Board Deck Generator Controls Playbook](/documents/board-deck-generator-controls-playbook.md)
