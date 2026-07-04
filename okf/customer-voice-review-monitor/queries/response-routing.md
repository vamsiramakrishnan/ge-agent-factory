---
type: Query Capability
title: Draft review responses for negative reviews. Route product intelligence to en...
description: Draft review responses for negative reviews. Route product intelligence to engineering roadmap. Alert PMM on competitive displacement patterns. Track response impact on review ratings.
source_id: "response-routing"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Draft review responses for negative reviews. Route product intelligence to engineering roadmap. Alert PMM on competitive displacement patterns. Track response impact on review ratings.

## Tools used

- [lookup_customer_voice_review_monitor_playbook](/tools/lookup-customer-voice-review-monitor-playbook.md)
- [action_g2_draft](/tools/action-g2-draft.md)

## Runs in

- [response_routing](/workflow/response-routing.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-voice-review-monitor-end-to-end.md)

# Citations

- [Customer Voice & Review Monitor Playbook](/documents/customer-voice-review-monitor-playbook.md)
