---
type: Query Capability
title: "Parse contract documents using NLP to extract deliverables, pricing, payment ..."
description: "Parse contract documents using NLP to extract deliverables, pricing, payment terms, modification clauses, MFN provisions, and termination rights."
source_id: "contract-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse contract documents using NLP to extract deliverables, pricing, payment terms, modification clauses, MFN provisions, and termination rights.

## Tools used

- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [lookup_asc_606_contract_analyzer_controls_playbook](/tools/lookup-asc-606-contract-analyzer-controls-playbook.md)

## Runs in

- [contract_extraction](/workflow/contract-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the ASC 606 Contract Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/asc-606-contract-analyzer-end-to-end.md)

# Citations

- [ASC 606 Contract Analyzer Controls Playbook](/documents/asc-606-contract-analyzer-controls-playbook.md)
