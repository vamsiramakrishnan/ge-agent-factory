---
type: Workflow Stage
title: Parallel Extraction
description: Extract COGS balances from both CO (cost element view) and FI (GL account view). Align at the same granularity for comparison.
source_id: parallel_extraction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parallel Extraction

Extract COGS balances from both CO (cost element view) and FI (GL account view). Align at the same granularity for comparison.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_co_fi_cost_centers](/tools/query-sap-s-4hana-co-fi-cost-centers.md)
- [lookup_cogs_reconciliation_agent_controls_playbook](/tools/lookup-cogs-reconciliation-agent-controls-playbook.md)

Next: [Root Cause Tracing](/workflow/root-cause-tracing.md)
