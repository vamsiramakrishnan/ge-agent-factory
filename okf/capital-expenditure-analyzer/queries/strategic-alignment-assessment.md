---
type: Query Capability
title: "Gemini reads the project justification narrative, compares against similar pa..."
description: "Gemini reads the project justification narrative, compares against similar past investments and their actual ROI, and assesses strategic alignment. Generates investment memo with risk analysis."
source_id: "strategic-alignment-assessment"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads the project justification narrative, compares against similar past investments and their actual ROI, and assesses strategic alignment. Generates investment memo with risk analysis.

## Tools used

- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Runs in

- [strategic_alignment_assessment](/workflow/strategic-alignment-assessment.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Capital Expenditure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capital-expenditure-analyzer-end-to-end.md)

# Citations

- [Capital Expenditure Analyzer Controls Playbook](/documents/capital-expenditure-analyzer-controls-playbook.md)
