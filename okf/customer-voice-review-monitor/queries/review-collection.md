---
type: Query Capability
title: "Ingest reviews daily from G2, Trustpilot, Gartner Peer Insights, and app stor..."
description: "Ingest reviews daily from G2, Trustpilot, Gartner Peer Insights, and app stores. Deduplicate cross-posted reviews and normalize rating scales."
source_id: "review-collection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest reviews daily from G2, Trustpilot, Gartner Peer Insights, and app stores. Deduplicate cross-posted reviews and normalize rating scales.

## Tools used

- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [query_trustpilot_trustpilot_records](/tools/query-trustpilot-trustpilot-records.md)
- [query_gartner_peer_insights_gartner_peer_insights_records](/tools/query-gartner-peer-insights-gartner-peer-insights-records.md)
- [lookup_customer_voice_review_monitor_playbook](/tools/lookup-customer-voice-review-monitor-playbook.md)
- [action_g2_draft](/tools/action-g2-draft.md)

## Runs in

- [review_collection](/workflow/review-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-voice-review-monitor-end-to-end.md)

# Citations

- [Customer Voice & Review Monitor Playbook](/documents/customer-voice-review-monitor-playbook.md)
