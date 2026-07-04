---
type: Workflow Stage
title: Dunning Context Assembly
description: "Pull customer payment history, relationship tenure, open disputes, prior dunning communications, and current balance details. Build a complete picture of the collection situation."
source_id: dunning_context_assembly
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Dunning Context Assembly

Pull customer payment history, relationship tenure, open disputes, prior dunning communications, and current balance details. Build a complete picture of the collection situation.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)

Next: [Response Prediction](/workflow/response-prediction.md)
