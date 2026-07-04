---
type: Workflow Stage
title: Collection Probability Scoring
description: "ML model trained on historical payment patterns scores each receivable for collection probability. Features include customer segment, amount, aging bucket, day-of-week, industry cycle, and past behavior."
source_id: collection_probability_scoring
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collection Probability Scoring

ML model trained on historical payment patterns scores each receivable for collection probability. Features include customer segment, amount, aging bucket, day-of-week, industry cycle, and past behavior.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)

Next: [Contextual Priority Adjustment](/workflow/contextual-priority-adjustment.md)
