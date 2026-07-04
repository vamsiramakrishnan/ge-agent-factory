---
type: Query Capability
title: "Produce consolidated income statement, balance sheet, and cash flow statement..."
description: "Produce consolidated income statement, balance sheet, and cash flow statement. Reconcile elimination entries. Generate consolidation workpapers."
source_id: "consolidated-output"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Produce consolidated income statement, balance sheet, and cash flow statement. Reconcile elimination entries. Generate consolidation workpapers.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_consolidation_elimination_agent_controls_playbook](/tools/lookup-consolidation-elimination-agent-controls-playbook.md)

## Runs in

- [consolidated_output](/workflow/consolidated-output.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Consolidation & Elimination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/consolidation-elimination-agent-end-to-end.md)

# Citations

- [Consolidation & Elimination Agent Controls Playbook](/documents/consolidation-elimination-agent-controls-playbook.md)
