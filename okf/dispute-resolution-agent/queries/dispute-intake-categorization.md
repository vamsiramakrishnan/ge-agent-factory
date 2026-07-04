---
type: Query Capability
title: "Log incoming dispute from customer, deduction, or internal escalation. ML aut..."
description: "Log incoming dispute from customer, deduction, or internal escalation. ML auto-categorizes by type -- pricing, quality, delivery, billing error -- and routes to appropriate team."
source_id: "dispute-intake-categorization"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Log incoming dispute from customer, deduction, or internal escalation. ML auto-categorizes by type -- pricing, quality, delivery, billing error -- and routes to appropriate team.

## Tools used

- [lookup_dispute_resolution_agent_controls_playbook](/tools/lookup-dispute-resolution-agent-controls-playbook.md)

## Runs in

- [dispute_intake_categorization](/workflow/dispute-intake-categorization.md)

## Evidence expected

- document_reference

## Evals

- [Run the Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dispute-resolution-agent-end-to-end.md)

# Citations

- [Dispute Resolution Agent Controls Playbook](/documents/dispute-resolution-agent-controls-playbook.md)
