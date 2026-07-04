---
type: Query Capability
title: Gemini generates AP narrative for cash management meetings. Highlights aged i...
description: "Gemini generates AP narrative for cash management meetings. Highlights aged items in dispute, tracks resolution progress, and provides working capital impact assessment."
source_id: "ap-narrative-generation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates AP narrative for cash management meetings. Highlights aged items in dispute, tracks resolution progress, and provides working capital impact assessment.

## Tools used

- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [ap_narrative_generation](/workflow/ap-narrative-generation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the AP Aging Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ap-aging-analyzer-end-to-end.md)

# Citations

- [AP Aging Analyzer Controls Playbook](/documents/ap-aging-analyzer-controls-playbook.md)
