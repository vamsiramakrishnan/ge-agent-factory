---
type: Query Capability
title: Generate weekly trend brief for marketing leadership. Spike alerts for breako...
description: Generate weekly trend brief for marketing leadership. Spike alerts for breakout trends requiring immediate content response. Feed validated trends into content and campaign planning.
source_id: "brief-alerting"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate weekly trend brief for marketing leadership. Spike alerts for breakout trends requiring immediate content response. Feed validated trends into content and campaign planning.

## Tools used

- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [lookup_market_trend_signal_detector_playbook](/tools/lookup-market-trend-signal-detector-playbook.md)
- [action_google_trends_recommend](/tools/action-google-trends-recommend.md)

## Runs in

- [brief_alerting](/workflow/brief-alerting.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Market Trend & Signal Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-trend-signal-detector-end-to-end.md)

# Citations

- [Market Trend & Signal Detector Playbook](/documents/market-trend-signal-detector-playbook.md)
