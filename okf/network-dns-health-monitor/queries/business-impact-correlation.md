---
type: Query Capability
title: "Gemini correlates: 'Intermittent 500ms latency spikes to payment gateway corr..."
description: "Gemini correlates: 'Intermittent 500ms latency spikes to payment gateway correlate with 2PM daily batch job on analytics cluster — they share the same NAT gateway. Recommend separate NAT for payment traffic.'"
source_id: "business-impact-correlation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini correlates: 'Intermittent 500ms latency spikes to payment gateway correlate with 2PM daily batch job on analytics cluster — they share the same NAT gateway. Recommend separate NAT for payment traffic.'

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [business_impact_correlation](/workflow/business-impact-correlation.md)

## Evidence expected

- sql_result

## Evals

- [Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/network-dns-health-monitor-end-to-end.md)

# Citations

- [Network & DNS Health Monitor Operations Runbook](/documents/network-dns-health-monitor-runbook.md)
