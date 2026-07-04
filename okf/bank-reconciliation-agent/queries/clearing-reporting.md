---
type: Query Capability
title: Post clearing entries for resolved items. Generate reconciliation report with...
description: "Post clearing entries for resolved items. Generate reconciliation report with matched totals, outstanding items, and investigation status for each bank account."
source_id: "clearing-reporting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Post clearing entries for resolved items. Generate reconciliation report with matched totals, outstanding items, and investigation status for each bank account.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)
- [action_kyriba_match](/tools/action-kyriba-match.md)

## Runs in

- [clearing_reporting](/workflow/clearing-reporting.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Bank Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bank-reconciliation-agent-end-to-end.md)

# Citations

- [Bank Reconciliation Agent Controls Playbook](/documents/bank-reconciliation-agent-controls-playbook.md)
