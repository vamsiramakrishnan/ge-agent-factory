---
type: Workflow Stage
title: Consolidated Output
description: "Produce consolidated income statement, balance sheet, and cash flow statement. Reconcile elimination entries. Generate consolidation workpapers."
source_id: consolidated_output
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Consolidated Output

Produce consolidated income statement, balance sheet, and cash flow statement. Reconcile elimination entries. Generate consolidation workpapers.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_consolidation_elimination_agent_controls_playbook](/tools/lookup-consolidation-elimination-agent-controls-playbook.md)
