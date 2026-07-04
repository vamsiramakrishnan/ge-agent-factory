---
type: Query Capability
title: "Extract all open receivables with aging, payment history, dispute status, and..."
description: "Extract all open receivables with aging, payment history, dispute status, and customer attributes. Merge with interaction logs from collections system."
source_id: "receivables-aggregation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract all open receivables with aging, payment history, dispute status, and customer attributes. Merge with interaction logs from collections system.

## Tools used

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [lookup_collections_priority_engine_controls_playbook](/tools/lookup-collections-priority-engine-controls-playbook.md)

## Runs in

- [receivables_aggregation](/workflow/receivables-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/collections-priority-engine-end-to-end.md)

# Citations

- [Collections Priority Engine Controls Playbook](/documents/collections-priority-engine-controls-playbook.md)
