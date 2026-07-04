---
type: Workflow Stage
title: Response Prediction
description: ML model predicts payment likelihood and optimal communication timing. Analyzes which dunning tone historically drives fastest response for this customer segment.
source_id: response_prediction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Response Prediction

ML model predicts payment likelihood and optimal communication timing. Analyzes which dunning tone historically drives fastest response for this customer segment.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)

Next: [Communication Generation](/workflow/communication-generation.md)
