---
type: Query Capability
title: "Pull customer payment history, relationship tenure, open disputes, prior dunn..."
description: "Pull customer payment history, relationship tenure, open disputes, prior dunning communications, and current balance details. Build a complete picture of the collection situation."
source_id: "dunning-context-assembly"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull customer payment history, relationship tenure, open disputes, prior dunning communications, and current balance details. Build a complete picture of the collection situation.

## Tools used

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)

## Runs in

- [dunning_context_assembly](/workflow/dunning-context-assembly.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dunning-communication-drafter-end-to-end.md)

# Citations

- [Dunning Communication Drafter Controls Playbook](/documents/dunning-communication-drafter-controls-playbook.md)
