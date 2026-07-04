---
type: Query Capability
title: "Match intercompany transactions across entities using BlackLine. Auto-elimina..."
description: "Match intercompany transactions across entities using BlackLine. Auto-eliminate matched pairs. Flag unmatched items for investigation. Calculate minority interest."
source_id: "ic-matching-elimination"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Match intercompany transactions across entities using BlackLine. Auto-eliminate matched pairs. Flag unmatched items for investigation. Calculate minority interest.

## Tools used

- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [lookup_consolidation_elimination_agent_controls_playbook](/tools/lookup-consolidation-elimination-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_match](/tools/action-sap-s-4hana-fi-match.md)

## Runs in

- [ic_matching_elimination](/workflow/ic-matching-elimination.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Consolidation & Elimination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/consolidation-elimination-agent-end-to-end.md)

# Citations

- [Consolidation & Elimination Agent Controls Playbook](/documents/consolidation-elimination-agent-controls-playbook.md)
