---
type: Query Capability
title: "Aggregate financial statements, strategic KPIs, and operational metrics from ..."
description: "Aggregate financial statements, strategic KPIs, and operational metrics from data warehouse. Pull chart visualizations from Looker dashboards."
source_id: "kpi-financial-data-pull"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate financial statements, strategic KPIs, and operational metrics from data warehouse. Pull chart visualizations from Looker dashboards.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_board_deck_generator_controls_playbook](/tools/lookup-board-deck-generator-controls-playbook.md)

## Runs in

- [kpi_financial_data_pull](/workflow/kpi-financial-data-pull.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/board-deck-generator-end-to-end.md)

# Citations

- [Board Deck Generator Controls Playbook](/documents/board-deck-generator-controls-playbook.md)
