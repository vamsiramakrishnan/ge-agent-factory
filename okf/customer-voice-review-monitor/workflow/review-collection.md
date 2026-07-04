---
type: Workflow Stage
title: Review Collection
description: "Ingest reviews daily from G2, Trustpilot, Gartner Peer Insights, and app stores. Deduplicate cross-posted reviews and normalize rating scales."
source_id: review_collection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Review Collection

Ingest reviews daily from G2, Trustpilot, Gartner Peer Insights, and app stores. Deduplicate cross-posted reviews and normalize rating scales.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [query_trustpilot_trustpilot_records](/tools/query-trustpilot-trustpilot-records.md)
- [query_gartner_peer_insights_gartner_peer_insights_records](/tools/query-gartner-peer-insights-gartner-peer-insights-records.md)
- [lookup_customer_voice_review_monitor_playbook](/tools/lookup-customer-voice-review-monitor-playbook.md)
- [action_g2_draft](/tools/action-g2-draft.md)

Next: [Sentiment & Topic Analysis](/workflow/sentiment-topic-analysis.md)
