---
type: Workflow Stage
title: Communication Generation
description: "Gemini drafts the dunning communication adapting tone to context. A first reminder to a 10-year customer reads as a courtesy; a third notice to a high-risk account includes escalation language and legal references. Personalizes with specific invoice details."
source_id: communication_generation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Communication Generation

Gemini drafts the dunning communication adapting tone to context. A first reminder to a 10-year customer reads as a courtesy; a third notice to a high-risk account includes escalation language and legal references. Personalizes with specific invoice details.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)
- [action_sap_s_4hana_fi_draft](/tools/action-sap-s-4hana-fi-draft.md)

Next: [Delivery & Tracking](/workflow/delivery-tracking.md)
