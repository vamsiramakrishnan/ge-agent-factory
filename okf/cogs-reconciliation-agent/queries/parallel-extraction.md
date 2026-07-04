---
type: Query Capability
title: Extract COGS balances from both CO (cost element view) and FI (GL account vie...
description: Extract COGS balances from both CO (cost element view) and FI (GL account view). Align at the same granularity for comparison.
source_id: "parallel-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract COGS balances from both CO (cost element view) and FI (GL account view). Align at the same granularity for comparison.

## Tools used

- [query_sap_s_4hana_co_fi_cost_centers](/tools/query-sap-s-4hana-co-fi-cost-centers.md)
- [lookup_cogs_reconciliation_agent_controls_playbook](/tools/lookup-cogs-reconciliation-agent-controls-playbook.md)

## Runs in

- [parallel_extraction](/workflow/parallel-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cogs-reconciliation-agent-end-to-end.md)

# Citations

- [COGS Reconciliation Agent Controls Playbook](/documents/cogs-reconciliation-agent-controls-playbook.md)
