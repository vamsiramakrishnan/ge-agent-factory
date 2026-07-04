---
type: Query Capability
title: Deliver prioritized worklist to collectors with context cards showing why eac...
description: Deliver prioritized worklist to collectors with context cards showing why each account is ranked as it is and recommended next action.
source_id: "worklist-distribution"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Deliver prioritized worklist to collectors with context cards showing why each account is ranked as it is and recommended next action.

## Tools used

- [action_highradius_recommend](/tools/action-highradius-recommend.md)

## Runs in

- [worklist_distribution](/workflow/worklist-distribution.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/collections-priority-engine-end-to-end.md)

# Citations

- [Collections Priority Engine Controls Playbook](/documents/collections-priority-engine-controls-playbook.md)
