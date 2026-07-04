---
type: Query Capability
title: Gemini drafts the dunning communication adapting tone to context. A first rem...
description: "Gemini drafts the dunning communication adapting tone to context. A first reminder to a 10-year customer reads as a courtesy; a third notice to a high-risk account includes escalation language and legal references. Personalizes with specific invoice details."
source_id: "communication-generation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini drafts the dunning communication adapting tone to context. A first reminder to a 10-year customer reads as a courtesy; a third notice to a high-risk account includes escalation language and legal references. Personalizes with specific invoice details.

## Tools used

- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)
- [action_sap_s_4hana_fi_draft](/tools/action-sap-s-4hana-fi-draft.md)

## Runs in

- [communication_generation](/workflow/communication-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dunning-communication-drafter-end-to-end.md)

# Citations

- [Dunning Communication Drafter Controls Playbook](/documents/dunning-communication-drafter-controls-playbook.md)
