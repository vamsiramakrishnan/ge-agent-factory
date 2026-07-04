---
type: Query Capability
title: ML model predicts payment likelihood and optimal communication timing. Analyz...
description: ML model predicts payment likelihood and optimal communication timing. Analyzes which dunning tone historically drives fastest response for this customer segment.
source_id: "response-prediction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML model predicts payment likelihood and optimal communication timing. Analyzes which dunning tone historically drives fastest response for this customer segment.

## Tools used

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)

## Runs in

- [response_prediction](/workflow/response-prediction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dunning-communication-drafter-end-to-end.md)

# Citations

- [Dunning Communication Drafter Controls Playbook](/documents/dunning-communication-drafter-controls-playbook.md)
