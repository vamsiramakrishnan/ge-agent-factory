---
type: Query Capability
title: "Gemini interprets simulation results, identifies key trade-offs, and generate..."
description: "Gemini interprets simulation results, identifies key trade-offs, and generates strategic recommendations with risk-adjusted reasoning."
source_id: "strategic-interpretation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets simulation results, identifies key trade-offs, and generates strategic recommendations with risk-adjusted reasoning.

## Tools used

- [action_anaplan_recommend](/tools/action-anaplan-recommend.md)

## Runs in

- [strategic_interpretation](/workflow/strategic-interpretation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Scenario Modeling & Sensitivity workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/scenario-modeling-sensitivity-end-to-end.md)

# Citations

- [Scenario Modeling & Sensitivity Controls Playbook](/documents/scenario-modeling-sensitivity-controls-playbook.md)
