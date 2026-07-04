---
type: Query Capability
title: "Parse tax research question and identify the key issues: deductibility, treat..."
description: "Parse tax research question and identify the key issues: deductibility, treaty application, timing, characterization. Map to relevant IRC sections, regulations, and tax topics."
source_id: "query-understanding"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse tax research question and identify the key issues: deductibility, treaty application, timing, characterization. Map to relevant IRC sections, regulations, and tax topics.

## Tools used

- [query_bloomberg_tax_bloomberg_tax_records](/tools/query-bloomberg-tax-bloomberg-tax-records.md)
- [lookup_tax_research_assistant_controls_playbook](/tools/lookup-tax-research-assistant-controls-playbook.md)

## Runs in

- [query_understanding](/workflow/query-understanding.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Tax Research Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tax-research-assistant-end-to-end.md)

# Citations

- [Tax Research Assistant Controls Playbook](/documents/tax-research-assistant-controls-playbook.md)
