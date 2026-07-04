---
type: Query Capability
title: "Pull GL balances and sub-ledger details from SAP. Match against supporting do..."
description: "Pull GL balances and sub-ledger details from SAP. Match against supporting documentation from BlackLine reconciliation templates."
source_id: "balance-document-pull"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull GL balances and sub-ledger details from SAP. Match against supporting documentation from BlackLine reconciliation templates.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [lookup_account_reconciliation_agent_controls_playbook](/tools/lookup-account-reconciliation-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_close](/tools/action-sap-s-4hana-fi-close.md)

## Runs in

- [balance_document_pull](/workflow/balance-document-pull.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Account Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/account-reconciliation-agent-end-to-end.md)

# Citations

- [Account Reconciliation Agent Controls Playbook](/documents/account-reconciliation-agent-controls-playbook.md)
