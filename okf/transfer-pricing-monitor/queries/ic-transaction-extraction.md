---
type: Query Capability
title: "Extract all intercompany transactions by category -- management fees, royalti..."
description: "Extract all intercompany transactions by category -- management fees, royalties, tangible goods, services. Map to entity pairs with pricing details and volumes. Identify new transaction types since last review."
source_id: "ic-transaction-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract all intercompany transactions by category -- management fees, royalties, tangible goods, services. Map to entity pairs with pricing details and volumes. Identify new transaction types since last review.

## Tools used

- [lookup_transfer_pricing_monitor_controls_playbook](/tools/lookup-transfer-pricing-monitor-controls-playbook.md)

## Runs in

- [ic_transaction_extraction](/workflow/ic-transaction-extraction.md)

## Evidence expected

- document_reference

## Evals

- [Run the Transfer Pricing Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/transfer-pricing-monitor-end-to-end.md)

# Citations

- [Transfer Pricing Monitor Controls Playbook](/documents/transfer-pricing-monitor-controls-playbook.md)
