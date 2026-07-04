---
type: Query Capability
title: "Gemini generates management discussion for each material line item: 'Revenue ..."
description: "Gemini generates management discussion for each material line item: 'Revenue increased 12% to $156M driven by 3 new enterprise customers.' Adapts depth based on materiality thresholds."
source_id: "narrative-generation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates management discussion for each material line item: 'Revenue increased 12% to $156M driven by 3 new enterprise customers.' Adapts depth based on materiality thresholds.

## Tools used

- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [narrative_generation](/workflow/narrative-generation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Financial Statement Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/financial-statement-generator-end-to-end.md)

# Citations

- [Financial Statement Generator Controls Playbook](/documents/financial-statement-generator-controls-playbook.md)
