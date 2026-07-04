---
type: Workflow Stage
title: "Clearing & Reporting"
description: "Post clearing entries for resolved items. Generate reconciliation report with matched totals, outstanding items, and investigation status for each bank account."
source_id: clearing_reporting
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Clearing & Reporting

Post clearing entries for resolved items. Generate reconciliation report with matched totals, outstanding items, and investigation status for each bank account.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)
- [action_kyriba_match](/tools/action-kyriba-match.md)
