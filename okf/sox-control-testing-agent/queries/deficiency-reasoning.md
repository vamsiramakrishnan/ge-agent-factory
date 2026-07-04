---
type: Query Capability
title: Gemini evaluates whether control failures represent isolated incidents or sys...
description: Gemini evaluates whether control failures represent isolated incidents or systemic issues. Assesses compensating controls and determines deficiency severity classification.
source_id: "deficiency-reasoning"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini evaluates whether control failures represent isolated incidents or systemic issues. Assesses compensating controls and determines deficiency severity classification.

## Tools used

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [lookup_sox_control_testing_agent_controls_playbook](/tools/lookup-sox-control-testing-agent-controls-playbook.md)

## Runs in

- [deficiency_reasoning](/workflow/deficiency-reasoning.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the SOX Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sox-control-testing-agent-end-to-end.md)

# Citations

- [SOX Control Testing Agent Controls Playbook](/documents/sox-control-testing-agent-controls-playbook.md)
