---
type: Query Capability
title: Present resolution recommendation to AR team. Post approved credit memos or r...
description: Present resolution recommendation to AR team. Post approved credit memos or rejections. Track resolution metrics for continuous improvement.
source_id: "resolution-posting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Present resolution recommendation to AR team. Post approved credit memos or rejections. Track resolution metrics for continuous improvement.

## Tools used

- [lookup_dispute_resolution_agent_controls_playbook](/tools/lookup-dispute-resolution-agent-controls-playbook.md)
- [action_highradius_recommend](/tools/action-highradius-recommend.md)

## Runs in

- [resolution_posting](/workflow/resolution-posting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dispute-resolution-agent-end-to-end.md)

# Citations

- [Dispute Resolution Agent Controls Playbook](/documents/dispute-resolution-agent-controls-playbook.md)
