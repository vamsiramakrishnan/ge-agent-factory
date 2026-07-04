---
type: Query Capability
title: Compare extracted terms against historical contract analyses to identify simi...
description: Compare extracted terms against historical contract analyses to identify similar treatments. Flag novel terms without precedent for enhanced review.
source_id: "precedent-matching"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compare extracted terms against historical contract analyses to identify similar treatments. Flag novel terms without precedent for enhanced review.

## Tools used

- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [lookup_asc_606_contract_analyzer_controls_playbook](/tools/lookup-asc-606-contract-analyzer-controls-playbook.md)
- [action_sap_s_4hana_sd_match](/tools/action-sap-s-4hana-sd-match.md)

## Runs in

- [precedent_matching](/workflow/precedent-matching.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ASC 606 Contract Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/asc-606-contract-analyzer-end-to-end.md)

# Citations

- [ASC 606 Contract Analyzer Controls Playbook](/documents/asc-606-contract-analyzer-controls-playbook.md)
