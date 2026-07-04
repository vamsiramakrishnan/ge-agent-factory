---
type: Workflow Stage
title: "Balance & Document Pull"
description: "Pull GL balances and sub-ledger details from SAP. Match against supporting documentation from BlackLine reconciliation templates."
source_id: balance_document_pull
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Balance & Document Pull

Pull GL balances and sub-ledger details from SAP. Match against supporting documentation from BlackLine reconciliation templates.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [lookup_account_reconciliation_agent_controls_playbook](/tools/lookup-account-reconciliation-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_close](/tools/action-sap-s-4hana-fi-close.md)

Next: [Auto-Matching & Risk Scoring](/workflow/auto-matching-risk-scoring.md)
