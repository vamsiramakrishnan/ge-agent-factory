---
type: Query Capability
title: "Extract intercompany balances across all entities, normalize currencies, and ..."
description: "Extract intercompany balances across all entities, normalize currencies, and organize by IC partner pair for matching."
source_id: "ic-balance-aggregation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract intercompany balances across all entities, normalize currencies, and organize by IC partner pair for matching.

## Tools used

- [lookup_intercompany_reconciliation_controls_playbook](/tools/lookup-intercompany-reconciliation-controls-playbook.md)

## Runs in

- [ic_balance_aggregation](/workflow/ic-balance-aggregation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Intercompany Reconciliation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intercompany-reconciliation-end-to-end.md)

# Citations

- [Intercompany Reconciliation Controls Playbook](/documents/intercompany-reconciliation-controls-playbook.md)
