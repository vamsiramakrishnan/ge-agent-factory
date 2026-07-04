---
type: Query Capability
title: "Gemini transforms raw data into board-ready narrative. Frames differently for..."
description: "Gemini transforms raw data into board-ready narrative. Frames differently for audit committee (risk-focused) vs. full board (strategy-focused). Generates management discussion and analysis."
source_id: "board-narrative-generation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini transforms raw data into board-ready narrative. Frames differently for audit committee (risk-focused) vs. full board (strategy-focused). Generates management discussion and analysis.

## Tools used

- [lookup_board_deck_generator_controls_playbook](/tools/lookup-board-deck-generator-controls-playbook.md)
- [action_google_slides_generate](/tools/action-google-slides-generate.md)

## Runs in

- [board_narrative_generation](/workflow/board-narrative-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/board-deck-generator-end-to-end.md)

# Citations

- [Board Deck Generator Controls Playbook](/documents/board-deck-generator-controls-playbook.md)
