---
type: Workflow Stage
title: IC Transaction Extraction
description: "Extract all intercompany transactions by category -- management fees, royalties, tangible goods, services. Map to entity pairs with pricing details and volumes. Identify new transaction types since last review."
source_id: ic_transaction_extraction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# IC Transaction Extraction

Extract all intercompany transactions by category -- management fees, royalties, tangible goods, services. Map to entity pairs with pricing details and volumes. Identify new transaction types since last review.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [lookup_transfer_pricing_monitor_controls_playbook](/tools/lookup-transfer-pricing-monitor-controls-playbook.md)

Next: [Regulatory Interpretation](/workflow/regulatory-interpretation.md)
