---
type: Query Capability
title: "Gemini generates AR narrative: 'DSO increased 5 days to 48 -- driven entirely..."
description: "Gemini generates AR narrative: 'DSO increased 5 days to 48 -- driven entirely by 2 large government contracts with 60-day terms. Excluding government, commercial DSO improved by 2 days. Recommend tracking government and commercial DSO separately.'"
source_id: "narrative-synthesis"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates AR narrative: 'DSO increased 5 days to 48 -- driven entirely by 2 large government contracts with 60-day terms. Excluding government, commercial DSO improved by 2 days. Recommend tracking government and commercial DSO separately.'

## Tools used

- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [narrative_synthesis](/workflow/narrative-synthesis.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the AR Aging & DSO Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ar-aging-dso-analyzer-end-to-end.md)

# Citations

- [AR Aging & DSO Analyzer Controls Playbook](/documents/ar-aging-dso-analyzer-controls-playbook.md)
