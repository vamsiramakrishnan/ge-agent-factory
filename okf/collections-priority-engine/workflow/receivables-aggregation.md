---
type: Workflow Stage
title: Receivables Aggregation
description: "Extract all open receivables with aging, payment history, dispute status, and customer attributes. Merge with interaction logs from collections system."
source_id: receivables_aggregation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receivables Aggregation

Extract all open receivables with aging, payment history, dispute status, and customer attributes. Merge with interaction logs from collections system.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [lookup_collections_priority_engine_controls_playbook](/tools/lookup-collections-priority-engine-controls-playbook.md)

Next: [Collection Probability Scoring](/workflow/collection-probability-scoring.md)
