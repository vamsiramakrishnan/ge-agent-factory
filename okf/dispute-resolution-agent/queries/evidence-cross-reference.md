---
type: Query Capability
title: "Gemini reads dispute details and cross-references delivery records, contracts..."
description: "Gemini reads dispute details and cross-references delivery records, contracts, and communications. 'Customer disputes $45K citing wrong specifications -- PO specs match delivery docs but customer requirements changed post-PO. Recommend partial credit with documented spec change.'"
source_id: "evidence-cross-reference"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads dispute details and cross-references delivery records, contracts, and communications. 'Customer disputes $45K citing wrong specifications -- PO specs match delivery docs but customer requirements changed post-PO. Recommend partial credit with documented spec change.'

## Tools used

- [lookup_dispute_resolution_agent_controls_playbook](/tools/lookup-dispute-resolution-agent-controls-playbook.md)
- [action_highradius_recommend](/tools/action-highradius-recommend.md)

## Runs in

- [evidence_cross_reference](/workflow/evidence-cross-reference.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dispute-resolution-agent-end-to-end.md)

# Citations

- [Dispute Resolution Agent Controls Playbook](/documents/dispute-resolution-agent-controls-playbook.md)
