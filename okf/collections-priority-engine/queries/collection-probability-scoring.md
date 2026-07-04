---
type: Query Capability
title: ML model trained on historical payment patterns scores each receivable for co...
description: "ML model trained on historical payment patterns scores each receivable for collection probability. Features include customer segment, amount, aging bucket, day-of-week, industry cycle, and past behavior."
source_id: "collection-probability-scoring"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML model trained on historical payment patterns scores each receivable for collection probability. Features include customer segment, amount, aging bucket, day-of-week, industry cycle, and past behavior.

## Tools used

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)

## Runs in

- [collection_probability_scoring](/workflow/collection-probability-scoring.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/collections-priority-engine-end-to-end.md)

# Citations

- [Collections Priority Engine Controls Playbook](/documents/collections-priority-engine-controls-playbook.md)
